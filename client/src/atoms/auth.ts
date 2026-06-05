import { atom } from "jotai";
import type { User } from "../types";

export const accessTokenAtom = atom<string | null>(null);
export const currentUserAtom = atom<User | null>(null);
