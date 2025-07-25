import { loadAS } from "@/lib/loader";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  try {
    const body = await request.json();
    const asIds = body.asIds as string[];
    const { locale } = await params;
    
    if (!Array.isArray(asIds) || asIds.some(id => typeof id !== 'string')) {
      return NextResponse.json({ error: 'Invalid asIds' }, { status: 400 });
    }

    const asData = await loadAS(asIds, locale);

    return NextResponse.json(asData);
  } catch {
    return NextResponse.json({ error: 'Failed to load as data' }, { status: 500 });
  }
}
