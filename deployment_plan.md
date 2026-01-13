# Deployment Plan for Todo Board Application

This document outlines the steps to deploy your full-stack application (React frontend + Node/Express backend) using **Render** for the backend and **Vercel** for the frontend.

## Prerequisites
1.  A GitHub account.
2.  A Render account (Sign up at [render.com](https://render.com)).
3.  A Vercel account (Sign up at [vercel.com](https://vercel.com)).

---

## Step 1: Push Code to GitHub
Since your project is split into `backend` and `frontend` folders:
1.  Initialize a Git repository in the root folder:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub.
3.  Follow the GitHub instructions to add the remote and push:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

---

## Step 2: Deploy Backend to Render
1.  Go to your Render Dashboard and click **New** -> **Web Service**.
2.  Connect your GitHub repository.
3.  Select your project repository.
4.  Configure the service:
    *   **Name**: `todo-board-backend`
    *   **Root Directory**: `backend`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
5.  **Environment Variables**: Click "Advanced" and add the following:
    *   `SUPABASE_URL`: Your Supabase project URL.
    *   `SUPABASE_ANON_KEY`: Your Supabase Anon Key.
    *   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key.
    *   `PORT`: `5000` (Render will override this, but good to have).
    *   `ALLOWED_ORIGINS`: `*` (or your frontend URL after deployment).
6.  Click **Create Web Service**.

---

## Step 3: Deploy Frontend to Vercel
1.  Go to the Vercel Dashboard and click **Add New** -> **Project**.
2.  Connect your GitHub repository and select the repo.
3.  Configure the project:
    *   **Project Name**: `todo-board-frontend`
    *   **Framework Preset**: `Create React App`
    *   **Root Directory**: `frontend`
4.  **Environment Variables**: Add the following:
    *   `REACT_APP_API_URL`: The URL of your backend on Render (e.g., `https://todo-board-backend.onrender.com`).
5.  Click **Deploy**.

---

## Step 4: Final Verification
1.  Once the backend is live, note the URL.
2.  Go to your Vercel deployment settings and ensure `REACT_APP_API_URL` matches exactly.
3.  Open the frontend URL and test the login/signup and todo operations.

## Troubleshooting
*   **CORS Issues**: If the frontend cannot talk to the backend, check the `ALLOWED_ORIGINS` in the backend Render settings.
*   **Supabase Errors**: Ensure your `supabase_schema.sql` has been executed in your Supabase SQL Editor to prepare the database tables.
