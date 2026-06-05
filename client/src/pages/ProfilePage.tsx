import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { currentUserAtom } from "../atoms/auth";
import { coupleAtom } from "../atoms/couple";
import { useAuth } from "../hooks/useAuth";
import { useCouple } from "../hooks/useCouple";
import { InviteCodeDisplay } from "../components/couple/InviteCodeDisplay";
import { PartnerCard } from "../components/couple/PartnerCard";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useAtomValue(currentUserAtom);
  const couple = useAtomValue(coupleAtom);
  const { logout } = useAuth();
  const { leaveCouple } = useCouple();
  const toast = useToast();

  const partner = couple?.members.find((m) => m.id !== user?.id);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  async function handleLeave() {
    if (!confirm("Leave the couple? You'll need a new invite code to rejoin.")) return;
    await leaveCouple();
    toast.show("Left the couple", "info");
    navigate("/onboarding");
  }

  return (
    <div className="px-4 py-5 max-w-lg mx-auto flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-2xl">👤</div>
          <div>
            <p className="font-semibold text-gray-900">{user?.display_name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {couple ? (
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-700">Your Couple</h2>
          {partner ? (
            <PartnerCard partner={partner} />
          ) : (
            <>
              <p className="text-sm text-gray-500">Waiting for your partner to join...</p>
              <InviteCodeDisplay code={couple.invite_code} />
            </>
          )}
          <Button variant="ghost" size="sm" className="self-start text-red-500" onClick={handleLeave}>
            Leave couple
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">You're not in a couple yet.</p>
          <Button onClick={() => navigate("/onboarding")}>Connect with Partner</Button>
        </div>
      )}

      <div className="pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={handleLogout} className="w-full">Sign out</Button>
      </div>
    </div>
  );
}
