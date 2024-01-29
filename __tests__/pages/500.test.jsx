/**
 * @jest-environment jsdom
 */

import Custom500 from "@pages/500";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

jest.mock("../../components/layouts/Footer");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();
const reloadMock = jest.fn();

useRouter.mockReturnValue({
  query: {},
  push: pushMock,
  reload: reloadMock,
});

describe("500 page", () => {
  describe("render", () => {
    it("should render header", () => {
      render(<Custom500 />);
      expect(
        screen.getByText(/500 - Internal Server Error/i)
      ).toBeInTheDocument();
    });
    it("should render buttons", () => {
      render(<Custom500 />);
      expect(
        screen.getByRole("button", { name: /refresh/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /go home/i })
      ).toBeInTheDocument();
    });
    it("should render links", () => {
      render(<Custom500 />);
      expect(
        screen.getByRole("link", { name: /support/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /info@ecotenet.org/i })
      ).toBeInTheDocument();
    });
  });

  describe("behaviour", () => {
    const user = userEvent.setup();
    describe("buttons", () => {
      it("should refresh when refresh button is clicked", async () => {
        render(<Custom500 />);
        const button = screen.getByRole("button", { name: /refresh/i });
        await user.click(button);
        await waitFor(() => {
          expect(reloadMock).toHaveBeenCalled();
        });
      });
      it("should go home when go home button is clicked", async () => {
        render(<Custom500 />);
        const button = screen.getByRole("button", { name: /go home/i });

        await user.click(button);

        await waitFor(() => {
          expect(pushMock).toHaveBeenCalledWith("/");
        });
      });
    });
  });
});
