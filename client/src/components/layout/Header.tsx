import { NavLink } from "react-router-dom";
import { useAtomValue } from "jotai";
import { wsStatusAtom } from "../../atoms/ws";
import { coupleAtom } from "../../atoms/couple";

export function Header() {
  const wsStatus = useAtomValue(wsStatusAtom);
  const couple = useAtomValue(coupleAtom);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <NavLink to="/dashboard" className="text-xl font-bold text-rose-500">
        We Do 💑
      </NavLink>
      <div className="flex items-center gap-3">
        {couple && (
          <span
            className={`w-2 h-2 rounded-full ${
              wsStatus === "connected" ? "bg-green-400" : wsStatus === "connecting" ? "bg-yellow-400" : "bg-gray-300"
            }`}
            title={wsStatus}
          />
        )}
        <NavLink to="/profile" className="hidden sm:block text-sm text-gray-600 hover:text-rose-500">
          Profile
        </NavLink>
      </div>
    </header>
  );
}
