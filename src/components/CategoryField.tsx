import { forwardRef } from "react";
import { FormField } from "./FormField";
import { claimCategoryValues, type ClaimCategory } from "../types";

interface CategoryFieldProps {
  value: ClaimCategory | "";
  onChange: (value: ClaimCategory | "") => void;
  error?: string;
}

export const CategoryField = forwardRef<HTMLSelectElement, CategoryFieldProps>(
  ({ value, onChange, error }, ref) => {
    return (
      <FormField label="Category" htmlFor="category" error={error}>
        <select
          id="category"
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value as ClaimCategory)}
          required
          className="claims-select"
          aria-describedby="category-error"
          aria-invalid={!!error}
        >
          <option value="">Select...</option>
          {claimCategoryValues.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </FormField>
    );
  }
);

CategoryField.displayName = "CategoryField";