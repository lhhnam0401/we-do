import { atom } from "jotai";

export type WsStatus = "connected" | "connecting" | "disconnected";
export const wsStatusAtom = atom<WsStatus>("disconnected");
