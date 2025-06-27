import { render, screen } from "@testing-library/react";
import { ClaimsForm } from "../ClaimsForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import axios from "axios";

jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

jest.mock("axios");

const renderWithQueryClient = () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <ClaimsForm />
    </QueryClientProvider>
  );
};

describe("ClaimsForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("renders all form fields and the submit button", () => {
    renderWithQueryClient();

    expect(screen.getByLabelText(/claim date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    const user = userEvent.setup();

    // 👇 This is the correct Jest syntax (not vi.Mock)
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { message: "Claim recorded" },
    });

    renderWithQueryClient();

    await user.type(screen.getByLabelText(/claim date/i), "2025-06-27");
    await user.selectOptions(screen.getByLabelText(/category/i), "Theft");
    await user.type(
      screen.getByLabelText(/description/i),
      "Lost phone during travel"
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/existing claims/i)).toBeInTheDocument();
    expect(screen.getByText(/lost phone during travel/i)).toBeInTheDocument();
  });

  test("does not submit form if required fields are missing", async () => {
    const user = userEvent.setup();
    const handlePost = jest.spyOn(axios, "post").mockClear();

    renderWithQueryClient();

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(handlePost).not.toHaveBeenCalled();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  test("shows error message if submission fails", async () => {
    const user = userEvent.setup();
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("API error"));

    renderWithQueryClient();

    await user.type(screen.getByLabelText(/claim date/i), "2025-06-27");
    await user.selectOptions(screen.getByLabelText(/category/i), "Loss");
    await user.type(
      screen.getByLabelText(/description/i),
      "Dropped phone in river"
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();
  });

  test("submitted claim appears in the list", async () => {
    const user = userEvent.setup();
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { message: "Claim recorded" },
    });

    renderWithQueryClient();

    await user.type(screen.getByLabelText(/claim date/i), "2025-06-27");
    await user.selectOptions(screen.getByLabelText(/category/i), "Theft");
    await user.type(
      screen.getByLabelText(/description/i),
      "Stolen laptop from car"
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/stolen laptop from car/i)
    ).toBeInTheDocument();
  });

  test("shows loading state while submitting", async () => {
    const user = userEvent.setup();
    const delay = () => new Promise((res) => setTimeout(res, 500));
    (axios.post as jest.Mock).mockImplementationOnce(() => delay());

    renderWithQueryClient();

    await user.type(screen.getByLabelText(/claim date/i), "2025-06-27");
    await user.selectOptions(screen.getByLabelText(/category/i), "Theft");
    await user.type(screen.getByLabelText(/description/i), "Slow network test");

    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();
  });

  test("does not submit form with only date filled", async () => {
    const user = userEvent.setup();
    const spy = jest.spyOn(axios, "post");

    renderWithQueryClient();
    await user.type(screen.getByLabelText(/claim date/i), "2025-06-27");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(spy).not.toHaveBeenCalled();
  });
});
