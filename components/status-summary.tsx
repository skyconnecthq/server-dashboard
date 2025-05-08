"use client"

import type React from "react"

import type { Server } from "@/types/server"
import { ServerIcon, HardDrive, MemoryStickIcon as Memory, Wifi, AlertTriangle, ArrowRight } from "lucide-react"
import { useState } from "react"

interface StatusSummaryProps {
  servers: Server[]
  onFilterNetworkDown: () => void
  onFilterDiskWarnings: () => void
  onFilterMemoryWarnings: () => void
  onFilterUnreachable?: () => void
  activeFilter: string | null
}

export function StatusSummary({
  servers,
  onFilterNetworkDown,
  onFilterDiskWarnings,
  onFilterMemoryWarnings,
  onFilterUnreachable = () => {},
  activeFilter,
}: StatusSummaryProps) {
  // Count unreachable servers
  const unreachableCount = servers.filter((server) => typeof server["Status Summary"] === "string").length

  // Count servers with "Down" network status (only for object Status Summary)
  const networkDownCount = servers.filter(
    (server) => typeof server["Status Summary"] === "object" && server["Status Summary"]["NETWORK"] === "Down",
  ).length

  // Count servers with disk warnings (only for object Status Summary)
  const diskWarningCount = servers.filter(
    (server) => typeof server["Status Summary"] === "object" && server["Status Summary"]["DISK"]?.includes("Warning"),
  ).length

  // Count servers with memory warnings (only for object Status Summary)
  const memoryWarningCount = servers.filter(
    (server) =>
      typeof server["Status Summary"] === "object" && server["Status Summary"]["FREE MEM"]?.includes("Warning"),
  ).length

  // Track hover state for each card
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  // Helper function to create percentage and determine severity
  const getMetrics = (count: number) => {
    const percentage = servers.length > 0 ? (count / servers.length) * 100 : 0
    let severity = "normal"
    if (percentage > 30) severity = "critical"
    else if (percentage > 10) severity = "warning"

    return {
      percentage: percentage.toFixed(1),
      severity,
    }
  }

  // Create a reusable card component
  const SummaryCard = ({
    id,
    title,
    count,
    icon,
    onClick,
    isActive,
    colorScheme = "blue",
    showIfZero = true,
    isClickable = true,
  }: {
    id: string
    title: string
    count: number
    icon: React.ReactNode
    onClick: () => void
    isActive: boolean
    colorScheme?: "blue" | "red" | "yellow" | "green"
    showIfZero?: boolean
    isClickable?: boolean
  }) => {
    if (count === 0 && !showIfZero) return null

    const { percentage, severity } = getMetrics(count)
    const isHovered = hoveredCard === id && isClickable

    // Define color schemes
    const colorSchemes = {
      blue: {
        bg: "bg-blue-50",
        hoverBg: isClickable ? "hover:bg-blue-100" : "",
        activeBg: "bg-blue-100",
        border: "border-blue-200",
        activeBorder: "border-blue-500",
        ring: "ring-blue-500/20",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        textColor: "text-blue-600",
      },
      red: {
        bg: "bg-red-50",
        hoverBg: isClickable ? "hover:bg-red-100" : "",
        activeBg: "bg-red-100",
        border: "border-red-200",
        activeBorder: "border-red-500",
        ring: "ring-red-500/20",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        textColor: "text-red-600",
      },
      yellow: {
        bg: "bg-yellow-50",
        hoverBg: isClickable ? "hover:bg-yellow-100" : "",
        activeBg: "bg-yellow-100",
        border: "border-yellow-200",
        activeBorder: "border-yellow-500",
        ring: "ring-yellow-500/20",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        textColor: "text-yellow-600",
      },
      green: {
        bg: "bg-green-50",
        hoverBg: isClickable ? "hover:bg-green-100" : "",
        activeBg: "bg-green-100",
        border: "border-green-200",
        activeBorder: "border-green-500",
        ring: "ring-green-500/20",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        textColor: "text-green-600",
      },
    }

    const colors = colorSchemes[colorScheme]

    const CardContent = () => (
      <>
        <div className="flex items-center">
          <div
            className={`p-2 ${colors.iconBg} rounded-full mr-3 transition-transform duration-200 ${isHovered ? "scale-110" : ""}`}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <p
              className={`text-3xl font-bold ${colors.textColor} transition-all duration-300 ${isHovered ? "translate-x-1" : ""}`}
            >
              {count}
            </p>
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className={`text-xs ${colors.textColor}`}>{percentage}% of servers</span>
          {isClickable && (
            <span className={`transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}>
              <ArrowRight className={`h-4 w-4 ${colors.textColor}`} />
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <div
            className={`h-full ${
              severity === "critical"
                ? "bg-red-500"
                : severity === "warning"
                  ? "bg-yellow-500"
                  : colors.textColor.replace("text", "bg")
            } transition-all duration-300 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </>
    )

    // If not clickable, render as a div instead of a button
    if (!isClickable) {
      return (
        <div className={`relative p-5 rounded-lg shadow-sm border ${colors.bg} ${colors.border} overflow-hidden`}>
          <CardContent />
        </div>
      )
    }

    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHoveredCard(id)}
        onMouseLeave={() => setHoveredCard(null)}
        className={`relative text-left p-5 rounded-lg shadow-sm border transition-all duration-200 
          ${colors.bg} ${colors.hoverBg} 
          ${isActive ? `${colors.activeBg} ${colors.activeBorder} ring-2 ${colors.ring}` : colors.border}
          transform ${isHovered ? "scale-[1.02]" : "scale-100"} 
          cursor-pointer overflow-hidden group`}
        aria-pressed={isActive}
      >
        <CardContent />
      </button>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
      <SummaryCard
        id="total"
        title="Total Servers"
        count={servers.length}
        icon={<ServerIcon className="h-5 w-5 text-blue-600" />}
        onClick={() => {}}
        isActive={false}
        colorScheme="blue"
        isClickable={false}
      />

      {unreachableCount > 0 && (
        <SummaryCard
          id="unreachable"
          title="Unreachable"
          count={unreachableCount}
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          onClick={onFilterUnreachable}
          isActive={activeFilter === "unreachable"}
          colorScheme="red"
        />
      )}

      <SummaryCard
        id="network-down"
        title="Network Down"
        count={networkDownCount}
        icon={<Wifi className="h-5 w-5 text-red-600" />}
        onClick={onFilterNetworkDown}
        isActive={activeFilter === "network-down"}
        colorScheme="red"
        showIfZero={true}
      />

      <SummaryCard
        id="disk-warning"
        title="Disk Warnings"
        count={diskWarningCount}
        icon={<HardDrive className="h-5 w-5 text-yellow-600" />}
        onClick={onFilterDiskWarnings}
        isActive={activeFilter === "disk-warning"}
        colorScheme="yellow"
        showIfZero={true}
      />

      <SummaryCard
        id="memory-warning"
        title="Memory Warnings"
        count={memoryWarningCount}
        icon={<Memory className="h-5 w-5 text-yellow-600" />}
        onClick={onFilterMemoryWarnings}
        isActive={activeFilter === "memory-warning"}
        colorScheme="yellow"
        showIfZero={true}
      />
    </div>
  )
}
