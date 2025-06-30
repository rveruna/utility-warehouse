import { render, screen, fireEvent } from "@testing-library/react";
import { DateField } from "../DateField";
import { useRef } from "react";

function DateFieldWithRef() {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      <DateField ref={ref} value="2025-01-01" onChange={() => {}} />
      <button onClick={() => ref.current?.focus()}>Focus Input</button>
    </div>
  );
}

describe("DateField", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with correct label and type", () => {
    render(<DateField value="" onChange={mockOnChange} />);

    expect(screen.getByText("Claim Date")).toBeInTheDocument();
    expect(screen.getByDisplayValue("")).toHaveAttribute("type", "date");
  });

  it("displays the provided value", () => {
    render(<DateField value="2025-01-15" onChange={mockOnChange} />);

    expect(screen.getByDisplayValue("2025-01-15")).toBeInTheDocument();
  });

  it("calls onChange when value changes", () => {
    render(<DateField value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Claim Date");
    fireEvent.change(input, { target: { value: "2025-12-25" } });

    expect(mockOnChange).toHaveBeenCalledWith("2025-12-25");
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("displays error message when provided", () => {
    render(
      <DateField value="" onChange={mockOnChange} error="Date is required" />
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Date is required");
  });

  it("sets aria-invalid when there is an error", () => {
    render(<DateField value="" onChange={mockOnChange} error="Invalid date" />);

    expect(screen.getByLabelText("Claim Date")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("does not set aria-invalid when there is no error", () => {
    render(<DateField value="" onChange={mockOnChange} />);

    expect(screen.getByLabelText("Claim Date")).toHaveAttribute(
      "aria-invalid",
      "false"
    );
  });

  it("has correct accessibility attributes", () => {
    render(<DateField value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Claim Date");
    expect(input).toHaveAttribute("aria-describedby", "date-error");
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("id", "date");
  });

  it("forwards ref correctly", () => {
    render(<DateFieldWithRef />);

    const input = screen.getByLabelText("Claim Date");
    const focusButton = screen.getByText("Focus Input");

    // Input should not be focused initially
    expect(input).not.toHaveFocus();

    // Click button to focus via ref
    fireEvent.click(focusButton);

    // Input should now be focused
    expect(input).toHaveFocus();
  });
});
