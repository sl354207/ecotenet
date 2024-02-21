/**
 * @jest-environment jsdom
 */

import Category from "@pages/category";
import { render, screen } from "@testing-library/react";

jest.mock("../../components/layouts/Footer");

describe("Category page", () => {
  describe("render", () => {
    it("should render header and footer", () => {
      render(<Category />);
      expect(screen.getByText(/category breakdown/i)).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
});
