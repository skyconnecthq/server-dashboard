"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Server } from "@/types/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { ServerGrid } from "@/components/server-grid"
import { ServerTable } from "@/components/server-table"
import { StatusSummary } from "@/components/status-summary"
import { ViewToggle } from "@/components/view-toggle"
import { getServerData } from "@/services/server-service"
import { Search } from "lucide-react"

export default function Dashboard() {
  const [allServers, setAllServers] = useState<Server[]>([])
  const [filteredServers, setFilteredServers] = useState<Server[]>([])
  const [view, setView] = useState<"grid" | "table">("grid")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchApplied, setSearchApplied] = useState(false)
  const [networkFilter, setNetworkFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Get unique network statuses from the data
  const networkStatuses = allServers.length
    ? ["all", ...new Set(allServers.map((server) => server["Status Summary"]["NETWORK"]))]
    : ["all"]

  // Load server data on component mount
  useEffect(() => {
    async function loadServerData() {
      try {
        setLoading(true)
        const servers = await getServerData()

        if (servers.length === 0) {
          throw new Error("No server data available")
        }

        setAllServers(servers)
        setFilteredServers(servers)
        setError(null)
      } catch (err) {
        console.error("Failed to load server data:", err)
        setError("Failed to load server data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadServerData()
  }, [])

  // Apply filters whenever search term or network filter changes
  useEffect(() => {
    if (allServers.length === 0) return

    let filtered = [...allServers]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((server) => server.id.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply network filter
    if (networkFilter !== "all") {
      filtered = filtered.filter((server) => server["Status Summary"]["NETWORK"] === networkFilter)
    }

    setFilteredServers(filtered)
    setSearchApplied(filtered.length !== allServers.length)
  }, [searchTerm, networkFilter, allServers])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleNetworkFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNetworkFilter(e.target.value)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-4 text-gray-600">Loading server data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <DashboardHeader
        title="Server Health Dashboard"
        totalServers={allServers.length}
        filteredCount={filteredServers.length}
      />

      <StatusSummary servers={allServers} />

      {/* Single row for all controls - always in a row */}
      <div className="flex items-center gap-3 mb-8">
        {/* Search bar - takes most space */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              placeholder="Search servers..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Network dropdown - fixed width */}
        {networkStatuses.length > 1 && (
          <div className="w-32 shrink-0">
            <select
              id="network-filter"
              className="w-full px-2 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-sm"
              value={networkFilter}
              onChange={handleNetworkFilterChange}
              aria-label="Filter by network status"
            >
              {networkStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Networks" : status}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* View toggle - fixed width */}
        <div className="shrink-0">
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>

      {filteredServers.length === 0 && searchApplied ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No servers found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : view === "grid" ? (
        <ServerGrid servers={filteredServers} />
      ) : (
        <ServerTable servers={filteredServers} />
      )}
    </div>
  )
}
