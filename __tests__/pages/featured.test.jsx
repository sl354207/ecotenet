/**
 * @jest-environment jsdom
 */
import Featured from "@pages/featured";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

const featured = [
  { id: 1, title: "title 1" },
  { id: 2, title: "title 2" },
  { id: 3, title: "title 3" },
  { id: 4, title: "title 4" },
  { id: 5, title: "title 5" },
];

jest.mock("../../components/layouts/Footer");
jest.mock("../../components/layouts/PostList");
jest.mock("../../utils/mongodb/mongoHelpers", () => ({
  getFeatures: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();

useRouter.mockReturnValue({
  query: {},
  push: pushMock,
});

describe("Featured posts page", () => {
  describe("rendering", () => {
    it("should render header and footer", () => {
      render(<Featured featured={featured} />);
      expect(screen.getByText(/Featured 5/i)).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
    it("should render mocked features", () => {
      render(<Featured featured={featured} />);
      expect(screen.getByText(/title 1/i)).toBeInTheDocument();
    });
    it("should render buttons", () => {
      render(<Featured featured={featured} />);
      expect(
        screen.getByRole("button", { name: /ideas behind ecotenet/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /how to create a post/i })
      ).toBeInTheDocument();
    });
  });

  describe("behaviour", () => {
    const user = userEvent.setup();
    it("should route to ideas route when ideas button is clicked", async () => {
      render(<Featured featured={featured} />);

      const button = screen.getByRole("button", {
        name: /ideas behind ecotenet/i,
      });

      await user.click(button);

      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/ideas");
      });
    });
    it("should route to how route when how-to button is clicked", async () => {
      render(<Featured featured={featured} />);

      const button = screen.getByRole("button", {
        name: /how to create a post/i,
      });

      await user.click(button);

      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/how");
      });
    });
  });
});
