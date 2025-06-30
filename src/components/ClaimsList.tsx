import { type Claim } from "../types";

interface ClaimsListProps {
  claims: Claim[];
}

export function ClaimsList({ claims }: ClaimsListProps) {
  if (claims.length === 0) {
    return null;
  }

  return (
    <div className="claims-list">
      <h2>Existing Claims</h2>
      <ul>
        {claims.map((claim) => (
          <li key={claim.id}>
            <strong>
              {claim.date} {claim.category}
            </strong>
            <br />
            {claim.description}
          </li>
        ))}
      </ul>
    </div>
  );
}