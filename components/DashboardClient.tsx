"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Server } from "@/types/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { ServerGrid } from "@/components/server-grid"
import { ServerTable } from "@/components/server-table"
import { StatusSummary } from "@/components/status-summary"
import { ViewToggle } from "@/components/view-toggle"
import { Search, X } from "lucide-react"

interface DashboardClientProps {
  initialServers: Server[]
}

export default function DashboardClient({ initialServers }: DashboardClientProps) {
  const [allServers] = useState<Server[]>(initialServers)
  const [filteredServers, setFilteredServers] = useState<Server[]>(initialServers)
  const [view, setView] = useState<"grid" | "table">("grid")
  const [searchApplied, setSearchApplied] = useState(false)
  const [networkFilter, setNetworkFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  // Get unique network statuses from the data
  const networkStatuses = allServers.length
    ? ["all", ...new Set(allServers.map((server) => server["Status Summary"]["NETWORK"]))]
    : ["all"]

  // Apply filters whenever search term, network filter, or active filter changes
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

    // Apply active filter from summary cards
    if (activeFilter === "network-down") {
      filtered = filtered.filter((server) => server["Status Summary"]["NETWORK"] === "Down")
      // Also update the network dropdown to match
      if (networkFilter !== "Down") {
        setNetworkFilter("Down")
      }
    } else if (activeFilter === "disk-warning") {
      filtered = filtered.filter((server) => server["Status Summary"]["DISK"]?.includes("Warning") || false)
    } else if (activeFilter === "memory-warning") {
      filtered = filtered.filter((server) => server["Status Summary"]["FREE MEM"]?.includes("Warning") || false)
    }

    setFilteredServers(filtered)
    setSearchApplied(filtered.length !== allServers.length)
  }, [searchTerm, networkFilter, allServers, activeFilter])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleNetworkFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // If changing network filter, clear the active filter if it's network-down
    if (activeFilter === "network-down") {
      setActiveFilter(null)
    }
    setNetworkFilter(e.target.value)
  }

  const handleFilterNetworkDown = () => {
    if (activeFilter === "network-down") {
      // If already active, clear the filter
      setActiveFilter(null)
      setNetworkFilter("all")
    } else {
      setActiveFilter("network-down")
      setNetworkFilter("Down")
    }
  }

  const handleFilterDiskWarnings = () => {
    if (activeFilter === "disk-warning") {
      // If already active, clear the filter
      setActiveFilter(null)
    } else {
      setActiveFilter("disk-warning")
    }
  }

  const handleFilterMemoryWarnings = () => {
    if (activeFilter === "memory-warning") {
      // If already active, clear the filter
      setActiveFilter(null)
    } else {
      setActiveFilter("memory-warning")
    }
  }

  const clearAllFilters = () => {
    setActiveFilter(null)
    setNetworkFilter("all")
    setSearchTerm("")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px]">
      <DashboardHeader
        title="Server Health Dashboard"
        totalServers={allServers.length}
        filteredCount={filteredServers.length}
      />

      <StatusSummary
        servers={allServers}
        onFilterNetworkDown={handleFilterNetworkDown}
        onFilterDiskWarnings={handleFilterDiskWarnings}
        onFilterMemoryWarnings={handleFilterMemoryWarnings}
        activeFilter={activeFilter}
      />

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

        {/* Clear filters button - only show when filters are applied */}
        {searchApplied && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
            aria-label="Clear all filters"
          >
            <X size={16} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Active filter indicator */}
      {activeFilter && (
        <div className="mb-4 flex items-center">
          <span className="text-sm text-gray-500 mr-2">Active filter:</span>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
            {activeFilter === "network-down"
              ? "Network Down"
              : activeFilter === "disk-warning"
                ? "Disk Warnings"
                : "Memory Warnings"}
          </span>
        </div>
      )}

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
