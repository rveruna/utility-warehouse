import { render, screen } from "@testing-library/react";
import App from "../App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

test("renders hello message", () => {
  const queryClient = new QueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );

  expect(screen.getByText(/Claims Handling Form/i)).toBeInTheDocument();
});
