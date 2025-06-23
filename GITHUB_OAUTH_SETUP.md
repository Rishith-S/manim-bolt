# GitHub OAuth Setup

This application now supports GitHub OAuth authentication alongside Google OAuth. Here's how to set it up:

## Backend Environment Variables

Add these environment variables to your backend `.env` file:

```env
# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_REDIRECT_URL_LOGIN="http://localhost:3000/auth/github/callback/login"
GITHUB_REDIRECT_URL_SIGNUP="http://localhost:3000/auth/github/callback/signup"
```

## Frontend Environment Variables

Add this environment variable to your frontend `.env` file:

```env
VITE_GITHUB_CLIENT_ID="your-github-client-id"
```

## GitHub OAuth App Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Your app name (e.g., "ClipCraft")
   - **Homepage URL**: Your app's homepage (e.g., `http://localhost:3000`)
   - **Authorization callback URL**: 
     - For development: `http://localhost:3000/auth/github/callback/login`
     - For production: `https://yourdomain.com/auth/github/callback/login`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**

## How It Works

1. User clicks "Login with GitHub" button
2. Frontend calls backend `/api/v1/auth/github/url/:type` endpoint
3. Backend returns GitHub OAuth authorization URL
4. User is redirected to GitHub for authorization
5. GitHub redirects back to `/auth/github/callback/:type`
6. Frontend calls backend `/api/v1/auth/github/token` endpoint with the authorization code
7. Backend exchanges code for access token and gets user info from GitHub API
8. Backend creates/authenticates user and returns JWT tokens
9. User is logged in and redirected to home page

## API Endpoints

### GET `/api/v1/auth/github/url/:type`
Generates GitHub OAuth authorization URL for login or signup.

### GET `/api/v1/auth/github/token`
Exchanges authorization code for access token and handles user authentication.

## Routes Added

- `/auth/github/callback/login` - GitHub OAuth callback for login
- `/auth/github/callback/signup` - GitHub OAuth callback for signup

The GitHub OAuth implementation follows the same pattern as the existing Google OAuth, ensuring consistency in the authentication flow. 