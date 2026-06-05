import { useState } from "react";
import type { Photo } from "../../types";
import { PhotoCapture } from "./PhotoCapture";
import { PhotoThumbnail } from "./PhotoThumbnail";
import { usePhotos } from "../../hooks/usePhotos";
import { useToast } from "../ui/Toast";
import { Spinner } from "../ui/Spinner";

interface UploadingPreview {
  id: string;
  url: string;
  progress: number;
}

interface Props {
  planId: string;
  photos: Photo[];
  onRefresh: () => void;
}

export function PhotoGrid({ planId, photos, onRefresh }: Props) {
  const { uploadPhotoFetch, deletePhoto } = usePhotos(planId);
  const toast = useToast();
  const [uploading, setUploading] = useState<UploadingPreview[]>([]);

  async function handleFiles(files: File[]) {
    for (const file of files) {
      const previewUrl = URL.createObjectURL(file);
      const id = Math.random().toString(36).slice(2);
      setUploading((prev) => [...prev, { id, url: previewUrl, progress: 0 }]);

      try {
        await uploadPhotoFetch(file);
        URL.revokeObjectURL(previewUrl);
        onRefresh();
        toast.show("Photo uploaded!", "success");
      } catch {
        toast.show("Upload failed", "error");
      } finally {
        setUploading((prev) => prev.filter((u) => u.id !== id));
      }
    }
  }

  async function handleDelete(photoId: string) {
    try {
      await deletePhoto(photoId);
      onRefresh();
      toast.show("Photo deleted", "info");
    } catch {
      toast.show("Failed to delete photo", "error");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">Photos</h3>
        <PhotoCapture onFiles={handleFiles} />
      </div>

      {photos.length === 0 && uploading.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No photos yet. Add the first one!</p>
      )}

      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <PhotoThumbnail key={photo.id} photo={photo} onDelete={() => handleDelete(photo.id)} />
        ))}
        {uploading.map((u) => (
          <div key={u.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img src={u.url} className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner className="w-6 h-6 text-rose-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
