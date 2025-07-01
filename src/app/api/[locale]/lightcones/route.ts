import { loadLightcones } from "@/lib/lighconeLoader";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  try {
    const body = await request.json();
    const lightconeIds = body.lightconeIds as string[];
    const { locale } = await params;
    
    if (!Array.isArray(lightconeIds) || lightconeIds.some(id => typeof id !== 'string')) {
      return NextResponse.json({ error: 'Invalid lightconeIds' }, { status: 400 });
    }

    const lightcones = await loadLightcones(lightconeIds, locale);

    return NextResponse.json(lightcones);
  } catch {
    return NextResponse.json({ error: 'Failed to load lightcones' }, { status: 500 });
  }
}
