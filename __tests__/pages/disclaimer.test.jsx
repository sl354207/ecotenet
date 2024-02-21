/**
 * @jest-environment jsdom
 */

import Disclaimer from "@pages/disclaimer";
import { render, screen } from "@testing-library/react";

jest.mock("../../components/layouts/Footer");

describe("Disclaimer page", () => {
  describe("render", () => {
    it("should render header and footer", () => {
      render(<Disclaimer />);
      expect(
        screen.getByRole("heading", {
          name: "Disclaimer",
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
});
