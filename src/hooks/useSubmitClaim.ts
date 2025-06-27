import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { Claim } from "../types";

export function useSubmitClaim(
  onSuccess: (claim: Claim) => void,
  onError?: (err: unknown) => void
) {
  return useMutation({
    mutationFn: (data: Claim) => axios.post("/api/submit-claim", data),
    onSuccess: (_, variables) => {
      console.log("[debug] ✅ Claim submitted successfully");
      onSuccess(variables);
    },
    onError: (err) => {
      console.error("[debug] ❌ Failed to submit claim:", err);
      onError?.(err);
    },
  });
}
