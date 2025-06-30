import { useState, useRef } from "react";
import { v4 as uuid } from "uuid";
import { type Claim, type ClaimCategory } from "../types";
import { validateClaim } from "../utils/validation";
import { useSubmitClaim } from "./useSubmitClaim";

export function useClaimsForm() {
  // Form state
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<ClaimCategory | "">("");
  const [description, setDescription] = useState("");
  const [submittedClaims, setSubmittedClaims] = useState<Claim[]>([]);

  // Form refs
  const dateInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLSelectElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  // Error state
  const [dateError, setDateError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // Submit mutation
  const mutation = useSubmitClaim((claim) => {
    const enrichedClaim: Claim = { ...claim, id: uuid() };
    setSubmittedClaims((prev) => [...prev, enrichedClaim]);
    setDate("");
    setCategory("");
    setDescription("");
  });

  const clearErrors = () => {
    setDateError("");
    setCategoryError("");
    setDescriptionError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    // Validate and sanitize input
    const validationResult = validateClaim({
      date,
      category,
      description
    });

    if (!validationResult.success) {
      const { errors } = validationResult;
      if (errors) {
        if (errors.date) {
          setDateError(errors.date);
          dateInputRef.current?.focus();
          return;
        }
        if (errors.category) {
          setCategoryError(errors.category);
          categoryInputRef.current?.focus();
          return;
        }
        if (errors.description) {
          setDescriptionError(errors.description);
          descriptionInputRef.current?.focus();
          return;
        }
      }
      return;
    }

    // Use validated and sanitized data
    const { data: validatedData } = validationResult;
    if (validatedData) {
      mutation.mutate({
        date: validatedData.date as string,
        category: validatedData.category as ClaimCategory,
        description: validatedData.description as string,
        id: "",
      });
    }
  };

  return {
    // Form state
    date,
    setDate,
    category,
    setCategory,
    description,
    setDescription,
    submittedClaims,

    // Form refs
    dateInputRef,
    categoryInputRef,
    descriptionInputRef,

    // Error state
    dateError,
    categoryError,
    descriptionError,

    // Form handlers
    handleSubmit,
    mutation,
  };
}