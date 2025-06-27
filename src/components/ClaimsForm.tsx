import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useSubmitClaim } from "../hooks/useSubmitClaim";
import { claimCategoryValues, type Claim, type ClaimCategory } from "../types";

export function ClaimsForm() {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<ClaimCategory | "">("");
  const [description, setDescription] = useState("");
  const [submittedClaims, setSubmittedClaims] = useState<Claim[]>([]);

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
      valid = false;
    }
    if (!category) {
      setCategoryError("Category is required");
      valid = false;
    }
    if (!description) {
      setDescriptionError("Description is required");
      valid = false;
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
      <h1 className="claims-title">Claims Handling Form</h1>

      <form className="claims-form" onSubmit={handleSubmit} noValidate>
        <div className="claims-field">
          <label htmlFor="date" className="claims-label">
            Claim Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="claims-input"
          />
          <p id="date-error" className="claims-error">
            {dateError || "\u00A0"}
          </p>
        </div>

        <div className="claims-field">
          <label htmlFor="category" className="claims-label">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ClaimCategory)}
            required
            className="claims-select"
          >
            <option value="">Select...</option>
            {claimCategoryValues.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <p id="category-error" className="claims-error">
            {categoryError || "\u00A0"}
          </p>
        </div>

        <div className="claims-field">
          <label htmlFor="description" className="claims-label">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="claims-textarea"
          />
          <p id="description-error" className="claims-error">
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
        <div className="claims-error">
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
