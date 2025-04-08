import { NextResponse } from "next/server"
import { getServerDataFromFile } from "@/app/data"

export async function GET() {
  try {
    const data = await getServerDataFromFile()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in server API route:", error)
    return NextResponse.json({ error: "Failed to fetch server data" }, { status: 500 })
  }
}
