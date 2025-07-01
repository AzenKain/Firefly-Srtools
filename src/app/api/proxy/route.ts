import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import net from 'net'

function isPrivateHost(hostname: string): boolean {
  if (
    hostname === 'localhost' ||
    hostname.startsWith('127.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
  ) {
    return true
  }

  if (net.isIP(hostname)) {
    return true
  }

  return false
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serverUrl, method, ...payload } = body

    if (!serverUrl) {
      return NextResponse.json({ error: 'Missing serverUrl' }, { status: 400 })
    }
    if (!method) {
      return NextResponse.json({ error: 'Missing method' }, { status: 400 })
    }

    let url = serverUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`
    }

    const parsed = new URL(url)
    if (isPrivateHost(parsed.hostname)) {
      return NextResponse.json(
        { error: `Connection to private/internal address (${parsed.hostname}) is not allowed` },
        { status: 403 }
      )
    }

    let response

    switch (method.toUpperCase()) {
      case 'GET':
        const queryString = new URLSearchParams(payload as any).toString()
        const fullUrl = queryString ? `${url}?${queryString}` : url
        response = await axios.get(fullUrl)
        break
      case 'POST':
        response = await axios.post(url, payload)
        break
      case 'PUT':
        response = await axios.put(url, payload)
        break
      case 'DELETE':
        response = await axios.delete(url, { data: payload })
        break
      default:
        return NextResponse.json({ error: `Unsupported method: ${method}` }, { status: 405 })
    }

    return NextResponse.json(response.data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Proxy failed' }, { status: 500 })
  }
}
