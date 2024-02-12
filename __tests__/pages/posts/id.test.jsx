/**
 * @jest-environment jsdom
 */
import { SnackbarProvider } from "@components/context/SnackbarContext";
// import { useUserContext } from "@components/context/UserContext";
import Post from "@pages/posts/[id]";
import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { rest } from "msw";
// import { setupServer } from "msw/node";
// import { signIn } from "next-auth/react";
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

const post = {
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
  describe("rendering intial", () => {
    it("should render header, footer and flag", () => {
      initialRender(post);
      expect(
        screen.getByRole("heading", {
          name: /test-title/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /flag/i })).toBeInTheDocument();
    });
    it("should render post details", () => {
      initialRender(post);
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
      initialRender(post);
      expect(screen.getByText(/test body text/i)).toBeInTheDocument();
    });
  });
});

function initialRender(post) {
  return render(
    <SnackbarProvider>
      <Post post={post} />
    </SnackbarProvider>
  );
}
