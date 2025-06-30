import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClaimsForm } from '../useClaimsForm';
import * as validationModule from '../../utils/validation';

// Mock the validation module
jest.mock('../../utils/validation');
const mockValidateClaim = validationModule.validateClaim as jest.MockedFunction<typeof validationModule.validateClaim>;

// Mock axios for useSubmitClaim
jest.mock('axios', () => ({
  post: jest.fn()
}));

// Wrapper component for React Query
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useClaimsForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty form state', () => {
    const { result } = renderHook(() => useClaimsForm(), {
      wrapper: createWrapper(),
    });

    expect(result.current.date).toBe('');
    expect(result.current.category).toBe('');
    expect(result.current.description).toBe('');
    expect(result.current.submittedClaims).toEqual([]);
  });

  it('initializes with empty error state', () => {
    const { result } = renderHook(() => useClaimsForm(), {
      wrapper: createWrapper(),
    });

    expect(result.current.dateError).toBe('');
    expect(result.current.categoryError).toBe('');
    expect(result.current.descriptionError).toBe('');
  });

  it('provides refs for form fields', () => {
    const { result } = renderHook(() => useClaimsForm(), {
      wrapper: createWrapper(),
    });

    expect(result.current.dateInputRef.current).toBeNull(); // Not attached to DOM
    expect(result.current.categoryInputRef.current).toBeNull();
    expect(result.current.descriptionInputRef.current).toBeNull();
  });

  it('updates form state when setters are called', () => {
    const { result } = renderHook(() => useClaimsForm(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setDate('2025-01-15');
      result.current.setCategory('Theft');
      result.current.setDescription('Test description');
    });

    expect(result.current.date).toBe('2025-01-15');
    expect(result.current.category).toBe('Theft');
    expect(result.current.description).toBe('Test description');
  });

  it('shows validation errors when form is invalid', () => {
    mockValidateClaim.mockReturnValue({
      success: false,
      errors: {
        date: 'Date is required',
        category: 'Category is required',
        description: 'Description is required'
      }
    });

    const { result } = renderHook(() => useClaimsForm(), {
      wrapper: createWrapper(),
    });

    const mockEvent = { preventDefault: jest.fn() } as any;

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(result.current.dateError).toBe('Date is required');
    expect(result.current.categoryError).toBe('');
    expect(result.current.descriptionError).toBe('');
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('shows category error when date is valid but category is invalid', () => {
    mockValidateClaim.mockReturnValue({
      success: false,
      errors: {
        category: 'Category is required'
      }
    });

    const { result } = renderHook(() => useClaimsForm(), {
      wrapper: createWrapper(),
    });

    const mockEvent = { preventDefault: jest.fn() } as any;

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(result.current.dateError).toBe('');
    expect(result.current.categoryError).toBe('Category is required');
    expect(result.current.descriptionError).toBe('');
  });

  it('shows description error when date and category are valid but description is invalid', () => {
    mockValidateClaim.mockReturnValue({
      success: false,
      errors: {
        description: 'Description must be at least 10 characters'
      }
    });

    const { result } = renderHook(() => useClaimsForm(), {
      wrapper: createWrapper(),
    });

    const mockEvent = { preventDefault: jest.fn() } as any;

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(result.current.dateError).toBe('');
    expect(result.current.categoryError).toBe('');
    expect(result.current.descriptionError).toBe('Description must be at least 10 characters');
  });

  it('clears errors on successful validation', async () => {
    // First, set some errors
    mockValidateClaim.mockReturnValueOnce({
      success: false,
      errors: { date: 'Date is required' }
    });

    const { result } = renderHook(() => useClaimsForm(), {
      wrapper: createWrapper(),
    });

    const mockEvent = { preventDefault: jest.fn() } as any;

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(result.current.dateError).toBe('Date is required');

    // Now mock successful validation
    mockValidateClaim.mockReturnValueOnce({
      success: true,
      data: {
        date: '2025-01-15',
        category: 'Theft',
        description: 'Valid description'
      }
    });

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(result.current.dateError).toBe('');
    expect(result.current.categoryError).toBe('');
    expect(result.current.descriptionError).toBe('');
  });

  it('submits form when validation passes', async () => {
    mockValidateClaim.mockReturnValue({
      success: true,
      data: {
        date: '2025-01-15',
        category: 'Theft',
        description: 'Valid description with enough characters'
      }
    });

    const { result } = renderHook(() => useClaimsForm(), {
      wrapper: createWrapper(),
    });

    // Set form data
    act(() => {
      result.current.setDate('2025-01-15');
      result.current.setCategory('Theft');
      result.current.setDescription('Valid description with enough characters');
    });

    const mockEvent = { preventDefault: jest.fn() } as any;

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockValidateClaim).toHaveBeenCalledWith({
      date: '2025-01-15',
      category: 'Theft',
      description: 'Valid description with enough characters'
    });
  });

  it('prioritizes validation errors correctly (date > category > description)', () => {
    mockValidateClaim.mockReturnValue({
      success: false,
      errors: {
        date: 'Date is required',
        category: 'Category is required',
        description: 'Description is required'
      }
    });

    const { result } = renderHook(() => useClaimsForm(), {
      wrapper: createWrapper(),
    });

    const mockEvent = { preventDefault: jest.fn() } as any;

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    // Should show date error first and not others
    expect(result.current.dateError).toBe('Date is required');
    expect(result.current.categoryError).toBe('');
    expect(result.current.descriptionError).toBe('');
  });

  it('provides mutation object for loading and error states', () => {
    const { result } = renderHook(() => useClaimsForm(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mutation).toBeDefined();
    expect(result.current.mutation.isPending).toBe(false);
    expect(result.current.mutation.isError).toBe(false);
    expect(typeof result.current.mutation.mutate).toBe('function');
  });
});