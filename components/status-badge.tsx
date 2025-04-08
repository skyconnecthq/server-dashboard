import { getStatusColor } from "@/utils/status-utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  // Add a fallback for undefined status
  const displayStatus = status || "Unknown"

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
        displayStatus,
      )} ${className}`}
    >
      {displayStatus}
    </span>
  )
}
