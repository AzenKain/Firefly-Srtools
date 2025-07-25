import { NextRequest, NextResponse } from 'next/server'
import { loadPF } from '@/lib/loader'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, locale: string }> }
) {

  const { id, locale } = await params
  const pfData = await loadPF([id], locale)
  const pf = pfData[id]

  if (!pf) {
    return NextResponse.json({ error: 'PF info not found' }, { status: 404 })
  }

  return NextResponse.json(pf)
}
