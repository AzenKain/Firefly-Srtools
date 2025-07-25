import { loadSubAffix } from "@/lib/loader";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const subAffix = await loadSubAffix();
    return NextResponse.json(subAffix);
  } catch {
    return NextResponse.json({ error: 'Failed to load sub affix' }, { status: 500 });
  }
}
