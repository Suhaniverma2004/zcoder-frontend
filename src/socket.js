import { io } from 'socket.io-client';

// Use the same logic to determine the correct server URL
const SERVER_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_SOCKET_URL
  : 'http://localhost:5001';

export const socket = io(SERVER_URL, {
  autoConnect: false
});