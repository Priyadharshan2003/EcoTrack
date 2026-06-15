# Deployment Guide

EcoTrack's backend is a Python FastAPI application optimized for serverless deployment on **Vercel**, while the frontend is an **Expo React Native** app that can be exported to Web or published to iOS/Android.

## 1. Backend Deployment (Vercel)

The backend is configured with a `vercel.json` file which instructs Vercel to use the `@vercel/python` builder.

### Steps
1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel login`
3. Link the project: `vercel link`
4. Set Environment Variables in the Vercel Dashboard (or via CLI):
   * `GEMINI_API_KEY` = your API key
   * `SUPABASE_URL` = your Supabase project URL
   * `SUPABASE_KEY` = your Supabase anon/service key
5. Deploy: `vercel --prod`

## 2. Database Deployment (Supabase)

1. Create a new project in [Supabase](https://supabase.com/).
2. Navigate to the SQL Editor and execute your schema initialization scripts (creating `users`, `activities`, `offsets` tables).
3. Copy the URL and Key to your Vercel Environment variables.

## 3. Frontend Deployment (Expo)

1. In the `friendly-franklin` root directory, create a `.env` file:
   ```env
   EXPO_PUBLIC_API_URL=https://<your-vercel-domain>.vercel.app/api
   ```
2. Build for Web:
   `npx expo export -p web`
3. The resulting `dist/` directory can also be deployed to Vercel as a static site.
4. Build for Native (EAS):
   `eas build --platform all`

## Alternative: Docker Deployment
If you prefer a long-running container service (e.g., Google Cloud Run, Render, or Railway), you can use the provided `Dockerfile`.

```bash
docker build -t ecotrack-backend .
docker run -p 8000:8000 -e GEMINI_API_KEY=xyz ecotrack-backend
```
