import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
if (!SOCKET_URL) {
  throw new Error("NEXT_PUBLIC_SOCKET_URL is not set");
}

let _socket: Socket | null = null;

export function getSocket(): Socket {
  if (!_socket) {
    _socket = io(SOCKET_URL!, {
      autoConnect: false,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
    });
  }
  return _socket;
}

export function destroySocket() {
  if (_socket) {
    _socket.disconnect();
    _socket = null;
  }
}
