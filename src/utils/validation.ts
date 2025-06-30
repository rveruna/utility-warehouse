import { z } from 'zod';
import DOMPurify from 'dompurify';

// Sanitization utilities
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  }).trim();
};

// Custom validation helpers
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
};

const isNotFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  return date <= today;
};

const containsNoMaliciousContent = (text: string): boolean => {
  // Check for common XSS patterns
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(text));
};

// Zod schema for claim validation
export const claimSchema = z.object({
  date: z.string()
    .min(1, 'Date is required')
    .refine(isValidDate, 'Please enter a valid date')
    .refine(isNotFutureDate, 'Date cannot be in the future'),
  
  category: z.enum(['Theft', 'Loss', 'Accidental Damage'] as const, {
    required_error: 'Category is required',
    invalid_type_error: 'Please select a valid category'
  }),
  
  description: z.string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters')
    .refine(containsNoMaliciousContent, 'Description contains invalid content')
    .transform(sanitizeInput)
});

export type ClaimFormData = z.infer<typeof claimSchema>;

// Validation result type
export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
};

// Validate and sanitize claim data
export const validateClaim = (data: unknown): ValidationResult<ClaimFormData> => {
  try {
    const result = claimSchema.parse(data);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return {
        success: false,
        errors
      };
    }
    return {
      success: false,
      errors: { general: 'Validation failed' }
    };
  }
};