import { atom } from "jotai";
import type { Couple, User } from "../types";

export const coupleAtom = atom<Couple | null>(null);
export const partnerAtom = atom<User | null>(null);
