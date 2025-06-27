export type ClaimCategory = "Theft" | "Loss" | "Damage" | "Delay";

export const claimCategoryValues: ClaimCategory[] = [
  "Theft",
  "Loss",
  "Damage",
  "Delay",
];

export type Claim = {
  id: string;
  date: string;
  category: ClaimCategory;
  description: string;
};
