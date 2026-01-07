import { render, screen } from "@testing-library/react";
import { AdContainer } from "../ad-container";

describe("AdContainer", () => {
  it("renders the ad container with proper structure", () => {
    render(<AdContainer />);

    // Check that the container has proper semantic HTML
    const adSection = screen.getByLabelText("Publicidade");
    expect(adSection).toBeInTheDocument();
    expect(adSection.tagName).toBe("ASIDE");

    // Check that the ad label is visible
    expect(screen.getByText("Publicidade")).toBeInTheDocument();

    // Check that the placeholder text is present
    expect(screen.getByText("Espaço reservado para anúncio")).toBeInTheDocument();

    // Check that the descriptive text is present
    expect(
      screen.getByText("Anúncios ajudam a manter a plataforma gratuita")
    ).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    render(<AdContainer className="custom-class" />);

    const adSection = screen.getByLabelText("Publicidade");
    expect(adSection).toHaveClass("custom-class");
  });

  it("has non-intrusive styling classes", () => {
    render(<AdContainer />);

    const adSection = screen.getByLabelText("Publicidade");

    // Check that it doesn't have classes that would make it intrusive
    // (no fixed positioning, no z-index high values, etc.)
    expect(adSection).not.toHaveClass("fixed");
    expect(adSection).not.toHaveClass("absolute");
    expect(adSection).not.toHaveClass("z-50");
  });
});
