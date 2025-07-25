import { loadMainAffix } from "@/lib/loader";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mainAffix = await loadMainAffix();
    return NextResponse.json(mainAffix);
  } catch {
    return NextResponse.json({ error: 'Failed to load main affix' }, { status: 500 });
  }
}
