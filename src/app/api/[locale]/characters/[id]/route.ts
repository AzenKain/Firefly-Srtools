import { NextRequest, NextResponse } from 'next/server'
import { loadCharacters } from '@/lib/loader'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, locale: string }> }
) {

  const { id, locale } = await params
  const characters = await loadCharacters([id], locale)
  const char = characters[id]

  if (!char) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 })
  }

  return NextResponse.json(char)
}
