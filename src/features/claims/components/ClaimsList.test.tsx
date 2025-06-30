import { render, screen } from '@testing-library/react';
import { ClaimsList } from './ClaimsList';
import { type Claim } from '../types';

describe('ClaimsList', () => {
  const mockClaims: Claim[] = [
    {
      id: '1',
      date: '2025-01-15',
      category: 'Theft',
      description: 'Stolen laptop from car'
    },
    {
      id: '2',
      date: '2025-01-10',
      category: 'Loss',
      description: 'Lost phone during travel'
    },
    {
      id: '3',
      date: '2025-01-05',
      category: 'Accidental Damage',
      description: 'Dropped tablet and cracked screen'
    }
  ];

  it('renders null when claims array is empty', () => {
    const { container } = render(<ClaimsList claims={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders heading when claims exist', () => {
    render(<ClaimsList claims={mockClaims} />);
    expect(screen.getByText('Existing Claims')).toBeInTheDocument();
  });

  it('renders all claims in a list', () => {
    render(<ClaimsList claims={mockClaims} />);
    
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('displays claim date and category in strong text', () => {
    render(<ClaimsList claims={mockClaims} />);
    
    expect(screen.getByText('2025-01-15 Theft')).toBeInTheDocument();
    expect(screen.getByText('2025-01-10 Loss')).toBeInTheDocument();
    expect(screen.getByText('2025-01-05 Accidental Damage')).toBeInTheDocument();
  });

  it('displays claim descriptions', () => {
    render(<ClaimsList claims={mockClaims} />);
    
    expect(screen.getByText('Stolen laptop from car')).toBeInTheDocument();
    expect(screen.getByText('Lost phone during travel')).toBeInTheDocument();
    expect(screen.getByText('Dropped tablet and cracked screen')).toBeInTheDocument();
  });

  it('uses claim id as key for list items', () => {
    render(<ClaimsList claims={mockClaims} />);
    
    const listItems = screen.getAllByRole('listitem');
    
    // Check that each claim is rendered (we can't directly test keys, but we can test content)
    expect(listItems[0]).toHaveTextContent('2025-01-15 Theft');
    expect(listItems[1]).toHaveTextContent('2025-01-10 Loss');
    expect(listItems[2]).toHaveTextContent('2025-01-05 Accidental Damage');
  });

  it('applies correct CSS classes', () => {
    render(<ClaimsList claims={mockClaims} />);
    
    const container = screen.getByText('Existing Claims').closest('.claims-list');
    expect(container).toBeInTheDocument();
  });

  it('handles single claim correctly', () => {
    const singleClaim = [mockClaims[0]];
    render(<ClaimsList claims={singleClaim} />);
    
    expect(screen.getByText('Existing Claims')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('2025-01-15 Theft')).toBeInTheDocument();
    expect(screen.getByText('Stolen laptop from car')).toBeInTheDocument();
  });

  it('formats date and category with space separation', () => {
    const claim: Claim = {
      id: '1',
      date: '2025-12-25',
      category: 'Accidental Damage',
      description: 'Test description'
    };
    
    render(<ClaimsList claims={[claim]} />);
    
    // Should have space between date and category
    expect(screen.getByText('2025-12-25 Accidental Damage')).toBeInTheDocument();
  });

  it('renders line break between header and description', () => {
    render(<ClaimsList claims={mockClaims} />);
    
    const firstItem = screen.getAllByRole('listitem')[0];
    const brElement = firstItem.querySelector('br');
    expect(brElement).toBeInTheDocument();
  });
});