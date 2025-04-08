import type { Server } from "@/types/server"
import { ServerIcon, HardDrive, MemoryStickIcon as Memory, Wifi } from "lucide-react"

interface StatusSummaryProps {
  servers: Server[]
}

export function StatusSummary({ servers }: StatusSummaryProps) {
  // Count servers with "Down" network status
  const networkDownCount = servers.filter((server) => server["Status Summary"]["NETWORK"] === "Down").length

  // Count servers with disk warnings
  const diskWarningCount = servers.filter(
    (server) => server["Status Summary"]["DISK"]?.includes("Warning") || false,
  ).length

  // Count servers with memory warnings
  const memoryWarningCount = servers.filter(
    (server) => server["Status Summary"]["FREE MEM"]?.includes("Warning") || false,
  ).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-full mr-3">
            <ServerIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Servers</h3>
            <p className="text-3xl font-bold text-gray-800">{servers.length}</p>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">Monitoring all servers</div>
      </div>

      <div className="bg-red-50 p-5 rounded-lg shadow-sm border border-red-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-full mr-3">
            <Wifi className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Network Down</h3>
            <p className="text-3xl font-bold text-red-600">{networkDownCount}</p>
          </div>
        </div>
        <div className="mt-2 text-xs text-red-600">
          {servers.length > 0 ? ((networkDownCount / servers.length) * 100).toFixed(1) : "0"}% of servers
        </div>
      </div>

      <div className="bg-yellow-50 p-5 rounded-lg shadow-sm border border-yellow-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-full mr-3">
            <HardDrive className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Disk Warnings</h3>
            <p className="text-3xl font-bold text-yellow-600">{diskWarningCount}</p>
          </div>
        </div>
        <div className="mt-2 text-xs text-yellow-600">
          {servers.length > 0 ? ((diskWarningCount / servers.length) * 100).toFixed(1) : "0"}% of servers
        </div>
      </div>

      <div className="bg-yellow-50 p-5 rounded-lg shadow-sm border border-yellow-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-full mr-3">
            <Memory className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Memory Warnings</h3>
            <p className="text-3xl font-bold text-yellow-600">{memoryWarningCount}</p>
          </div>
        </div>
        <div className="mt-2 text-xs text-yellow-600">
          {servers.length > 0 ? ((memoryWarningCount / servers.length) * 100).toFixed(1) : "0"}% of servers
        </div>
      </div>
    </div>
  )
}
