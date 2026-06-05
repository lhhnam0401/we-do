import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface Props {
  onJoin: (code: string) => Promise<void>;
}

export function JoinForm({ onJoin }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim().length !== 6) return setError("Enter a 6-character code");
    setError("");
    setLoading(true);
    try {
      await onJoin(code.trim().toUpperCase());
    } catch (err: any) {
      setError(err.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        label="Partner's invite code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="ABC123"
        maxLength={6}
        error={error}
        className="text-center text-xl tracking-widest font-mono uppercase"
      />
      <Button type="submit" loading={loading}>Join Partner</Button>
    </form>
  );
}
