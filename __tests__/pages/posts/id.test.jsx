/**
 * @jest-environment jsdom
 */
import { SnackbarProvider } from "@components/context/SnackbarContext";
import { useUserContext } from "@components/context/UserContext";
import Post from "@pages/posts/[id]";
import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
// import { signIn } from "next-auth/react";
import customSWRRender from "@utils/testing";
import { useRouter } from "next/router";

jest.mock("../../../components/layouts/Footer");
jest.mock("../../../utils/mongodb/mongoHelpers", () => ({
  getPosts: jest.fn(),
  getPublishedApprovedPostById: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();

useRouter.mockReturnValue({
  query: {},
  push: pushMock,
});

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

let post = {
  _id: "1",
  date: "1234-12-12T12:12:12.000Z",
  title: "test-title",
  description: "test-desc",
  name: "test-name",
  tags: ["tag1", "tag2"],
  updated: false,
  category: {
    title: "test-cat-title",
    sub: "test-cat-sub",
  },
  ecoregions: ["1", "2"],
  originalUrl: "test-url",
  count: 2,
  approved: "true",
  id: "xn0cde",
  version: 1,
  rows: [
    {
      id: "1",
      cells: [
        {
          id: "1",
          size: 12,
          plugin: {
            id: "ory/editor/core/content/slate",
            version: 1,
          },
          dataI18n: {
            default: {
              slate: [
                {
                  type: "PARAGRAPH/PARAGRAPH",
                  children: [
                    {
                      text: "test body text",
                    },
                  ],
                },
              ],
            },
          },
          rows: [],
          inline: null,
        },
      ],
    },
  ],
};

const handlers = [
  rest.get("/api/votes/1", (req, res, ctx) => {
    return res(
      ctx.delay(100),
      ctx.status(200),
      ctx.json([{ count: 2, voters: true }])
    );
  }),
  rest.get("/api/comments/1", (req, res, ctx) => {
    return res(
      ctx.delay(100),
      ctx.status(200),
      ctx.json([
        {
          _id: "1",
          ref: "1",
          date: "1234-12-12T12:12:12.000Z",
          name: "test-name",
          comment: "test 1",
          approved: "true",
          updated: true,
        },

        {
          _id: "2",
          ref: "",
          date: "1234-12-12T12:12:12.000Z",
          name: "test-name",
          comment: "test 2",
          approved: "true",
          updated: false,
        },
      ])
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Post page", () => {
  beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });
  describe("rendering initial", () => {
    it("should render header, footer and flag", () => {
      render(initialComponent(post));
      expect(
        screen.getByRole("heading", {
          name: /test-title/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /flag/i })).toBeInTheDocument();

      expect(
        screen.queryByRole("button", { name: /feature list/i })
      ).not.toBeInTheDocument();
    });
    it("should render post details", () => {
      render(initialComponent(post));
      expect(screen.getByRole("link", { name: /test-name/i })).toHaveAttribute(
        "href",
        "/person/test-name"
      );
      expect(screen.getByRole("link", { name: /Eco-1/i })).toHaveAttribute(
        "href",
        "/ecoregions/1"
      );
      expect(screen.getByRole("link", { name: /Eco-2/i })).toHaveAttribute(
        "href",
        "/ecoregions/2"
      );
    });
    it("should render post body", () => {
      render(initialComponent(post));
      expect(screen.getByText(/test body text/i)).toBeInTheDocument();
    });
    it("should not render original url if not available", () => {
      post.originalUrl = null;
      render(initialComponent(post));
      expect(
        screen.queryByText(/originally posted on/i)
      ).not.toBeInTheDocument();
    });
    it("should render feature button if user is admin", () => {
      useUserContext.mockReturnValueOnce({
        user: {
          email: "test@test.com",
          name: "test-name",
          role: "admin",
          status: "authenticated",
        },
      });
      render(initialComponent(post));
      expect(
        screen.getByRole("button", { name: /feature list/i })
      ).toBeInTheDocument();
    });
  });
  describe("rendering async", () => {
    it("should render vote component", async () => {
      customSWRRender(initialComponent(post));
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /vote/i })).toBeDisabled();
      });
    });
    it("should render error button if votes request fails", async () => {
      server.use(
        rest.get("/api/votes/1", (req, res, ctx) => {
          return res(ctx.delay(100), ctx.status(500));
        })
      );
      customSWRRender(initialComponent(post));
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /error loading/i })
        ).toBeInTheDocument();
      });
    });
    it.todo("should render comments");
  });
});

function initialComponent(post) {
  return (
    <SnackbarProvider>
      <Post post={post} />
    </SnackbarProvider>
  );
}
