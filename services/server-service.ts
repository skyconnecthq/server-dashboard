import type { Server, ServerData } from "@/types/server"

export async function getServerData(): Promise<Server[]> {
  try {
    // Use the API route to fetch server data
    const response = await fetch("/api/servers")

    if (!response.ok) {
      throw new Error(`Failed to fetch server data: ${response.status} ${response.statusText}`)
    }

    const data: ServerData = await response.json()

    // Convert to array format with IDs
    const serversArray = Object.entries(data).map(([id, data]) => ({
      id,
      ...data,
    }))

    return serversArray
  } catch (error) {
    console.error("Error fetching server data:", error)
    return [] // Return empty array on error
  }
}
