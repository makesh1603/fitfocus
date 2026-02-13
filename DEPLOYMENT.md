# Deployment Guide: FitFocus AI

Follow these steps to deploy your application to Render (Backend) and Vercel (Frontend).

## Prerequisites
1.  Push your code to a **GitHub Repository**.
2.  Create a **Render** account (render.com).
3.  Create a **Vercel** account (vercel.com).

---

## 1. Deploying the Backend (Render)
1.  Go to **Render Dashboard** -> **New** -> **Web Service**.
2.  Connect your GitHub repository.
3.  **Name**: `fitfocus-backend` (or similar).
4.  **Root Directory**: `backend`.
5.  **Build Command**: `npm install`.
6.  **Start Command**: `npm start`.
7.  **Environment Variables**:
    - `MONGO_URI`: (Your MongoDB Atlas URI)
    - `GOOGLE_CLIENT_ID`: (From Google Console)
    - `GOOGLE_CLIENT_SECRET`: (From Google Console)
    - `SESSION_SECRET`: (A random long string)
    - `FRONTEND_URL`: `https://your-frontend-app.vercel.app` (You'll get this in step 2).
8.  **Deploy**. Note the URL (e.g., `https://fitfocus-backend.onrender.com`).

---

## 2. Deploying the Frontend (Vercel)
1.  Go to **Vercel Dashboard** -> **Add New** -> **Project**.
2.  Connect your GitHub repository.
3.  **Root Directory**: `frontend`.
4.  **Framework Preset**: `Vite`.
5.  **Build Command**: `npm run build`.
6.  **Environment Variables**:
    - `VITE_API_BASE_URL`: (Optional, if using custom proxying).
6.  **Deployment Settings**:
    - Before deploying, update `frontend/vercel.json` with your actual Render backend URL.
7.  **Deploy**.

---

## 3. Post-Deployment (Crucial)
1.  **Google OAuth**: Go to Google Cloud Console and add your Vercel URL and Render URL to the **Authorized redirect URIs**.
    - `https://fitfocus-backend.onrender.com/auth/google/callback`
2.  **IP Whitelist**: Ensure Render's outbound IP is whitelisted in MongoDB Atlas (or allow access from anywhere `0.0.0.0/0` temporarily).
