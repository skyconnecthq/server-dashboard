interface DashboardHeaderProps {
  title: string
  totalServers: number
  filteredCount: number
}

export function DashboardHeader({ title, totalServers, filteredCount }: DashboardHeaderProps) {
  const now = new Date()
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="text-gray-500 mt-1">
            {filteredCount === totalServers
              ? `Monitoring ${totalServers} servers`
              : `Showing ${filteredCount} of ${totalServers} servers`}
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-right bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
          <p className="text-sm text-gray-500">{formattedTime}</p>
        </div>
      </div>
    </div>
  )
}
