import { io } from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'https://zcoder-main-backend.onrender.com';

export const socket = io(SERVER_URL, { autoConnect: false });