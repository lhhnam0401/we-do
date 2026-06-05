import { useEffect } from "react";
import { useAtom } from "jotai";
import { toastAtom } from "../../atoms/ui";

export function ToastContainer() {
  const [toast, setToast] = useAtom(toastAtom);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-white text-sm shadow-lg ${colors[toast.type]}`}>
      {toast.message}
    </div>
  );
}

export function useToast() {
  const [, setToast] = useAtom(toastAtom);
  return {
    show: (message: string, type: "success" | "error" | "info" = "info") =>
      setToast({ id: Math.random().toString(36), message, type }),
  };
}
