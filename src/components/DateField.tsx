import { forwardRef } from "react";
import { FormField } from "./FormField";

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  ({ value, onChange, error }, ref) => {
    return (
      <FormField label="Claim Date" htmlFor="date" error={error}>
        <input
          id="date"
          ref={ref}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="claims-input"
          aria-describedby="date-error"
          aria-invalid={!!error}
        />
      </FormField>
    );
  }
);

DateField.displayName = "DateField";