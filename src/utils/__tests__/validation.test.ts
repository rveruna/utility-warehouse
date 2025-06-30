import { validateClaim, sanitizeInput } from '../validation';

describe('validateClaim', () => {
  describe('date validation', () => {
    it('should require date', () => {
      const result = validateClaim({
        date: '',
        category: 'Theft',
        description: 'Valid description with enough characters'
      });

      expect(result.success).toBe(false);
      expect(result.errors?.date).toBe('Date is required');
    });

    it('should reject invalid date format', () => {
      const result = validateClaim({
        date: 'not-a-date',
        category: 'Theft',
        description: 'Valid description with enough characters'
      });

      expect(result.success).toBe(false);
      expect(result.errors?.date).toBe('Please enter a valid date');
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      const result = validateClaim({
        date: futureDateString,
        category: 'Theft',
        description: 'Valid description with enough characters'
      });

      expect(result.success).toBe(false);
      expect(result.errors?.date).toBe('Date cannot be in the future');
    });

    it('should accept valid past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const pastDateString = pastDate.toISOString().split('T')[0];

      const result = validateClaim({
        date: pastDateString,
        category: 'Theft',
        description: 'Valid description with enough characters'
      });

      expect(result.success).toBe(true);
      expect(result.errors?.date).toBeUndefined();
    });

    it('should accept today as valid date', () => {
      const today = new Date().toISOString().split('T')[0];

      const result = validateClaim({
        date: today,
        category: 'Theft',
        description: 'Valid description with enough characters'
      });

      expect(result.success).toBe(true);
      expect(result.errors?.date).toBeUndefined();
    });
  });

  describe('category validation', () => {
    it('should require category', () => {
      const result = validateClaim({
        date: '2025-01-01',
        category: '',
        description: 'Valid description with enough characters'
      });

      expect(result.success).toBe(false);
      expect(result.errors?.category).toBe('Category is required');
    });

    it('should reject invalid category', () => {
      const result = validateClaim({
        date: '2025-01-01',
        category: 'InvalidCategory',
        description: 'Valid description with enough characters'
      });

      expect(result.success).toBe(false);
      expect(result.errors?.category).toBe('Please select a valid category');
    });

    it('should accept valid categories', () => {
      const validCategories = ['Theft', 'Loss', 'Accidental Damage'];

      validCategories.forEach(category => {
        const result = validateClaim({
          date: '2025-01-01',
          category,
          description: 'Valid description with enough characters'
        });

        expect(result.success).toBe(true);
        expect(result.errors?.category).toBeUndefined();
      });
    });
  });

  describe('description validation', () => {
    it('should require description', () => {
      const result = validateClaim({
        date: '2025-01-01',
        category: 'Theft',
        description: ''
      });

      expect(result.success).toBe(false);
      expect(result.errors?.description).toBe('Description is required');
    });

    it('should reject description that is too short', () => {
      const result = validateClaim({
        date: '2025-01-01',
        category: 'Theft',
        description: 'Short'
      });

      expect(result.success).toBe(false);
      expect(result.errors?.description).toBe('Description must be at least 10 characters');
    });

    it('should reject description that is too long', () => {
      const longDescription = 'a'.repeat(1001);
      const result = validateClaim({
        date: '2025-01-01',
        category: 'Theft',
        description: longDescription
      });

      expect(result.success).toBe(false);
      expect(result.errors?.description).toBe('Description cannot exceed 1000 characters');
    });

    it('should reject malicious content', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<iframe src="evil.com"></iframe>',
        'onclick="alert(1)"',
        'data:text/html,<script>alert(1)</script>'
      ];

      maliciousInputs.forEach(maliciousInput => {
        const result = validateClaim({
          date: '2025-01-01',
          category: 'Theft',
          description: maliciousInput + ' valid description'
        });

        expect(result.success).toBe(false);
        expect(result.errors?.description).toBe('Description contains invalid content');
      });
    });

    it('should accept valid description', () => {
      const result = validateClaim({
        date: '2025-01-01',
        category: 'Theft',
        description: 'This is a valid description with enough characters'
      });

      expect(result.success).toBe(true);
      expect(result.errors?.description).toBeUndefined();
    });
  });

  describe('complete form validation', () => {
    it('should validate complete valid form', () => {
      const result = validateClaim({
        date: '2025-01-01',
        category: 'Theft',
        description: 'Valid description with enough characters'
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.date).toBe('2025-01-01');
      expect(result.data?.category).toBe('Theft');
      expect(result.data?.description).toBe('Valid description with enough characters');
    });

    it('should sanitize description in successful validation', () => {
      const result = validateClaim({
        date: '2025-01-01',
        category: 'Theft',
        description: '   Valid description with extra spaces   '
      });

      expect(result.success).toBe(true);
      expect(result.data?.description).toBe('Valid description with extra spaces');
    });
  });
});

describe('sanitizeInput', () => {
  it('should remove HTML tags', () => {
    const input = '<p>Hello <strong>world</strong></p>';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello world');
  });

  it('should remove script tags', () => {
    const input = '<script>alert("xss")</script>Safe content';
    const result = sanitizeInput(input);
    expect(result).toBe('Safe content');
  });

  it('should trim whitespace', () => {
    const input = '   Content with spaces   ';
    const result = sanitizeInput(input);
    expect(result).toBe('Content with spaces');
  });

  it('should preserve safe text content', () => {
    const input = 'This is safe content with numbers 123 and symbols !@#';
    const result = sanitizeInput(input);
    expect(result).toBe(input);
  });

  it('should handle empty string', () => {
    const result = sanitizeInput('');
    expect(result).toBe('');
  });
});