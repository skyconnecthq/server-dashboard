export function getStatusColor(status: string): string {
  // Use exact values from the data
  if (status === "Running") {
    return "bg-green-100 text-green-800 ring-1 ring-green-600/20"
  }

  if (status === "Unknown") {
    return "bg-gray-100 text-gray-800 ring-1 ring-gray-500/20"
  }

  if (status === "Down") {
    return "bg-red-100 text-red-800 ring-1 ring-red-600/20"
  }

  if (status.includes("Warning")) {
    return "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20"
  }

  if (status === "Up") {
    return "bg-green-100 text-green-800 ring-1 ring-green-600/20"
  }

  // Default styling for any other values
  return "bg-blue-100 text-blue-800 ring-1 ring-blue-500/20"
}

export function getStatusBorderColor(status: string): string {
  // Use exact values from the data
  if (status === "Running") {
    return "border-green-500"
  }

  if (status === "Unknown") {
    return "border-gray-300"
  }

  if (status === "Down") {
    return "border-red-500"
  }

  if (status.includes("Warning")) {
    return "border-yellow-500"
  }

  if (status === "Up") {
    return "border-green-500"
  }

  // Default border color
  return "border-blue-500"
}
