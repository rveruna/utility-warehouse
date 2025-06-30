import { type ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="claims-field">
      <label htmlFor={htmlFor} className="claims-label">
        {label}
      </label>
      {children}
      <p
        id={`${htmlFor}-error`}
        data-testid={`${htmlFor}-error`}
        className="claims-error"
        role={error ? "alert" : undefined}
      >
        {error || "\u00A0"}
      </p>
    </div>
  );
}