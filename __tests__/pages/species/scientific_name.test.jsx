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

jest.mock("isomorphic-dompurify", () => ({
  DOMPurify: jest.fn(),
  sanitize: jest.fn(() => "sanitized"),
}));
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();

useRouter.mockReturnValue({
  query: {},
  push: pushMock,
});

const species = {
  scientific_name: "test-scientific-name",
  common_name: "test-common-name",
  unique_id: ["1", "2"],
};

const wiki = {
  title: "test-title",
  segmentedContent: "test content",
};

describe("Species page", () => {
  describe("rendering", () => {
    it("should render header and footer", () => {
      render(<Species species={species} wiki={wiki} />);
      expect(
        screen.getByRole("heading", {
          name: /test-scientific-name/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/mocked footer/i)).toBeInTheDocument();
    });
  });
});
