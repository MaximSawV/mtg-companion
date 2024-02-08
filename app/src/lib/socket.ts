import { io } from "socket.io-client";

export const socket = io("ws://192.168.104.105:8000");