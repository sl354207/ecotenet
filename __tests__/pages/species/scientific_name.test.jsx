/**
 * @jest-environment jsdom
 */
import { SnackbarProvider } from "@components/context/SnackbarContext";
import Species from "@pages/species/[scientific_name]";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { useRouter } from "next/router";

jest.mock("../../../components/layouts/Footer");
jest.mock("../../../utils/mongodb/mongoHelpers", () => ({
  getSpeciesByScientificName: jest.fn(),
}));
jest.mock("../../../components/context/UserContext", () => ({
  useUserContext: jest.fn(() => ({
    user: {
      email: "test@test.com",
      name: "test-name",
      role: "user",
      status: "authenticated",
    },
  })),
}));

const species = {
  scientific_name: "test scientific name",
  common_name: "test-common-name",
  unique_id: ["1", "2"],
};

const wiki = {
  title: "test-title",
  segmentedContent: "test content",
};

jest.mock("isomorphic-dompurify", () => ({
  DOMPurify: jest.fn(),
  sanitize: jest.fn(() => wiki.segmentedContent),
}));
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();

useRouter.mockReturnValue({
  query: {},
  push: pushMock,
});

const server = setupServer(
  rest.post("/api/dashboard/flags", (req, res, ctx) => {
    return res(ctx.delay(100), ctx.status(200), ctx.json("success"));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Species page", () => {
  describe("rendering", () => {
    it("should render header with common name and footer", () => {
      render(<Species species={species} wiki={wiki} />);
      expect(
        screen.getByRole("heading", {
          name: /test scientific name: test-common-name/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
    it("should render header without common name and footer", () => {
      species.common_name = null;
      render(<Species species={species} wiki={wiki} />);
      expect(
        screen.getByRole("heading", {
          name: /test scientific name/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("heading", {
          name: /test-common-name/i,
        })
      ).not.toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
    it("should render wiki source link", () => {
      render(<Species species={species} wiki={wiki} />);
      expect(screen.getByRole("link", { name: /wikipedia/i })).toHaveAttribute(
        "href",
        "https://en.wikipedia.org/wiki/test_scientific_name?redirect=true"
      );
    });
    it("should render links to ecoregions", () => {
      render(<Species species={species} wiki={wiki} />);

      expect(screen.getByRole("link", { name: /Eco-1/i })).toHaveAttribute(
        "href",
        "/ecoregions/1"
      );

      expect(screen.getByRole("link", { name: /Eco-2/i })).toHaveAttribute(
        "href",
        "/ecoregions/2"
      );
    });
    it("should render wiki content", () => {
      render(<Species species={species} wiki={wiki} />);

      expect(screen.getByText(/test content/i)).toBeInTheDocument();
    });
    it("should render no wiki data message", () => {
      render(<Species species={species} wiki={null} />);
      expect(
        screen.getByText(/We currently don't have a summary of this species/i)
      ).toBeInTheDocument();
    });
    it("should render flag button", () => {
      render(<Species species={species} wiki={wiki} />);
      expect(screen.getByRole("button", { name: /flag/i })).toBeInTheDocument();
    });
  });
  describe("behavior", () => {
    const user = userEvent.setup();
    it("should toggle between tabs", async () => {
      render(<Species species={species} wiki={wiki} />);

      user.click(screen.getByRole("tab", { name: /additional resources/i }));
      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: /inaturalist/i })
        ).toHaveAttribute(
          "href",
          "https://www.inaturalist.org/search?q=test+scientific+name"
        );
      });

      user.click(screen.getByRole("tab", { name: /general info/i }));
      await waitFor(() => {
        expect(screen.getByText(/test content/i)).toBeInTheDocument();
      });
    });
    describe("flagging", () => {
      it("should open flag dialog", async () => {
        openDialog(user);
        await waitFor(() => {
          expect(screen.getByText(/flag species/i)).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(
            screen.getByRole("button", { name: /cancel/i })
          ).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(
            screen.getByRole("button", { name: /submit/i })
          ).toBeDisabled();
        });
      });
      it('should close flag dialog if "cancel" is clicked', async () => {
        openDialog(user);

        await waitFor(() => {
          expect(
            screen.getByRole("button", { name: /cancel/i })
          ).toBeInTheDocument();
        });

        user.click(screen.getByRole("button", { name: /cancel/i }));

        await waitFor(() => {
          expect(screen.queryByText(/flag species/i)).not.toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText(/test content/i)).toBeInTheDocument();
        });
      });

      it("should submit flag if 'submit' is clicked", async () => {
        openDialog(user);
        await waitFor(() => {
          expect(
            screen.getByRole("button", { name: /submit/i })
          ).toBeInTheDocument();
        });
        user.type(screen.getByRole("textbox"), "test flag");
        await waitFor(() => {
          expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
        });
        user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
          expect(screen.getByText(/test content/i)).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.queryByText(/flag species/i)).not.toBeInTheDocument();
        });
        await waitFor(() => {
          expect(
            screen.getByText(/flag submitted successfully/i)
          ).toBeInTheDocument();
        });
      });
      it("should return error message when problem submitting flag", async () => {
        server.use(
          rest.post("/api/dashboard/flags", (req, res, ctx) => {
            return res(ctx.delay(100), ctx.status(500), ctx.json([]));
          })
        );
        openDialog(user);
        await waitFor(() => {
          expect(
            screen.getByRole("button", { name: /submit/i })
          ).toBeInTheDocument();
        });
        user.type(screen.getByRole("textbox"), "test flag");
        await waitFor(() => {
          expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
        });
        user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
          expect(screen.getByText(/test content/i)).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.queryByText(/flag species/i)).not.toBeInTheDocument();
        });
        await waitFor(() => {
          expect(
            screen.getByText(
              "There was a problem submitting flag. Please try again later"
            )
          ).toBeInTheDocument();
        });
      });
    });
  });
});

function openDialog(user) {
  render(
    <SnackbarProvider>
      <Species species={species} wiki={wiki} />
    </SnackbarProvider>
  );
  user.click(screen.getByRole("button", { name: /flag/i }));
}
