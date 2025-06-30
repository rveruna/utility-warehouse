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
  // Check if it matches YYYY-MM-DD format
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateString)) {
    return false;
  }
  
  // Check if it's a valid date
  const date = new Date(dateString + 'T00:00:00');
  return !isNaN(date.getTime());
};

const isNotFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString + 'T00:00:00');
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
    .refine((date) => date.length === 0 || isValidDate(date), 'Please enter a valid date')
    .refine((date) => date.length === 0 || !isValidDate(date) || isNotFutureDate(date), 'Date cannot be in the future'),
  
  category: z.string()
    .min(1, 'Category is required')
    .refine((cat) => cat === '' || ['Theft', 'Loss', 'Accidental Damage'].includes(cat), 'Please select a valid category'),
  
  description: z.string()
    .min(1, 'Description is required')
    .max(1000, 'Description cannot exceed 1000 characters')
    .refine((desc) => desc.length === 0 || desc.length >= 10, 'Description must be at least 10 characters')
    .refine((desc) => desc.length === 0 || containsNoMaliciousContent(desc), 'Description contains invalid content')
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