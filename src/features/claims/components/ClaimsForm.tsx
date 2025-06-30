import { DateField } from "./DateField";
import { CategoryField } from "./CategoryField";
import { DescriptionField } from "./DescriptionField";
import { ClaimsList } from "./ClaimsList";
import { useClaimsForm } from "../hooks/useClaimsForm";
import "./ClaimsForm.css";

export function ClaimsForm() {
  const {
    date,
    setDate,
    category,
    setCategory,
    description,
    setDescription,
    submittedClaims,
    dateInputRef,
    categoryInputRef,
    descriptionInputRef,
    dateError,
    categoryError,
    descriptionError,
    handleSubmit,
    mutation,
  } = useClaimsForm();

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
        <DateField
          ref={dateInputRef}
          value={date}
          onChange={setDate}
          error={dateError}
        />

        <CategoryField
          ref={categoryInputRef}
          value={category}
          onChange={setCategory}
          error={categoryError}
        />

        <DescriptionField
          ref={descriptionInputRef}
          value={description}
          onChange={setDescription}
          error={descriptionError}
        />

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

      <ClaimsList claims={submittedClaims} />
    </div>
  );
}