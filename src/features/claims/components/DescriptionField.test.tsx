import { render, screen, fireEvent } from "@testing-library/react";
import { DescriptionField } from "./DescriptionField";
import { useRef } from "react";

function DescriptionFieldWithRef() {
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      <DescriptionField ref={ref} value="" onChange={() => {}} />
      <button onClick={() => ref.current?.focus()}>Focus Textarea</button>
    </div>
  );
}

describe("DescriptionField", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with correct label", () => {
    render(<DescriptionField value="" onChange={mockOnChange} />);

    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders as textarea element", () => {
    render(<DescriptionField value="" onChange={mockOnChange} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("displays the provided value", () => {
    const testValue = "This is a test description";
    render(<DescriptionField value={testValue} onChange={mockOnChange} />);

    expect(screen.getByDisplayValue(testValue)).toBeInTheDocument();
  });

  it("calls onChange when value changes", () => {
    render(<DescriptionField value="" onChange={mockOnChange} />);

    const textarea = screen.getByRole("textbox");
    const newValue = "New description text";

    fireEvent.change(textarea, { target: { value: newValue } });

    expect(mockOnChange).toHaveBeenCalledWith(newValue);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("handles multiline text correctly", () => {
    const multilineText = "Line 1\nLine 2\nLine 3";
    render(<DescriptionField value={multilineText} onChange={mockOnChange} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue(multilineText);
  });

  it("displays error message when provided", () => {
    render(
      <DescriptionField
        value=""
        onChange={mockOnChange}
        error="Description is required"
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Description is required"
    );
  });

  it("sets aria-invalid when there is an error", () => {
    render(
      <DescriptionField value="" onChange={mockOnChange} error="Too short" />
    );

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when there is no error", () => {
    render(<DescriptionField value="" onChange={mockOnChange} />);

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-invalid",
      "false"
    );
  });

  it("has correct accessibility attributes", () => {
    render(<DescriptionField value="" onChange={mockOnChange} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-describedby", "description-error");
    expect(textarea).toHaveAttribute("required");
    expect(textarea).toHaveAttribute("id", "description");
  });

  it("forwards ref correctly", () => {
    render(<DescriptionFieldWithRef />);

    const textarea = screen.getByRole("textbox");
    const focusButton = screen.getByText("Focus Textarea");

    // Textarea should not be focused initially
    expect(textarea).not.toHaveFocus();

    // Click button to focus via ref
    fireEvent.click(focusButton);

    // Textarea should now be focused
    expect(textarea).toHaveFocus();
  });

  it("applies correct CSS classes", () => {
    render(<DescriptionField value="" onChange={mockOnChange} />);

    expect(screen.getByRole("textbox")).toHaveClass("claims-textarea");
  });
});
