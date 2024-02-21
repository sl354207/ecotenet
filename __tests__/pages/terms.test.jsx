/**
 * @jest-environment jsdom
 */

import Terms from "@pages/terms";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

jest.mock("../../components/layouts/Footer");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {},
});

describe("Terms page", () => {
  describe("render", () => {
    it("should render header and footer", () => {
      render(<Terms />);
      expect(
        screen.getByRole("heading", {
          name: "Terms of Service",
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
});
