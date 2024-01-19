/**
 * @jest-environment jsdom
 */
import Latest from "@pages/latest";
import { render, screen } from "@testing-library/react";

jest.mock("../../components/layouts/Footer");
describe("latest posts page", () => {
  describe("rendering", () => {
    it("should render header", () => {
      render(<Latest />);
      expect(screen.getByText(/latest posts/i)).toBeInTheDocument();
    });
    it("should render button with loading state", () => {
      render(<Latest />);
      expect(
        screen.getByRole("button", { name: /loading/i })
      ).toBeInTheDocument();
    });
    it("should render mocked footer", () => {
      render(<Latest />);
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
  describe("behaviour", () => {
    it.todo("should render latest posts");
  });
});
