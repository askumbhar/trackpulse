// API Constants
const API_BASE_URL = 'https://localhost:7156/api';

// User Authentication Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTHENTICATE: `${API_BASE_URL}/users/authenticate`,
  REGISTER: `${API_BASE_URL}/users/register`,
  FORGOT_PASSWORD: `${API_BASE_URL}/users/forgot-password`,

  // Races
  GET_RACES: `${API_BASE_URL}/race/races`,
  PARSE_RACE_HTML: `${API_BASE_URL}/races/parse-html`,
  IMPORT_RACES: `${API_BASE_URL}/races/import`,
  UPDATE_ODDS: `${API_BASE_URL}/race/odds`,

  // Streams
  GET_STREAMS: `${API_BASE_URL}/streams`,
  CREATE_STREAM: `${API_BASE_URL}/streams`,
  UPDATE_STREAM: `${API_BASE_URL}/streams`,
  DELETE_STREAM: `${API_BASE_URL}/streams`,

  // Deposits
  CREATE_DEPOSIT: `${API_BASE_URL}/deposits`,
} as const;

// SignalR Hub URL
export const HUB_URL = 'https://localhost:7156/OddsHub';