import { NextRequest, NextResponse } from 'next/server'
import { loadLightcones } from '@/lib/lighconeLoader'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, locale: string }> }
) {

  const { id, locale } = await params
  const lightcones = await loadLightcones([id], locale)
  const lightcone = lightcones[id]

  if (!lightcone) {
    return NextResponse.json({ error: 'Lightcone not found' }, { status: 404 })
  }

  return NextResponse.json(lightcone)
}
