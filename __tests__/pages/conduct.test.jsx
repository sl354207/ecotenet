/**
 * @jest-environment jsdom
 */

import Conduct from "@pages/conduct";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

jest.mock("../../components/layouts/Footer");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {},
});

describe("Conduct page", () => {
  describe("render", () => {
    it("should render header and footer", () => {
      render(<Conduct />);
      expect(
        screen.getByRole("heading", {
          name: "Code of Conduct",
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
});
