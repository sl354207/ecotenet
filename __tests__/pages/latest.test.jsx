/**
 * @jest-environment jsdom
 */
import Latest from "@pages/latest";
import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { SWRConfig } from "swr";

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
        ])
      );
    } else if (page === "2") {
      return res(
        ctx.delay(100),
        ctx.status(200),
        ctx.json([
          { id: 1, title: "title 1" },
          { id: 2, title: "title 2" },
          { id: 3, title: "title 3" },
          { id: 4, title: "title 4" },
        ])
      );
    } else {
      return res(
        ctx.delay(100),
        ctx.status(200),
        ctx.json([
          { id: 1, title: "title 1" },
          { id: 2, title: "title 2" },
          { id: 3, title: "title 3" },
          { id: 4, title: "title 4" },
          { id: 5, title: "title 5" },
        ])
      );
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
      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            provider: () => new Map(),
          }}
        >
          <Latest />
        </SWRConfig>
      );
      expect(screen.getByText(/latest posts/i)).toBeInTheDocument();
    });
    it("should render button with load more state", async () => {
      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            provider: () => new Map(),
          }}
        >
          <Latest />
        </SWRConfig>
      );

      const button = await screen.findByRole("button", {
        name: /load more/i,
      });
      expect(button).toBeInTheDocument();
    });
    it("should render initial mocked postList and footer", async () => {
      render(
        <SWRConfig
          value={{
            dedupingInterval: 0,
            provider: () => new Map(),
          }}
        >
          <Latest />
        </SWRConfig>
      );
      const post1 = await screen.findByText(/title 1/i);
      expect(post1).toBeInTheDocument();

      await waitFor(() =>
        expect(screen.queryByText(/title 3/i)).not.toBeInTheDocument()
      );

      expect;
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
  describe("behaviour", () => {
    it.todo("should render latest posts");
  });
});
