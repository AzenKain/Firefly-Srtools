import { loadConfigMaze } from "@/lib/loader";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const configMaze = await loadConfigMaze();
    return NextResponse.json(configMaze);
  } catch {
    return NextResponse.json({ error: 'Failed to load config maze' }, { status: 500 });
  }
}
