import { forwardRef } from "react";
import { FormField } from "../../../shared/components/FormField";

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const DescriptionField = forwardRef<HTMLTextAreaElement, DescriptionFieldProps>(
  ({ value, onChange, error }, ref) => {
    return (
      <FormField label="Description" htmlFor="description" error={error}>
        <textarea
          id="description"
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="claims-textarea"
          aria-describedby="description-error"
          aria-invalid={!!error}
        />
      </FormField>
    );
  }
);

DescriptionField.displayName = "DescriptionField";