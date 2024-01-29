/**
 * @jest-environment jsdom
 */

import Privacy from "@pages/privacy";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

jest.mock("../../components/layouts/Footer");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {},
});

describe("Privacy page", () => {
  describe("render", () => {
    it("should render header and footer", () => {
      render(<Privacy />);
      expect(
        screen.getByRole("heading", {
          name: "Privacy Policy",
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
});
