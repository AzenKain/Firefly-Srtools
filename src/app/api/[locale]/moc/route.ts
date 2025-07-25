import { loadMOC } from "@/lib/loader";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  try {
    const body = await request.json();
    const mocIds = body.mocIds as string[];
    const { locale } = await params;
    
    if (!Array.isArray(mocIds) || mocIds.some(id => typeof id !== 'string')) {
      return NextResponse.json({ error: 'Invalid mocIds' }, { status: 400 });
    }

    const mocData = await loadMOC(mocIds, locale);

    return NextResponse.json(mocData);
  } catch {
    return NextResponse.json({ error: 'Failed to load moc data' }, { status: 500 });
  }
}
