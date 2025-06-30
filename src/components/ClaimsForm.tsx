import { useState, useRef } from "react";
import { v4 as uuid } from "uuid";
import { useSubmitClaim } from "../hooks/useSubmitClaim";
import { claimCategoryValues, type Claim, type ClaimCategory } from "../types";
import "./ClaimsForm.css";

export function ClaimsForm() {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<ClaimCategory | "">("");
  const [description, setDescription] = useState("");
  const [submittedClaims, setSubmittedClaims] = useState<Claim[]>([]);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLSelectElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const [dateError, setDateError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const mutation = useSubmitClaim((claim) => {
    const enrichedClaim: Claim = { ...claim, id: uuid() };
    setSubmittedClaims((prev) => [...prev, enrichedClaim]);
    setDate("");
    setCategory("");
    setDescription("");
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    setDateError("");
    setCategoryError("");
    setDescriptionError("");

    if (!date) {
      setDateError("Date is required");
      dateInputRef.current?.focus();
      valid = false;
      return;
    }

    if (!category) {
      setCategoryError("Category is required");
      categoryInputRef.current?.focus();
      valid = false;
      return;
    }

    if (!description) {
      setDescriptionError("Description is required");
      descriptionInputRef.current?.focus();
      valid = false;
      return;
    }

    if (!valid) return;

    mutation.mutate({
      date,
      category: category as ClaimCategory,
      description,
      id: "",
    });
  };

  return (
    <div className="claims-container">
      <h1 id="form-heading" className="claims-title">
        Claims Handling Form
      </h1>

      <form
        aria-labelledby="form-heading"
        className="claims-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="claims-field">
          <label htmlFor="date" className="claims-label">
            Claim Date
          </label>
          <input
            id="date"
            ref={dateInputRef}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="claims-input"
            aria-describedby="date-error"
            aria-invalid={!!dateError}
          />
          <p
            id="date-error"
            className="claims-error"
            role={dateError ? "alert" : undefined}
          >
            {dateError || "\u00A0"}
          </p>
        </div>

        <div className="claims-field">
          <label htmlFor="category" className="claims-label">
            Category
          </label>
          <select
            id="category"
            ref={categoryInputRef}
            value={category}
            onChange={(e) => setCategory(e.target.value as ClaimCategory)}
            required
            className="claims-select"
            aria-describedby="category-error"
            aria-invalid={!!categoryError}
          >
            <option value="">Select...</option>
            {claimCategoryValues.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <p
            id="category-error"
            className="claims-error"
            role={categoryError ? "alert" : undefined}
          >
            {categoryError || "\u00A0"}
          </p>
        </div>

        <div className="claims-field">
          <label htmlFor="description" className="claims-label">
            Description
          </label>
          <textarea
            id="description"
            ref={descriptionInputRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="claims-textarea"
            aria-describedby="description-error"
            aria-invalid={!!descriptionError}
          />
          <p
            id="description-error"
            className="claims-error"
            role={descriptionError ? "alert" : undefined}
          >
            {descriptionError || "\u00A0"}
          </p>
        </div>

        <button
          type="submit"
          className="claims-button"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>

      {mutation.isError && (
        <div className="claims-error" role="alert">
          Something went wrong. Please try again.
        </div>
      )}

      {submittedClaims.length > 0 && (
        <div className="claims-list">
          <h2>Existing Claims</h2>
          <ul>
            {submittedClaims.map((claim) => (
              <li key={claim.id}>
                <strong>
                  {claim.date} {claim.category}
                </strong>
                <br />
                {claim.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
