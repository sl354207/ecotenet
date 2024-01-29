/**
 * @jest-environment jsdom
 */

import Custom404 from "@pages/404";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

jest.mock("../../components/layouts/Footer");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();
const backMock = jest.fn();

useRouter.mockReturnValue({
  query: {},
  push: pushMock,
  back: backMock,
});

describe("404 page", () => {
  describe("render", () => {
    it("should render header and footer", () => {
      render(<Custom404 />);
      expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
    it("should render buttons", () => {
      render(<Custom404 />);
      expect(
        screen.getByRole("button", { name: /go back/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /go home/i })
      ).toBeInTheDocument();
    });
    it("should render links", () => {
      render(<Custom404 />);
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
      it("should go back when go back button is clicked", async () => {
        render(<Custom404 />);
        const button = screen.getByRole("button", { name: /go back/i });
        await user.click(button);
        await waitFor(() => {
          expect(backMock).toHaveBeenCalled();
        });
      });
      it("should go home when go home button is clicked", async () => {
        render(<Custom404 />);
        const button = screen.getByRole("button", { name: /go home/i });

        await user.click(button);

        await waitFor(() => {
          expect(pushMock).toHaveBeenCalledWith("/");
        });
      });
    });
  });
});
