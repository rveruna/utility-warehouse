# Insurance Claims Form – Utility Warehouse Take-Home Challenge

> **Front-End Take-Home Challenge** – A comprehensive React + TypeScript claims handling form with advanced validation, component architecture, and extensive testing.

## Challenge Description

This project was built as part of the **Utility Warehouse Front-End Take-Home Challenge** for the Insurance team. The original requirement was to build a simple claims handling form that collects:

- **Claim date** – when the incident occurred
- **Category** – e.g. theft, accidental damage, loss, etc.
- **Description** – a free-text field where users can describe what happened

### Original Requirements

- [x] React-based form with three fields
- [x] Node.js server with POST endpoint
- [x] Data written to `claims.log` file
- [x] Basic form validation
- [x] Error handling (client + server)
- [x] Accessibility considerations
- [x] Clear README with setup instructions
- [x] Thoughtful project structure

### Enhanced Implementation

Beyond the basic requirements, this implementation includes:

- **Component Architecture**: Refactored from monolithic 200-line component into 6 focused, reusable components
- **Advanced Validation**: Zod-based schema validation with XSS protection and input sanitization
- **Comprehensive Testing**: 85 test cases covering components, hooks, validation, and accessibility
- **Type Safety**: Full TypeScript integration with branded types and strict validation
- **Modern React Patterns**: Custom hooks, compound components, and proper ref forwarding
- **Production-Ready Features**: Input sanitization, proper error handling, and accessibility compliance

---

## Architecture

### Component Structure

```
src/
├── features/
│   └── claims/                 # Claims feature module
│       ├── components/
│       │   ├── ClaimsForm.tsx          # Main orchestrator (77 lines)
│       │   ├── DateField.tsx           # Date input component (29 lines)
│       │   ├── CategoryField.tsx       # Category dropdown (36 lines)
│       │   ├── DescriptionField.tsx    # Description textarea (28 lines)
│       │   ├── ClaimsList.tsx          # Claims display (27 lines)
│       │   ├── *.test.tsx              # Co-located component tests
│       │   └── index.ts                # Component barrel exports
│       ├── hooks/
│       │   ├── useClaimsForm.ts        # Form state management (109 lines)
│       │   ├── useSubmitClaim.ts       # API submission logic
│       │   ├── *.test.tsx              # Co-located hook tests
│       │   └── index.ts                # Hook barrel exports
│       ├── utils/
│       │   ├── validation.ts           # Zod schemas & sanitization
│       │   ├── validation.test.ts      # Co-located validation tests
│       │   └── index.ts                # Utility barrel exports
│       ├── types/
│       │   └── index.ts                # Feature-specific types
│       └── index.ts                    # Feature barrel export
├── shared/
│   └── components/
│       ├── FormField.tsx               # Reusable field wrapper (25 lines)
│       ├── FormField.test.tsx          # Co-located test
│       └── index.ts                    # Shared component exports
└── App.tsx                             # Application root
```

### Key Improvements

| Feature            | Before                           | After                                      |
| ------------------ | -------------------------------- | ------------------------------------------ |
| **Component Size** | 201-line monolith                | 6 focused components (avg 32 lines)        |
| **Validation**     | Basic browser validation         | Zod schema + XSS protection + sanitization |
| **Testing**        | 10 basic tests                   | 85 comprehensive tests                     |
| **Error Handling** | Generic "something went wrong"   | Specific, user-friendly messages           |
| **Architecture**   | Single responsibility violations | Clean separation of concerns               |
| **Type Safety**    | Basic TypeScript                 | Branded types + strict validation          |

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: TanStack React Query for server state
- **Validation**: Zod for schema validation + DOMPurify for sanitization
- **Testing**: Jest + React Testing Library (85 tests)
- **API**: Vercel serverless functions
- **Styling**: CSS modules with accessibility-first approach

---

## Security & Validation Features

### Input Sanitization

- **XSS Protection**: DOMPurify integration to remove malicious HTML/JS
- **Pattern Detection**: Identifies and blocks common attack vectors
- **Safe Transformation**: Preserves valid content while removing threats

### Validation Schema

