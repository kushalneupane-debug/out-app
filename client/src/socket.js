import { io } from 'socket.io-client';
var URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
var socket = io(URL, { autoConnect: false, transports: ['websocket', 'polling'] });
export default socket;
