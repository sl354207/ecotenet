/**
 * @jest-environment jsdom
 */
import { SnackbarProvider } from "@components/context/SnackbarContext";
import { useUserContext } from "@components/context/UserContext";
import Post from "@pages/posts/[id]";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
          comment_ref: "1",
          date: "1234-12-12T12:12:12.000Z",
          name: "test-name",
          text: "test 1",
          approved: "true",
          updated: true,
        },

        {
          _id: "2",
          comment_ref: "",
          date: "1234-12-12T12:12:12.000Z",
          name: "test-name",
          text: "test 2",
          approved: "true",
          updated: false,
        },
      ])
    );
  }),
  rest.put("/api/admin/posts/1", (req, res, ctx) => {
    return res(ctx.delay(100), ctx.status(200));
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const observerMap = new Map();
const instanceMap = new Map();

describe("Post page", () => {
  beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    global.IntersectionObserver = jest.fn((cb, options = {}) => {
      const instance = {
        thresholds: Array.isArray(options.threshold)
          ? options.threshold
          : [options.threshold],
        root: options.root,
        rootMargin: options.rootMargin,
        observe: jest.fn((element) => {
          instanceMap.set(element, instance);
          observerMap.set(element, cb);
        }),
        unobserve: jest.fn((element) => {
          instanceMap.delete(element);
          observerMap.delete(element);
        }),
        disconnect: jest.fn(),
      };
      return instance;
    });
  });
  afterEach(() => {
    global.IntersectionObserver.mockReset();
    instanceMap.clear();
    observerMap.clear();
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
    it("should render disclaimer", () => {
      post = {
        ...post,
        category: {
          title: "test-cat-title",
          sub: "Edible",
        },
      };

      render(initialComponent(post));

      expect(screen.getByText(/disclaimer/i)).toBeInTheDocument();
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
        expect(screen.getByTestId("vote-container")).toBeInTheDocument();
      });
    });
    it("should render comments component", async () => {
      customSWRRender(initialComponent(post));
      // trigger intersection observer callback to show comments
      act(() => {
        intersect(screen.getByTestId("comments-container"), true);
        intersect(screen.getByTestId("comments-container"), false);
        intersect(screen.getByTestId("comments-container"), true);
      });

      await waitFor(() => {
        expect(IntersectionObserver).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(screen.getByText("loading...")).toBeInTheDocument();
      });
    });
  });
  describe("behavior", () => {
    const user = userEvent.setup();

    describe("feature list", () => {
      it("should add post to feature list if feature button is clicked", async () => {
        useUserContext.mockReturnValueOnce({
          user: {
            email: "test@test.com",
            name: "test-name",
            role: "admin",
            status: "authenticated",
          },
        });
        customSWRRender(initialComponent(post));

        await user.click(screen.getByRole("button", { name: /feature list/i }));

        await waitFor(() => {
          expect(
            screen.getByText(/added to feature list/i)
          ).toBeInTheDocument();
        });
      });

      it("should error if feature list request fails", async () => {
        useUserContext.mockReturnValueOnce({
          user: {
            email: "test@test.com",
            name: "test-name",
            role: "admin",
            status: "authenticated",
          },
        });

        server.use(
          rest.put("/api/admin/posts/1", (req, res, ctx) => {
            return res(ctx.status(500));
          })
        );
        customSWRRender(initialComponent(post));

        await user.click(screen.getByRole("button", { name: /feature list/i }));

        await waitFor(() => {
          expect(
            screen.getByText(
              /There was a problem submitting feature. Please try again later/i
            )
          ).toBeInTheDocument();
        });
      });
    });
  });
});

function initialComponent(post) {
  return (
    <SnackbarProvider>
      <Post post={post} />
    </SnackbarProvider>
  );
}

function intersect(element, isIntersecting) {
  const cb = observerMap.get(element);
  if (cb) {
    cb([
      {
        isIntersecting,
        target: element,
        intersectionRatio: isIntersecting ? 1 : -1,
      },
    ]);
  }
}
