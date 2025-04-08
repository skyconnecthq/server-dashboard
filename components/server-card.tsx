import type { Server } from "@/types/server"
import { StatusBadge } from "./status-badge"
import { getStatusBorderColor } from "@/utils/status-utils"
import { Cpu, HardDrive, MemoryStickIcon as Memory } from "lucide-react"

interface ServerCardProps {
  server: Server
}

export function ServerCard({ server }: ServerCardProps) {
  const status = server["Status Summary"]
  const borderColor = getStatusBorderColor(status["NETWORK"] || "Unknown")

  // Set background color based on network status
  const bgColor = status["NETWORK"] === "Down" ? "bg-red-50" : "bg-white"

  return (
    <div
      className={`border-l-4 ${borderColor} rounded-lg shadow-sm p-5 ${bgColor} hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-800">{server.id}</h3>
        <StatusBadge status={status["NETWORK"] || "Unknown"} />
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm">
        <div className="flex items-center">
          <Cpu className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-500 mr-2">CPU:</span>
          <span className="font-medium">{status["CPU %Idle"] || "Unknown"}</span>
        </div>
        <div className="flex items-center">
          <HardDrive className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-500 mr-2">Disk:</span>
          <span className="font-medium">{status["DISK"] || "Unknown"}</span>
        </div>
        <div className="flex items-center">
          <Memory className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-500 mr-2">Memory:</span>
          <span className="font-medium">{status["FREE MEM"] || "Unknown"}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <h4 className="text-xs font-medium text-gray-500 mb-2">Components</h4>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(status)
            .filter(([key]) => !["CPU %Idle", "DISK", "FREE MEM", "NETWORK"].includes(key))
            .map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-1">
                <span className="text-gray-500 text-xs">{key}</span>
                <StatusBadge status={value || "Unknown"} className="ml-2" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
