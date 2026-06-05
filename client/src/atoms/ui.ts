import { atom } from "jotai";
import type { Toast } from "../types";

export const isLoadingAtom = atom(false);
export const toastAtom = atom<Toast | null>(null);
