"use client"

import { LayoutGrid, List } from "lucide-react"

interface ViewToggleProps {
  view: "grid" | "table"
  onViewChange: (view: "grid" | "table") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center h-[42px] space-x-1 bg-white p-1 rounded-lg border border-gray-300 shadow-sm">
      <button
        onClick={() => onViewChange("grid")}
        className={`p-1.5 rounded-md transition-colors duration-200 ${
          view === "grid" ? "bg-blue-100 text-blue-700" : "bg-transparent text-gray-600 hover:bg-gray-100"
        }`}
        aria-label="Grid view"
      >
        <LayoutGrid size={18} />
      </button>
      <button
        onClick={() => onViewChange("table")}
        className={`p-1.5 rounded-md transition-colors duration-200 ${
          view === "table" ? "bg-blue-100 text-blue-700" : "bg-transparent text-gray-600 hover:bg-gray-100"
        }`}
        aria-label="Table view"
      >
        <List size={18} />
      </button>
    </div>
  )
}
