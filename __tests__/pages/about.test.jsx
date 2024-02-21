/**
 * @jest-environment jsdom
 */

import About from "@pages/about";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

jest.mock("../../components/layouts/Footer");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {},
});

describe("About page", () => {
  describe("render", () => {
    it("should render header and footer", () => {
      render(<About />);
      expect(screen.getByText(/ecotenet mission/i)).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
});
