/**
 * @jest-environment jsdom
 */

import How from "@pages/how";
import { render, screen } from "@testing-library/react";

jest.mock("../../components/layouts/Footer");

describe("How-To page", () => {
  describe("render", () => {
    it("should render header and footer", () => {
      render(<How />);
      expect(
        screen.getByRole("heading", {
          name: "How to Create a Post",
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
    it("should render videos", () => {
      render(<How />);
      expect(
        screen.getByTitle(/creating a post on ecotenet/i)
      ).toBeInTheDocument();
    });
  });
});