- **Date Validation**: Proper format, no future dates, timezone handling
- **Category Validation**: Enum validation with user-friendly error messages
- **Description Validation**: Length limits, content filtering, sanitization
- **Error Prioritization**: Shows most relevant error first (required > format > business rules)

### Accessibility

- **ARIA Compliance**: Proper labels, descriptions, and error announcements
- **Keyboard Navigation**: Full keyboard accessibility with focus management
- **Screen Reader Support**: Semantic HTML and proper role attributes
- **Error States**: Clear error indication with `aria-invalid` and `role="alert"`

---

## Testing Strategy

### Coverage: 85 Tests Across All Layers

| Component/Hook       | Tests | Focus Areas                                     |
| -------------------- | ----- | ----------------------------------------------- |
| **FormField**        | 5     | Label association, error display, accessibility |
| **DateField**        | 8     | Input handling, validation, ref forwarding      |
| **CategoryField**    | 10    | Options, selection, type safety                 |
| **DescriptionField** | 8     | Multiline text, validation, refs                |
| **ClaimsList**       | 9     | Display logic, formatting, empty states         |
| **useClaimsForm**    | 11    | State management, validation flow               |
| **validation**       | 21    | Sanitization, XSS protection, rules             |
| **Integration**      | 13    | End-to-end form behaviour                       |

### Test Quality Features

- **Component Isolation**: Each component tested independently
- **User-Centric**: Tests focus on user behaviour, not implementation
- **Accessibility Testing**: Screen reader and keyboard navigation
- **Security Testing**: XSS protection and input sanitization
- **Edge Cases**: Empty states, malicious input, validation errors

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### 3. Run tests

```bash
npm test
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

---

## Project Structure

```
├── README.md                   # This file
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── jest.config.ts             # Jest test configuration
├── claims.log                 # Generated claims data
├── api/
│   └── submit-claim.ts        # Serverless API endpoint
├── src/
│   ├── features/              # Feature-based modules
│   │   └── claims/           # Claims feature with co-located components, hooks, tests
│   ├── shared/               # Shared/reusable components
│   ├── __tests__/            # App-level integration tests
│   └── App.tsx               # Application root
└── public/                   # Static assets
```

---

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run test suite
- `npm run lint` - Run ESLint

---

## Features Implemented

### Core Requirements (Original Challenge)

- [x] React form with date, category, and description fields
- [x] Node.js API endpoint for form submission
- [x] Data persistence to `claims.log` file
- [x] Basic form validation
- [x] Client and server error handling
- [x] Accessibility considerations
- [x] Clear project structure

### Enhanced Features (Beyond Requirements)

- [x] **Component Architecture**: Modular, reusable component design
- [x] **Advanced Validation**: Zod schema validation with custom rules
- [x] **Security**: XSS protection and input sanitization
- [x] **Type Safety**: Comprehensive TypeScript integration
- [x] **Testing**: 85 test cases with full coverage
- [x] **Modern React**: Custom hooks, refs, compound components
- [x] **Performance**: Optimized rendering and state management
- [x] **Developer Experience**: Hot reload, TypeScript, linting
- [x] **Production Ready**: Build optimization, error boundaries

---

## Potential Future Enhancements

- **Offline Support**: Service worker for offline form submission
- **Real-time Validation**: Debounced API validation
- **File Uploads**: Support for claim evidence attachments
- **Advanced Analytics**: Form completion tracking
- **Internationalization**: Multi-language support
- **Database Integration**: Replace file logging with proper database
- **Authentication**: User management and claim ownership
- **Notifications**: Email/SMS notifications for claim updates

---

## Design Decisions

### Component Architecture

- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Building complex UI from simple parts
- **Prop Drilling Avoidance**: Custom hooks manage complex state
- **Accessibility First**: ARIA attributes and semantic HTML

### Validation Strategy

- **Client-side**: Immediate feedback with Zod validation
- **Server-side**: Basic validation for security (no browser dependencies)
- **Sanitization**: XSS protection without breaking UX
- **Error Prioritization**: Show most important error first

### Testing Philosophy

- **User-Centric**: Test behaviour users experience
- **Component Isolation**: Independent, maintainable tests
- **Edge Case Coverage**: Handle error scenarios
- **Documentation**: Tests serve as living documentation
