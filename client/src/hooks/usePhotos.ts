import { apiFetch, apiJson } from "../lib/api";
import type { Photo } from "../types";

export function usePhotos(planId: string) {
  async function fetchPhotos(): Promise<Photo[]> {
    return apiJson<Photo[]>(`/plans/${planId}/photos`);
  }

  async function uploadPhotoFetch(file: File): Promise<Photo> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiFetch(`/plans/${planId}/photos`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Upload failed" }));
      throw new Error(err.detail);
    }
    return res.json();
  }

  async function deletePhoto(photoId: string): Promise<void> {
    await apiJson(`/plans/${planId}/photos/${photoId}`, { method: "DELETE" });
  }

  return { fetchPhotos, uploadPhotoFetch, deletePhoto };
}
