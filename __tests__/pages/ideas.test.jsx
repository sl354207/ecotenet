/**
 * @jest-environment jsdom
 */

import Ideas from "@pages/ideas";
import { render, screen } from "@testing-library/react";

jest.mock("../../components/layouts/Footer");

describe("Ideas page", () => {
  describe("render", () => {
    it("should render header and footer", () => {
      render(<Ideas />);
      expect(
        screen.getByRole("heading", {
          name: "Ideas behind Ecotenet",
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
});
