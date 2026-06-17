# 🌱 EcoTrack — Carbon Intelligence System

AI-powered platform to understand, track, and reduce personal carbon footprint.

## 🚀 Overview

EcoTrack is a production-grade platform that helps individuals calculate, understand, and reduce their personal carbon footprint. Designed for anyone looking to take actionable steps toward climate action, it eliminates the tedium of manual tracking by offering an intuitive, behavior-driven approach. 

What sets EcoTrack apart is its AI-driven insights powered by Google Gemini, instantly breaking down your footprint and providing real-time personalized recommendations. Furthermore, it offers a seamless public demo experience—anyone can explore the full platform via the `/demo` route without needing to create an account.

## ✨ Features

- **Carbon Footprint Tracking:** Comprehensive tracking across transport, energy, and lifestyle inputs.
- **AI-Powered Insights (Google Gemini):** Deeply personalized and context-aware reduction strategies.
- **Real-time Dashboard:** Visual charts and real-time breakdowns of your footprint.
- **Demo Mode (Public Preview):** Instantly experience the platform without authentication—a key differentiator.
- **Personalized Recommendations:** Actionable steps tailored specifically to your habits.
- **Weekly EcoWrap Insights:** A summary of your progress and trends.
- **Secure Authentication (Clerk):** Enterprise-grade security and identity management.
- **Robust Fallback System (AI Failure Safe):** A deterministic fallback ensures you always get insights even if the AI is unavailable.

## 🧠 Intelligent Insights Engine

EcoTrack's core innovation is its resilient Insights Pipeline, ensuring users never hit a dead end.

**Input → Carbon Calculation → AI Analysis → Insights Output**

1. User data is processed by the Carbon Calculation Engine to establish an accurate baseline in kg CO₂e.
2. The data enters the **Gemini AI integration**, generating rich, context-aware advice.
3. **Fallback System:** If the AI request times out or fails, the system instantly switches to a deterministic algorithm to provide rule-based metrics.
4. **Guaranteed Output:** The system is engineered to *always* return usable, actionable results, even if the AI fails.

## 🎥 Demo Experience

We built a dedicated **`/demo`** route that allows anyone to experience the core functionality immediately. 

This is a key differentiator for EcoTrack:
- **Works without login:** No authentication barriers to entry.
- **Uses mock data:** Pre-populated, realistic user data.
- **Realistic dashboard preview:** Every chart, interaction, and AI insight functions exactly as it does in the production app.

## 🏗️ Architecture

EcoTrack utilizes a modern, decoupled architecture prioritizing performance and a smooth developer experience.

- **Client:** Next.js App Router for optimal rendering, styled with Tailwind UI.
- **Server:** Secure API routes orchestrating AI insights and database interactions.
- **Services:** 
  - **Google Gemini** for intelligent, AI-driven insights.
  - **Clerk** for secure, session-based identity management.
  - **Supabase** for scalable tracking history and optional data persistence.
- **State:** Zustand for predictable, minimal-boilerplate global state.

## ⚙️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js |
| **Language** | TypeScript (strict mode) |
| **AI** | Google Gemini |
| **Auth** | Clerk |
| **Database** | Supabase |
| **State** | Zustand |
| **UI** | Tailwind + Radix |
| **Validation** | Zod |

## 📸 Screenshots

### Landing Page & Onboarding
![Landing Page 1](docs/Screenshots/onboard1.png)
![Landing Page 2](docs/Screenshots/onboard2.png)
![Landing Page 3](docs/Screenshots/onboard3.png)

### Dashboard Analytics & AI Assistant
![Dashboard 1](docs/Screenshots/maindash1.png)
![Dashboard 2](docs/Screenshots/maindash2.png)
![Dashboard 3](docs/Screenshots/maindash3.png)
![Dashboard 4](docs/Screenshots/maindash4.png)

### Public Demo Mode
The fully functional `/demo` route allows you to preview the app instantly.

## 🛡️ Security

Security is deeply integrated at every layer:

- **Clerk Authentication:** Secure sessions protect all private routes.
- **Protected API Routes:** Middleware ensures only authenticated users can access sensitive endpoints.
- **No Secrets Exposed:** Environment variables are strictly isolated from the client bundle.
- **Zod Validation:** Strict boundary validation on all incoming API inputs to prevent malformed data.
- **Safe Error Handling:** Errors are sanitized before reaching the client, preventing leakage of sensitive system details.

## 🔄 Error Handling & Resilience

EcoTrack features a bulletproof error handling architecture designed to guarantee a 100% success rate for the end-user.

- **AI failures fallback to deterministic insights:** If the Gemini API experiences downtime, the system serves mathematically sound, deterministic recommendations.
- **API failures never crash UI:** Network anomalies trigger graceful UI degradation rather than cryptic errors.
- **Always returns usable data:** The system is explicitly engineered to ensure the user is never left hanging.

## ⚡ Performance

- **Server Components usage:** Heavy lifting is done on the server, ensuring minimal client-side JavaScript.
- **Minimal client JS:** Reduces the bundle size and speeds up interactivity.
- **Optimized rendering:** Fast Initial Load and minimal layout shifts are achieved using Next.js best practices.

## ♿ Accessibility

Built for everyone:

- **Semantic HTML:** Proper document structure and landmark elements.
- **Keyboard Navigation:** Full focus management allowing seamless use without a mouse.
- **ARIA Roles:** Complex interactive elements are fully screen-reader compliant.
- **Contrast-safe design:** Meticulously chosen palettes ensuring visual clarity.

## 🧪 Testing & Reliability

Application is highly resilient to API and AI failures.

- **Unit testing for core logic:** Carbon mathematical models and utility functions are strictly tested.
- **API fallback validation:** The system is explicitly tested to handle timeouts and network drops seamlessly.
- **Stable user experience even under failures:** Centralized error boundaries ensure the UI remains interactive during unexpected states.

## ✅ Evaluation Mapping

How EcoTrack aligns perfectly with core evaluation criteria:

| Criteria | Implementation |
| :--- | :--- |
| **Code Quality** | Strict TypeScript, modular architecture |
| **Security** | Clerk + validation |
| **Efficiency** | Optimized rendering |
| **Testing** | Fallback + resilience |
| **Accessibility** | ARIA + semantic |
| **Problem Alignment** | Understand → Track → Reduce |

## 💎 Why EcoTrack Stands Out

EcoTrack goes beyond being just a tracking application. It is a robust, resilient intelligence platform. 

- **Public demo without login:** Users can experience the magic immediately, radically increasing adoption (huge advantage).
- **AI-first approach (Gemini):** Leverages intelligent analysis to provide actual intelligence, not just generic tips.
- **Strong fallback system:** Engineered for reliability; the user never sees an AI failure.
- **Polished UX:** A premium, beautiful interface that encourages daily use.
- **Production-grade architecture:** Built on Next.js, guaranteeing scalability and top-tier performance.

## 🚀 Getting Started

```bash
git clone https://github.com/Priyadharshan2003/EcoTrack.git
cd EcoTrack
npm install
npm run dev
```

## 🌐 Deployment

EcoTrack is **Vercel ready** for instant deployment. Connect your repository to Vercel and supply the required environment variables (`.env.local`).

## 📄 License

This project is licensed under the MIT License.
