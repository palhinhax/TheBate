import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "../ui/password-input";

describe("PasswordInput", () => {
  it("renders with password hidden by default", () => {
    render(<PasswordInput placeholder="Digite sua senha" />);

    const input = screen.getByPlaceholderText("Digite sua senha");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles password visibility when button is clicked", async () => {
    const user = userEvent.setup();
    render(<PasswordInput placeholder="Digite sua senha" />);

    const input = screen.getByPlaceholderText("Digite sua senha");
    const toggleButton = screen.getByTestId("password-toggle");

    // Initially hidden
    expect(input).toHaveAttribute("type", "password");

    // Click to show
    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    // Click to hide again
    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("uses custom aria labels when provided", async () => {
    const user = userEvent.setup();
    render(
      <PasswordInput
        placeholder="Password"
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
      />
    );

    const toggleButton = screen.getByTestId("password-toggle");

    // Initially shows "Show password"
    expect(toggleButton).toHaveAttribute("aria-label", "Show password");

    // After clicking, shows "Hide password"
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-label", "Hide password");
  });

  it("applies custom className", () => {
    render(
      <PasswordInput placeholder="Digite sua senha" className="custom-class" />
    );

    const input = screen.getByPlaceholderText("Digite sua senha");
    expect(input).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<PasswordInput ref={ref} placeholder="Digite sua senha" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("accepts other input props", () => {
    render(
      <PasswordInput
        placeholder="Digite sua senha"
        disabled
        data-testid="password-input"
      />
    );

    const input = screen.getByTestId("password-input");
    expect(input).toBeDisabled();
  });
});
