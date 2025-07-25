import { loadPF } from "@/lib/loader";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  try {
    const body = await request.json();
    const pfIds = body.pfIds as string[];
    const { locale } = await params;
    
    if (!Array.isArray(pfIds) || pfIds.some(id => typeof id !== 'string')) {
      return NextResponse.json({ error: 'Invalid pfIds' }, { status: 400 });
    }

    const pfData = await loadPF(pfIds, locale);

    return NextResponse.json(pfData);
  } catch {
    return NextResponse.json({ error: 'Failed to load pf data' }, { status: 500 });
  }
}
