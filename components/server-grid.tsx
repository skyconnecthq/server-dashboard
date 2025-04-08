import type { Server } from "@/types/server"
import { ServerCard } from "./server-card"

interface ServerGridProps {
  servers: Server[]
}

export function ServerGrid({ servers }: ServerGridProps) {
  if (servers.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No servers found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {servers.map((server) => (
        <ServerCard key={server.id} server={server} />
      ))}
    </div>
  )
}
