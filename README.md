# Claims Form – React + TypeScript + Vite

This project is a simple React + TypeScript frontend powered by Vite. It includes a form to submit claims (date, category, and description) with submission handled via a Node.js API route.

**Features**:

- React 19 with TypeScript and Vite
- `@tanstack/react-query` for mutation handling
- Form validation with native browser features
- Fully tested using Jest and Testing Library
- Logs claim data to a local `claims.log` file

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app locally

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### 3. Submit claims

Submitted claims are handled by the `/api/submit-claim` endpoint and appended to a `claims.log` file in the project root.

---

## 🔪 Testing

We use **Jest** with `ts-jest` for unit tests and React Testing Library for interaction tests.

```bash
npm test
```

All form behaviors are tested: valid submission, field validation, error handling, and async state handling.
