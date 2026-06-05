import type { User } from "../../types";

export function PartnerCard({ partner }: { partner: User }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100">
      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-lg">
        💑
      </div>
      <div>
        <p className="font-medium text-gray-800">{partner.display_name}</p>
        <p className="text-xs text-gray-400">{partner.email}</p>
      </div>
    </div>
  );
}
