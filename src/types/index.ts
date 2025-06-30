export type ClaimCategory = "Theft" | "Loss" | "Accidental Damage";

export const claimCategoryValues: readonly ClaimCategory[] = [
  "Theft",
  "Loss",
  "Accidental Damage",
] as const;

export type Claim = {
  id: string;
  date: string;
  category: ClaimCategory;
  description: string;
};
