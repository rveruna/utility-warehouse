import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryField } from "./CategoryField";
import { useRef } from "react";

function CategoryFieldWithRef() {
  const ref = useRef<HTMLSelectElement>(null);

  return (
    <div>
      <CategoryField ref={ref} value="" onChange={() => {}} />
      <button onClick={() => ref.current?.focus()}>Focus Select</button>
    </div>
  );
}

describe("CategoryField", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with correct label", () => {
    render(<CategoryField value="" onChange={mockOnChange} />);

    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("displays all category options", () => {
    render(<CategoryField value="" onChange={mockOnChange} />);

    expect(screen.getByText("Select...")).toBeInTheDocument();
    expect(screen.getByText("Theft")).toBeInTheDocument();
    expect(screen.getByText("Loss")).toBeInTheDocument();
    expect(screen.getByText("Accidental Damage")).toBeInTheDocument();
  });

  it("displays the selected value", () => {
    render(<CategoryField value="Theft" onChange={mockOnChange} />);

    expect(screen.getByDisplayValue("Theft")).toBeInTheDocument();
  });

  it("calls onChange when selection changes", () => {
    render(<CategoryField value="" onChange={mockOnChange} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Loss" } });

    expect(mockOnChange).toHaveBeenCalledWith("Loss");
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("handles empty selection", () => {
    render(<CategoryField value="Theft" onChange={mockOnChange} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "" } });

    expect(mockOnChange).toHaveBeenCalledWith("");
  });

  it("displays error message when provided", () => {
    render(
      <CategoryField
        value=""
        onChange={mockOnChange}
        error="Category is required"
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Category is required");
  });

  it("sets aria-invalid when there is an error", () => {
    render(
      <CategoryField
        value=""
        onChange={mockOnChange}
        error="Invalid category"
      />
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("has correct accessibility attributes", () => {
    render(<CategoryField value="" onChange={mockOnChange} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-describedby", "category-error");
    expect(select).toHaveAttribute("required");
    expect(select).toHaveAttribute("id", "category");
  });

  it("forwards ref correctly", () => {
    render(<CategoryFieldWithRef />);

    const select = screen.getByRole("combobox");
    const focusButton = screen.getByText("Focus Select");

    // Select should not be focused initially
    expect(select).not.toHaveFocus();

    // Click button to focus via ref
    fireEvent.click(focusButton);

    // Select should now be focused
    expect(select).toHaveFocus();
  });

  it("option values match ClaimCategory type", () => {
    render(<CategoryField value="" onChange={mockOnChange} />);

    const options = screen.getAllByRole("option");
    const optionValues = options
      .map((option) => option.getAttribute("value"))
      .filter(Boolean);

    // Should have all expected categories
    expect(optionValues).toContain("Theft");
    expect(optionValues).toContain("Loss");
    expect(optionValues).toContain("Accidental Damage");
    expect(optionValues).toHaveLength(3); // Only the actual categories, not the empty option
  });
});
