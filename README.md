# EcoTrack

EcoTrack is a behavior-shaping intelligence system designed to seamlessly guide individuals toward lower-carbon lifestyles. It transcends basic carbon calculation by acting as a context-driven assistant, helping users understand, track, and actively reduce their environmental footprint through personalized insights.

## Core Principles

We engineered EcoTrack to adhere to the highest standards of software quality, drawing inspiration from industry-leading practices:

- **Privacy by Design**: User data is strictly isolated. State is managed securely via Clerk, and footprints are stored in Supabase with robust Row Level Security (RLS) policies.
- **Ambient Intelligence**: EcoTrack learns from minimal inputs to infer broader lifestyle impacts, reducing friction. The Gemini AI layer synthesizes actionable advice without overwhelming the user.
- **Uncompromising Performance**: Built on Next.js 15 with React 19, the architecture relies on stateless Server Components for immediate time-to-interactive and near-zero client JavaScript overhead.
- **Universal Accessibility**: The interface is strictly compliant with WCAG AA standards. Semantic HTML, comprehensive screen-reader support, and keyboard navigability are treated as core features, not afterthoughts.

## Architecture

EcoTrack is designed as a modern, resilient full-stack application.

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Zustand, Recharts.
- **Backend Services**: Next.js Server Actions for secure, stateless processing.
- **Intelligence**: `@google/genai` directly integrated for context-aware recommendations.
- **Infrastructure**: Optimized for edge deployment (Vercel) or containerized scaling (Google Cloud Run).

### Request Flow

1. **Ingest**: The client submits encrypted lifestyle data.
2. **Process**: Server Actions validate inputs against strict Zod schemas and compute a deterministic footprint.
3. **Synthesize**: The server asynchronously requests contextual insights from Gemini.
4. **Persist**: Data and insights are persisted to Supabase and securely returned to the client.

*Note: EcoTrack implements a graceful fallback mechanism. If the AI layer experiences a timeout, the system transparently utilizes a deterministic rule-based engine to guarantee uninterrupted user experience.*

## Getting Started

### Prerequisites

- Node.js 20 or later
- Supabase project
- Clerk authentication keys
- Gemini API key

### Local Environment Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_secret
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   GEMINI_API_KEY=your_gemini_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Quality Assurance

We strictly enforce code quality and reliability through automated pipelines.

- **Unit & Integration Testing**: Vitest and React Testing Library ensure core calculation purity and component integrity.
- **Coverage Standards**: CI pipelines enforce a minimum of 90% statement coverage and 85% branch coverage.
- **Static Analysis**: TypeScript (`strict` mode) and ESLint (`next/core-web-vitals`) run concurrently to eliminate runtime errors.

## License

EcoTrack is available under the MIT License.
