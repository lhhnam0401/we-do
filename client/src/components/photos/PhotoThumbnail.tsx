import type { Photo } from "../../types";

interface Props {
  photo: Photo;
  onDelete?: () => void;
}

export function PhotoThumbnail({ photo, onDelete }: Props) {
  return (
    <div className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
      <a href={`/${photo.file_path}`} target="_blank" rel="noopener noreferrer">
        <img
          src={`/${photo.thumbnail_path}`}
          alt={photo.original_filename}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </a>
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
}
