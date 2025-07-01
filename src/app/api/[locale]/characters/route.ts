import { loadCharacters } from "@/lib/characterLoader";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  try {
    const body = await request.json();
    const charIds = body.charIds as string[];
    const { locale } = await params;
    
    if (!Array.isArray(charIds) || charIds.some(id => typeof id !== 'string')) {
      return NextResponse.json({ error: 'Invalid charIds' }, { status: 400 });
    }

    const characters = await loadCharacters(charIds, locale);

    return NextResponse.json(characters);
  } catch {
    return NextResponse.json({ error: 'Failed to load characters' }, { status: 500 });
  }
}
