import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renders label and children correctly', () => {
    render(
      <FormField label="Test Label" htmlFor="test-input">
        <input id="test-input" />
      </FormField>
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('associates label with input using htmlFor', () => {
    render(
      <FormField label="Email" htmlFor="email">
        <input id="email" />
      </FormField>
    );

    const label = screen.getByText('Email');
    const input = screen.getByRole('textbox');
    
    expect(label).toHaveAttribute('for', 'email');
    expect(input).toHaveAttribute('id', 'email');
  });

  it('displays error message when provided', () => {
    render(
      <FormField label="Test Label" htmlFor="test-input" error="This field is required">
        <input id="test-input" />
      </FormField>
    );

    const errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveTextContent('This field is required');
    expect(errorElement).toHaveAttribute('id', 'test-input-error');
  });

  it('shows placeholder space when no error', () => {
    render(
      <FormField label="Test Label" htmlFor="test-input">
        <input id="test-input" />
      </FormField>
    );

    const errorElement = screen.getByTestId('test-input-error'); 
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).not.toHaveAttribute('role');
    // Check that it has some content (the non-breaking space)
    expect(errorElement.textContent).toBeTruthy();
  });

  it('applies correct CSS classes', () => {
    render(
      <FormField label="Test Label" htmlFor="test-input" error="Error">
        <input id="test-input" />
      </FormField>
    );

    expect(screen.getByText('Test Label')).toHaveClass('claims-label');
    expect(screen.getByRole('alert')).toHaveClass('claims-error');
    expect(screen.getByText('Test Label').closest('.claims-field')).toBeInTheDocument();
  });
});