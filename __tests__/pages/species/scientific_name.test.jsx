/**
 * @jest-environment jsdom
 */
import Species from "@pages/species/[scientific_name]";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

jest.mock("../../../components/layouts/Footer");
jest.mock("../../../utils/mongodb/mongoHelpers", () => ({
  getSpeciesByScientificName: jest.fn(),
}));
jest.mock("../../../components/context/UserContext", () => ({
  useUserContext: jest.fn(() => ({
    user: {
      email: "test@test.com",
      name: "test-name",
      role: "user",
      status: "authenticated",
    },
  })),
}));

const species = {
  scientific_name: "test scientific name",
  common_name: "test-common-name",
  unique_id: ["1", "2"],
};

const wiki = {
  title: "test-title",
  segmentedContent: "test content",
};

jest.mock("isomorphic-dompurify", () => ({
  DOMPurify: jest.fn(),
  sanitize: jest.fn(() => wiki.segmentedContent),
}));
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();

useRouter.mockReturnValue({
  query: {},
  push: pushMock,
});

describe("Species page", () => {
  describe("rendering", () => {
    // sanitize.mockReturnValueOnce("test content");
    it("should render header with common name and footer", () => {
      render(<Species species={species} wiki={wiki} />);
      expect(
        screen.getByRole("heading", {
          name: /test scientific name: test-common-name/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
    it("should render header without common name and footer", () => {
      species.common_name = null;
      render(<Species species={species} wiki={wiki} />);
      expect(
        screen.getByRole("heading", {
          name: /test scientific name/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("heading", {
          name: /test-common-name/i,
        })
      ).not.toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
    it("should render wiki source link", () => {
      render(<Species species={species} wiki={wiki} />);
      expect(screen.getByRole("link", { name: /wikipedia/i })).toHaveAttribute(
        "href",
        "https://en.wikipedia.org/wiki/test_scientific_name?redirect=true"
      );
    });
    it("should render links to ecoregions", () => {
      render(<Species species={species} wiki={wiki} />);

      expect(screen.getByRole("link", { name: /Eco-1/i })).toHaveAttribute(
        "href",
        "/ecoregions/1"
      );

      expect(screen.getByRole("link", { name: /Eco-2/i })).toHaveAttribute(
        "href",
        "/ecoregions/2"
      );
    });
    it("should render wiki content", () => {
      render(<Species species={species} wiki={wiki} />);

      expect(screen.getByText(/test content/i)).toBeInTheDocument();
    });
    it("should render flag button", () => {
      render(<Species species={species} wiki={wiki} />);
      expect(screen.getByRole("button", { name: /flag/i })).toBeInTheDocument();
    });
  });
  // describe('behavior', () => {
  //   it('should', () => {
  //     render(<Species species={species} wiki={wiki} />);
  //     expect(screen.getByRole('button', { name: /flag/i })).toBeInTheDocument();
  //   });
  // });
});
