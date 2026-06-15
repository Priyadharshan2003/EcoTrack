# EcoTrack 🌱

> **Understand** your footprint. **Track** your impact. **Reduce** global emissions.

EcoTrack is a production-grade, full-stack intelligence platform that gamifies sustainability. Built for real-world deployment, it integrates mobile sensing, a robust API, and real-time AI to make climate action invisible, effortless, and deeply rewarding.

![EcoTrack Banner](docs/banner-placeholder.png)

---

## 🚀 The Solution

While most carbon trackers are manual and guilt-inducing, EcoTrack is **automated and empowering**. 
1. **Passively Infers** activities (like cab rides or food deliveries) using mobile heuristics.
2. **Scientifically Calculates** carbon costs using IPCC & EPA emission factors.
3. **AI Coaching** (powered by Gemini 1.5 Flash) provides deeply personalized, actionable insights.
4. **Gamification & Offsets** turn reductions into real-world habitat protection.

## 🏗 System Architecture

EcoTrack is designed for high availability, rapid iteration, and competition-winning stability.

*   **Frontend:** React Native (Expo) & Zustand (Persisted State).
*   **Backend:** FastAPI (Python) optimized for Vercel Serverless.
*   **Database:** Supabase (PostgreSQL).
*   **AI Engine:** Google Gemini 1.5 Flash.
*   **CI/CD:** GitHub Actions for automated linting, type-checking, and Pytest suites.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture diagrams and data flow.

## 🤖 AI Integration & Graceful Fallback

We utilize **Google Gemini 1.5 Flash** for blazing-fast contextual insights. However, we assume network partitions or rate limits can happen.

**The Fallback Guarantee:** If the AI API is unreachable, EcoTrack automatically engages a zero-latency **Rule-Based Fallback Engine**. This ensures the user *always* receives an actionable insight, maintaining a flawless user experience even in degraded network states.

## 🧪 Scientific Credibility

All calculations are backed by a strict data credibility layer found in `emissionFactors`.
*   **Transport:** EPA Greenhouse Gas Equivalencies Calculator & DEFRA.
*   **Food:** IPCC Special Report on Climate Change and Land.
*   **Energy:** Average global grid intensity (IEA).

## 💻 Getting Started

### 1. Run the Backend
```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

### 2. Run the App
```bash
npm install
npm start
```

### 3. Run Tests
```bash
# Backend
pytest backend/tests/

# Frontend
npm test
```

## 🚢 Deployment

EcoTrack is built to deploy easily. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full instructions on deploying to **Vercel**, **Supabase**, and building with **Expo EAS**. A `Dockerfile` is also provided for containerized environments.

## 🔒 Security Practices

- Input validation strictly enforced via **Pydantic** models.
- **CORS** middleware restricts cross-origin exposure.
- All secrets and API keys are injected via secure environment variables (`.env`).
- Frontend API client gracefully catches and isolates network exceptions.

---

*EcoTrack — Built for the future.*
