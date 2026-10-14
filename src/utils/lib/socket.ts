import { io, type Socket } from "socket.io-client"
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/utils/types/chat"
import { baseURL } from "@/utils/lib/axios"

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  baseURL,
  {
    path: "/api/socket.io",
    autoConnect: false,
    transports: ["websocket"],
  },
)
