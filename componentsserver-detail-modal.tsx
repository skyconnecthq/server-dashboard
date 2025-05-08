"use client"

import { useEffect, useRef } from "react"
import type { Server } from "@/types/server"
import { StatusBadge } from "./status-badge"
import { X, Cpu, HardDrive, MemoryStickIcon as Memory, Wifi, AlertTriangle, ServerIcon } from "lucide-react"

interface ServerDetailModalProps {
  server: Server | null
  onClose: () => void
}

export function ServerDetailModal({ server, onClose }: ServerDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Close modal on ESC key
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscKey)

    // Prevent scrolling of the body when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  if (!server) return null

  // Render different content based on server status type
  const renderServerDetails = () => {
    if (typeof server["Status Summary"] === "string") {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-red-600 mb-2">Server Unreachable</h3>
          <p className="text-gray-600 text-center max-w-md">
            Unable to connect to this server. The server may be down, experiencing network issues, or undergoing
            maintenance.
          </p>
        </div>
      )
    }

    const status = server["Status Summary"]
    const networkStatus = status["NETWORK"] || "Unknown"

    return (
      <div className="space-y-6">
        {/* Server status overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-3">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Cpu className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">CPU Idle</span>
                </div>
                <span className="font-medium">{status["CPU %Idle"] || "Unknown"}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">Disk Usage</span>
                </div>
                <span className="font-medium">{status["DISK"] || "Unknown"}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Memory className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">Free Memory</span>
                </div>
                <span className="font-medium">{status["FREE MEM"] || "Unknown"}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wifi className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">Network</span>
                </div>
                <StatusBadge status={networkStatus} />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Server Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Server ID</span>
                <span className="font-medium">{server.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Type</span>
                <span className="font-medium">
                  {server.id.includes("MMSC")
                    ? "Multimedia Messaging"
                    : server.id.includes("HSP")
                      ? "High-Speed Processing"
                      : server.id.includes("DB")
                        ? "Database"
                        : server.id.includes("AUTH")
                          ? "Authentication"
                          : server.id.includes("API")
                            ? "API"
                            : server.id.includes("CACHE")
                              ? "Cache"
                              : server.id.includes("PROXY")
                                ? "Proxy"
                                : server.id.includes("STORAGE")
                                  ? "Storage"
                                  : server.id.includes("COMPUTE")
                                    ? "Compute"
                                    : "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Status</span>
                <StatusBadge status={networkStatus} />
              </div>
            </div>
          </div>
        </div>

        {/* Components section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Components</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Component
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(status)
                  .filter(([key]) => !["CPU %Idle", "DISK", "FREE MEM", "NETWORK"].includes(key))
                  .map(([key, value]) => (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <StatusBadge status={value || "Unknown"} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Determine border color based on status
  let borderColorClass = "border-gray-200"
  if (typeof server["Status Summary"] === "string") {
    borderColorClass = "border-red-500"
  } else {
    const networkStatus = server["Status Summary"]["NETWORK"]
    if (networkStatus === "Down") {
      borderColorClass = "border-red-500"
    } else if (networkStatus === "Up") {
      borderColorClass = "border-green-500"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-t-4 ${borderColorClass}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            <ServerIcon className="h-6 w-6 text-gray-500 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">{server.id}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">{renderServerDetails()}</div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
