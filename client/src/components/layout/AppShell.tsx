import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { ToastContainer } from "../ui/Toast";
import { useCoupleWebSocket } from "../../hooks/useWebSocket";

export function AppShell() {
  useCoupleWebSocket();

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1 pb-20 sm:pb-4">
        <Outlet />
      </main>
      <BottomNav />
      <ToastContainer />
    </div>
  );
}
