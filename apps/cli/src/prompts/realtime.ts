import type { Backend, Realtime } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getRealtimeChoice(realtime?: Realtime, backend?: Backend) {
  if (realtime !== undefined) return realtime;

  // Realtime requires a backend
  if (backend === "none" || backend === "convex") {
    return "none" as Realtime;
  }

  const options = [
    {
      value: "socket-io" as const,
      label: "Socket.IO",
      hint: "Real-time bidirectional communication with fallbacks",
    },
    {
      value: "partykit" as const,
      label: "PartyKit",
      hint: "Edge-native multiplayer infrastructure on Cloudflare",
    },
    {
      value: "ably" as const,
      label: "Ably",
      hint: "Real-time messaging platform with pub/sub and presence",
    },
    {
      value: "pusher" as const,
      label: "Pusher",
      hint: "Real-time communication APIs with channels and events",
    },
    {
      value: "liveblocks" as const,
      label: "Liveblocks",
      hint: "Collaboration infrastructure for multiplayer experiences",
    },
    {
      value: "yjs" as const,
      label: "Y.js",
      hint: "CRDT library for real-time collaboration with conflict-free sync",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "Skip real-time/WebSocket integration",
    },
  ];

  const response = await navigableSelect<Realtime>({
    message: "Select real-time solution",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
