import { NavLink } from "react-router-dom";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 flex justify-around py-2 sm:hidden">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 px-4 py-1 text-xs ${isActive ? "text-rose-500" : "text-gray-500"}`
        }
      >
        <span className="text-xl">🗂️</span>
        Plans
      </NavLink>
      <NavLink
        to="/plans/new"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 px-4 py-1 text-xs ${isActive ? "text-rose-500" : "text-gray-500"}`
        }
      >
        <span className="text-xl">➕</span>
        New
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 px-4 py-1 text-xs ${isActive ? "text-rose-500" : "text-gray-500"}`
        }
      >
        <span className="text-xl">👤</span>
        Profile
      </NavLink>
    </nav>
  );
}
