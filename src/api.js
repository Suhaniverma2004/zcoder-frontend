import axios from 'axios';

const MAIN_API_URL = process.env.REACT_APP_MAIN_API_URL || 'https://zcoder-main-backend.onrender.com';
const CODE_RUNNER_URL = process.env.REACT_APP_CODE_RUNNER_URL || 'https://zcoder-backend-djw6.onrender.com';

export const mainApi = axios.create({
  baseURL: MAIN_API_URL
});

export const codeRunnerApi = axios.create({
  baseURL: CODE_RUNNER_URL
});
