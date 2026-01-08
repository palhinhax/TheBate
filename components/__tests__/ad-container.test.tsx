import { render, screen } from "@testing-library/react";
import { AdContainer } from "../ad-container";

describe("AdContainer", () => {
  const originalEnv = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  afterEach(() => {
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID = originalEnv;
  });

  it("renders the ad container with proper structure", () => {
    render(<AdContainer />);

    // Check that the container has proper semantic HTML
    const adSection = screen.getByLabelText("Publicidade");
    expect(adSection).toBeInTheDocument();
    expect(adSection.tagName).toBe("ASIDE");

    // Check that the ad label is visible
    expect(screen.getByText("Publicidade")).toBeInTheDocument();

    // Check that the AdSense component is rendered
    expect(adSection.querySelector(".adsbygoogle, ins")).toBeInTheDocument();
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
