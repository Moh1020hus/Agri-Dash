import { clsx } from "clsx";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "online" | "warning" | "offline";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium border",
        status === "online" && "bg-green-50 text-green-700 border-green-200",
        status === "warning" && "bg-amber-50 text-amber-700 border-amber-200",
        status === "offline" && "bg-red-50 text-red-700 border-red-200"
      )}
    >
      {status === "online" && <CheckCircle size={14} />}
      {status === "warning" && <AlertTriangle size={14} />}
      {status === "offline" && <XCircle size={14} />}

      {/* Capitalize first letter */}
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
  );
}
