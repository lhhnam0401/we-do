import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "./atoms/auth";
import { coupleAtom } from "./atoms/couple";
import { useAuth } from "./hooks/useAuth";
import { AppShell } from "./components/layout/AppShell";
import { Spinner } from "./components/ui/Spinner";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NewPlanPage } from "./pages/NewPlanPage";
import { PlanDetailPage } from "./pages/PlanDetailPage";
import { ProfilePage } from "./pages/ProfilePage";

function ProtectedRoute() {
  const token = useAtomValue(accessTokenAtom);
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function CoupleRoute() {
  const couple = useAtomValue(coupleAtom);
  if (!couple) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

function AppInit({ children }: { children: React.ReactNode }) {
  const { restoreSession } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    restoreSession().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-8 h-8 text-rose-400" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/profile" element={<AppShell />}>
              <Route index element={<ProfilePage />} />
            </Route>

            <Route element={<CoupleRoute />}>
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/plans/new" element={<NewPlanPage />} />
                <Route path="/plans/:id" element={<PlanDetailPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppInit>
    </BrowserRouter>
  );
}
