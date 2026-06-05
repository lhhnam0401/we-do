import { useToast } from "../ui/Toast";
import { Button } from "../ui/Button";

export function InviteCodeDisplay({ code }: { code: string }) {
  const toast = useToast();

  function copy() {
    navigator.clipboard.writeText(code).then(() => toast.show("Invite code copied!", "success"));
  }

  function share() {
    const url = `${window.location.origin}/onboarding?code=${code}`;
    if (navigator.share) {
      navigator.share({ title: "Join me on We Do!", url });
    } else {
      navigator.clipboard.writeText(url);
      toast.show("Link copied!", "success");
    }
  }

  return (
    <div className="bg-rose-50 rounded-2xl p-5 text-center flex flex-col gap-3">
      <p className="text-sm text-gray-500">Share this code with your partner</p>
      <div className="text-4xl font-bold tracking-widest text-rose-500 font-mono">{code}</div>
      <div className="flex gap-2 justify-center">
        <Button variant="secondary" size="sm" onClick={copy}>Copy Code</Button>
        <Button size="sm" onClick={share}>Share Link</Button>
      </div>
    </div>
  );
}
