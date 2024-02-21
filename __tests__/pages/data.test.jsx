/**
 * @jest-environment jsdom
 */

import Data from "@pages/data";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

jest.mock("../../components/layouts/Footer");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {},
});

describe("Data page", () => {
  describe("render", () => {
    it("should render header and footer", () => {
      render(<Data />);
      expect(
        screen.getByRole("heading", {
          name: "Datasets",
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
});
