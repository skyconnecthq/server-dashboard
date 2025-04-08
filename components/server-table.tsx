import type { Server } from "@/types/server"
import { StatusBadge } from "./status-badge"

interface ServerTableProps {
  servers: Server[]
}

export function ServerTable({ servers }: ServerTableProps) {
  if (servers.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500">No servers found matching your criteria.</p>
      </div>
    )
  }

  // Get all unique keys from all servers
  const allKeys = new Set<string>()
  servers.forEach((server) => {
    Object.keys(server["Status Summary"]).forEach((key) => {
      allKeys.add(key)
    })
  })

  // Convert to array and sort with important columns first
  const priorityKeys = ["CPU %Idle", "DISK", "FREE MEM", "NETWORK"]
  const otherKeys = Array.from(allKeys)
    .filter((key) => !priorityKeys.includes(key))
    .sort()
  const columns = ["Server", ...priorityKeys, ...otherKeys]

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {servers.map((server, index) => (
            <tr
              key={server.id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                server["Status Summary"]["NETWORK"] === "Down" ? "bg-red-50" : ""
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{server.id}</td>
              {columns.slice(1).map((key) => {
                // Ensure we have a string value, not undefined
                const value = server["Status Summary"][key] || "-"
                return (
                  <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {value !== "-" ? <StatusBadge status={value} /> : "-"}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
