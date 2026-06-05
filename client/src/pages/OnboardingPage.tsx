import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCouple } from "../hooks/useCouple";
import { InviteCodeDisplay } from "../components/couple/InviteCodeDisplay";
import { JoinForm } from "../components/couple/JoinForm";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { couple, createCouple, joinCouple } = useCouple();
  const toast = useToast();
  const [view, setView] = useState<"choose" | "create" | "join">("choose");
  const [loading, setLoading] = useState(false);

  // Pre-fill code from URL param (shared link)
  const codeFromUrl = searchParams.get("code");

  useEffect(() => {
    if (codeFromUrl) setView("join");
  }, [codeFromUrl]);

  useEffect(() => {
    if (couple) navigate("/dashboard");
  }, [couple]);

  async function handleCreate() {
    setLoading(true);
    try {
      await createCouple();
      toast.show("Couple created! Share the code with your partner 💑", "success");
    } catch (err: any) {
      toast.show(err.message || "Failed to create couple", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(code: string) {
    await joinCouple(code);
    toast.show("Joined! You're now connected 💑", "success");
    navigate("/dashboard");
  }

  if (view === "choose") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-6 bg-gradient-to-b from-rose-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-3">💑</div>
          <h1 className="text-2xl font-bold text-gray-900">Connect with your partner</h1>
          <p className="text-gray-500 text-sm mt-2">Create a shared space or join your partner's</p>
        </div>
        <div className="w-full max-w-sm flex flex-col gap-3">
          <Button onClick={() => setView("create")} loading={loading} className="w-full py-3 text-base">
            Create our space ✨
          </Button>
          <Button variant="secondary" onClick={() => setView("join")} className="w-full py-3 text-base">
            Join with a code 🔑
          </Button>
        </div>
      </div>
    );
  }

  if (view === "create") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-rose-50 to-white">
        <div className="w-full max-w-sm flex flex-col gap-5">
          <button onClick={() => setView("choose")} className="text-sm text-gray-400 self-start">← Back</button>
          <div className="text-center">
            <h2 className="text-xl font-bold">Create your space</h2>
            <p className="text-sm text-gray-500 mt-1">An invite code will be generated for your partner</p>
          </div>
          <Button onClick={handleCreate} loading={loading} className="w-full">Create & Get Code</Button>
          {couple && <InviteCodeDisplay code={couple.invite_code} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-rose-50 to-white">
      <div className="w-full max-w-sm flex flex-col gap-5">
        <button onClick={() => setView("choose")} className="text-sm text-gray-400 self-start">← Back</button>
        <div className="text-center">
          <h2 className="text-xl font-bold">Join your partner</h2>
          <p className="text-sm text-gray-500 mt-1">Enter the 6-character code they shared</p>
        </div>
        <JoinForm onJoin={handleJoin} />
      </div>
    </div>
  );
}
