import { useState } from "react";

const categories = ["Theft", "Accidental Damage", "Loss"];

export function ClaimsForm() {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submittedClaims, setSubmittedClaims] = useState<
    { date: string; category: string; description: string }[]
  >([]);
  const [, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/submit-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, category, description }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit claim");
      }

      console.log("[debug] Claim submitted successfully");
      setSubmittedClaims((prev) => [...prev, { date, category, description }]);
      setDate("");
      setCategory("");
      setDescription("");
      setError(null);
    } catch (err) {
      console.error("[debug] Failed to submit claim:", err);
      setError("Submission failed. Please try again.");
    }
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
              <option key={cat}>{cat}</option>
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

        <button type="submit" className="claims-button">
          Submit
        </button>
      </form>

      <div className="claims-list">
        <h2>Existing Claims</h2>
        {submittedClaims.map((claim, index) => (
          <div key={index} className="claim-entry">
            <div className="claim-row">
              <strong>Date:</strong> {claim.date}
            </div>
            <div className="claim-row">
              <strong>Category:</strong> {claim.category}
            </div>
            <div className="claim-row">
              <strong>Description:</strong> {claim.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
