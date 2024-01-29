/**
 * @jest-environment jsdom
 */

import Contact from "@pages/contact";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

jest.mock("../../components/layouts/Footer");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {},
});

describe("Contact page", () => {
  describe("render", () => {
    it("should render header and footer", () => {
      render(<Contact />);
      expect(
        screen.getByRole("heading", {
          name: "Contact Us",
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
});
