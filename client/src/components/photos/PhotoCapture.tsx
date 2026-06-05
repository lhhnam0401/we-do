import { useRef } from "react";
import { isMobile } from "../../lib/utils";
import { Button } from "../ui/Button";

interface Props {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export function PhotoCapture({ onFiles, disabled }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
  const mobile = isMobile();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFiles(files);
    e.target.value = "";
  }

  return (
    <div className="flex gap-2">
      {mobile ? (
        <>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled}
            onClick={() => cameraRef.current?.click()}
          >
            📷 Take Photo
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled}
            onClick={() => libraryRef.current?.click()}
          >
            🖼️ Choose
          </Button>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={handleChange} />
          <input ref={libraryRef} type="file" accept="image/*" multiple hidden onChange={handleChange} />
        </>
      ) : (
        <>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled}
            onClick={() => libraryRef.current?.click()}
          >
            📁 Upload Photos
          </Button>
          <input ref={libraryRef} type="file" accept="image/*" multiple hidden onChange={handleChange} />
        </>
      )}
    </div>
  );
}
