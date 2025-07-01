import { NextRequest, NextResponse } from "next/server";
import { loadRelics } from "@/lib/relicLoader";

export async function POST(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  try {
    const body = await request.json();
    const relicIds = body.relicIds as string[];
    const { locale } = await params;
    
    if (!Array.isArray(relicIds) || relicIds.some(id => typeof id !== 'string')) {
      return NextResponse.json({ error: 'Invalid relicIds' }, { status: 400 });
    }

    const relics = await loadRelics(relicIds, locale);

    return NextResponse.json(relics);
  } catch {
    return NextResponse.json({ error: 'Failed to load relics' }, { status: 500 });
  }
}
