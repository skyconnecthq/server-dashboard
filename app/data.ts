import fs from "fs"
import path from "path"
import type { ServerData } from "@/types/server"

// This function will be used for server-side data fetching
export async function getServerDataFromFile(): Promise<ServerData> {
  try {
    // Read the JSON file from the file system
    const filePath = path.join(process.cwd(), "public", "data", "servers.json")
    const fileContents = fs.readFileSync(filePath, "utf8")

    // Parse the JSON data
    const data: ServerData = JSON.parse(fileContents)

    return data
  } catch (error) {
    console.error("Error reading server data file:", error)
    return {} // Return empty object on error
  }
}
