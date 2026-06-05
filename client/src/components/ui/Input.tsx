import { type InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className = "", ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      ref={ref}
      {...props}
      className={`rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-rose-400 focus:border-rose-400 ${
        error ? "border-red-400" : "border-gray-300"
      } ${className}`}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
));
Input.displayName = "Input";
