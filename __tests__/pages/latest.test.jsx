/**
 * @jest-environment jsdom
 */
import Latest from "@pages/latest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import customSWRRender from "@utils/testing";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/latest", (req, res, ctx) => {
    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    if (page === "1") {
      return res(
        ctx.delay(100),
        ctx.status(200),
        ctx.json([
          { id: 1, title: "title 1" },
          { id: 2, title: "title 2" },
          { id: 3, title: "title 3" },
          { id: 4, title: "title 4" },
          { id: 5, title: "title 5" },
          { id: 6, title: "title 6" },
          { id: 7, title: "title 7" },
          { id: 8, title: "title 8" },
          { id: 9, title: "title 9" },
          { id: 10, title: "title 10" },
        ])
      );
    } else if (page === "2") {
      return res(
        ctx.delay(100),
        ctx.status(200),
        ctx.json([
          { id: 11, title: "title 11" },
          { id: 12, title: "title 12" },
          { id: 13, title: "title 13" },
          { id: 14, title: "title 14" },
          { id: 15, title: "title 15" },
          { id: 16, title: "title 16" },
          { id: 17, title: "title 17" },
          { id: 18, title: "title 18" },
          { id: 19, title: "title 19" },
          { id: 20, title: "title 20" },
        ])
      );
    } else if (page === "3") {
      return res(
        ctx.delay(100),
        ctx.status(200),
        ctx.json([{ id: 21, title: "title 21" }])
      );
    } else {
      return res(ctx.status(500));
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock("../../components/layouts/Footer");
jest.mock("../../components/layouts/PostList");
describe("latest posts page", () => {
  describe("rendering initial", () => {
    it("should render header", () => {
      render(<Latest />);
      expect(screen.getByText(/latest posts/i)).toBeInTheDocument();
    });
    it("should render disabled button with loading state", () => {
      render(<Latest />);
      expect(
        screen.getByRole("button", { name: /loading/i })
      ).toBeInTheDocument();

      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled();
    });
    it("should render mocked footer", () => {
      render(<Latest />);
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
  describe("rendering async", () => {
    it("should render header", async () => {
      customSWRRender(<Latest />);
      expect(screen.getByText(/latest posts/i)).toBeInTheDocument();
    });
    it("should render button with load more state", async () => {
      customSWRRender(<Latest />);

      const button = await screen.findByRole("button", {
        name: /load more/i,
      });
      expect(button).toBeInTheDocument();
    });
    it("should render initial mocked postList and footer", async () => {
      customSWRRender(<Latest />);
      const post1 = await screen.findByText("title 1");
      expect(post1).toBeInTheDocument();

      await waitFor(() =>
        expect(screen.queryByText("title 11")).not.toBeInTheDocument()
      );

      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
  describe("behaviour", () => {
    const user = userEvent.setup();
    it("should render more posts when load more button is clicked", async () => {
      customSWRRender(<Latest />);

      const button = await screen.findByRole("button", {
        name: /load more/i,
      });

      await user.click(button);

      const post1 = await screen.findByText("title 1");
      expect(post1).toBeInTheDocument();

      const post11 = await screen.findByText("title 11");
      expect(post11).toBeInTheDocument();

      await waitFor(() =>
        expect(screen.queryByText("title 21")).not.toBeInTheDocument()
      );
    });
    it("should render more posts when load more button is clicked and then say no more posts", async () => {
      customSWRRender(<Latest />);

      const button = await screen.findByRole("button", {
        name: /load more/i,
      });

      await user.click(button);

      const post1 = await screen.findByText("title 1");
      expect(post1).toBeInTheDocument();

      const post11 = await screen.findByText("title 11");
      expect(post11).toBeInTheDocument();

      await waitFor(() =>
        expect(screen.queryByText("title 21")).not.toBeInTheDocument()
      );
      await user.click(button);

      const post21 = await screen.findByText("title 21");
      expect(post21).toBeInTheDocument();

      await waitFor(() =>
        expect(screen.queryByText("title 22")).not.toBeInTheDocument()
      );

      const buttonDisabled = await screen.findByRole("button", {
        name: /no more posts/i,
      });
      expect(buttonDisabled).toBeInTheDocument();
      expect(buttonDisabled).toBeDisabled();
    });

    it("should show error state", async () => {
      server.use(
        rest.get("/api/latest", (req, res, ctx) => {
          return res(ctx.delay(100), ctx.status(500), ctx.json([]));
        })
      );
      customSWRRender(<Latest />);

      const button = await screen.findByRole("button", {
        name: /error loading. retry/i,
      });

      expect(button).toBeInTheDocument();
    });
  });
});
