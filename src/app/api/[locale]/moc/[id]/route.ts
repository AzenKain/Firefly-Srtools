import { NextRequest, NextResponse } from 'next/server'
import { loadMOC } from '@/lib/loader'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, locale: string }> }
) {

  const { id, locale } = await params
  const mocData = await loadMOC([id], locale)
  const moc = mocData[id]

  if (!moc) {
    return NextResponse.json({ error: 'MOC info not found' }, { status: 404 })
  }

  return NextResponse.json(moc)
}
