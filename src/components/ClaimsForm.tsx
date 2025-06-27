import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useSubmitClaim } from "../hooks/useSubmitClaim";
import type { Claim, ClaimCategory } from "../types";
import { categories } from "../constants.ts";

export function ClaimsForm() {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submittedClaims, setSubmittedClaims] = useState<Claim[]>([]);

  const mutation = useSubmitClaim((claim) => {
    const enrichedClaim: Claim = { ...claim, id: uuid() };
    setSubmittedClaims((prev) => [...prev, enrichedClaim]);
    setDate("");
    setCategory("");
    setDescription("");
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

      <form className="claims-form" onSubmit={handleSubmit}>
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
        </div>

        <div className="claims-field">
          <label htmlFor="category" className="claims-label">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="claims-select"
          >
            <option value="">Select...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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
