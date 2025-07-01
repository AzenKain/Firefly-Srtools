import { NextRequest, NextResponse } from 'next/server'
import { loadRelics } from '@/lib/relicLoader'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, locale: string }> }
) {

  const { id, locale } = await params
  const relics = await loadRelics([id], locale)
  const relic = relics[id]

  if (!relic) {
    return NextResponse.json({ error: 'Relic not found' }, { status: 404 })
  }

  return NextResponse.json(relic)
}
