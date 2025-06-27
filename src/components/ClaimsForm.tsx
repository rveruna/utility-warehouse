import "./ClaimsForm.css";

const categories = ["Theft", "Accidental Damage", "Loss"];

export function ClaimsForm() {
  return (
    <div className="claims-container">
      <h1 className="claims-title">Claims Handling Form</h1>

      <form className="claims-form">
        <div className="claims-field">
          <label htmlFor="date" className="claims-label">
            Claim Date
          </label>
          <input id="date" type="date" className="claims-input" />
        </div>

        <div className="claims-field">
          <label htmlFor="category" className="claims-label">
            Category
          </label>
          <select id="category" className="claims-select">
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
          <textarea id="description" className="claims-textarea" />
        </div>

        <button type="submit" className="claims-button">
          Submit
        </button>
      </form>
    </div>
  );
}
