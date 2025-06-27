export type ClaimCategory = "Theft" | "Loss" | "Damage" | "Delay";

export const ClaimCategoryValues: ClaimCategory[] = [
  "Theft",
  "Loss",
  "Damage",
  "Delay",
];

export interface Claim {
  id: string;
  date: string;
  category: ClaimCategory;
  description: string;
}
