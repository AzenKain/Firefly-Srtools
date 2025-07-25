import { NextRequest, NextResponse } from 'next/server'
import { loadAS } from '@/lib/loader'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, locale: string }> }
) {

  const { id, locale } = await params
  const asData = await loadAS([id], locale)
  const as = asData[id]

  if (!as) {
    return NextResponse.json({ error: 'AS info not found' }, { status: 404 })
  }

  return NextResponse.json(as)
}
