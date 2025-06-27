import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useSubmitClaim } from "../useSubmitClaim";

jest.mock("axios");

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

test("calls onSuccess with claim data when submission succeeds", async () => {
  const mockClaim = {
    date: "2025-06-27",
    category: "Loss",
    description: "Broken window",
  };

  (axios.post as jest.Mock).mockResolvedValueOnce({ data: { message: "OK" } });
  const onSuccess = jest.fn();

  const { result } = renderHook(() => useSubmitClaim(onSuccess), { wrapper });

  await result.current.mutateAsync(mockClaim);

  expect(axios.post).toHaveBeenCalledWith("/api/submit-claim", mockClaim);
  expect(onSuccess).toHaveBeenCalledWith(mockClaim);
});

test("calls onError when submission fails", async () => {
  const error = new Error("API failed");
  (axios.post as jest.Mock).mockRejectedValueOnce(error);
  const onError = jest.fn();

  const { result } = renderHook(() => useSubmitClaim(jest.fn(), onError), {
    wrapper,
  });

  await expect(
    result.current.mutateAsync({
      date: "2025-06-27",
      category: "Loss",
      description: "Something",
    })
  ).rejects.toThrow("API failed");

  expect(onError).toHaveBeenCalledWith(error);
});
