import axios from 'axios';

// --- THIS IS THE CORE LOGIC ---
// It checks if the app is in "production" mode (when deployed on Vercel).
// If so, it uses the live Render URLs from the environment variables.
// Otherwise, it uses the localhost URLs for local development.

const MAIN_API_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_MAIN_API_URL
  : 'http://localhost:5001';

const CODE_RUNNER_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_CODE_RUNNER_URL
  : 'http://localhost:5000';

// Create a pre-configured axios instance for your main API
export const mainApi = axios.create({
  baseURL: MAIN_API_URL
});

// Create a pre-configured axios instance for your code runner API
export const codeRunnerApi = axios.create({
  baseURL: CODE_RUNNER_URL
});