// Vercel serverless proxy to CoinGecko
// Reads COINGECKO_API_KEY from env and attaches the correct header.

export default async function handler(req: any, res: any) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    console.log('Request received:', {
      url: req.url,
      query: req.query,
      method: req.method
    })

    // Get the path from the query parameter (set by Vercel rewrite rule)
    let path = req.query.path || ''

    // If no path provided, try extracting from URL as fallback
    if (!path && req.url) {
      const urlMatch = req.url.match(/^\/api\/coingecko\/(.+?)(\?|$)/)
      if (urlMatch) {
        path = urlMatch[1]
      } else if (req.url === '/api/coingecko' || req.url === '/api/coingecko/') {
        path = 'ping'
      }
    }

    console.log('Path parsing:', {
      originalQuery: req.query,
      url: req.url,
      extractedPath: path
    })

    if (!path) {
      console.log('No path provided after parsing')
      res.status(400).json({
        error: 'Path is required',
        query: req.query,
        url: req.url,
        extractedPath: path,
        debug: 'Check path extraction logic'
      })
      return
    }

    const url = new URL(req.url || '', `http://${req.headers.host}`)
    const search = url.search || ''

    const key = process.env.COINGECKO_API_KEY
    const usePro = process.env.COINGECKO_USE_PRO === 'true'
    let base = usePro ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3'
    const target = `${base}/${path}${search}`

    console.log('API Request:', { path, target, usePro: !!usePro, hasKey: !!key, search })

    const headers: Record<string, string> = { 'accept': 'application/json' }
    if (usePro && key) {
      // Prefer pro header; some keys work with demo header. Try pro first.
      headers['x-cg-pro-api-key'] = key
    }

    console.log('Making upstream request to:', target)

    const requestStart = Date.now()
    let upstream

    try {
      upstream = await fetch(target, {
        method: req.method,
        headers,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(25000), // 25 seconds
        cache: 'no-store',
      })
    } catch (fetchError: any) {
      console.error('Upstream fetch failed:', {
        target,
        error: fetchError.message,
        code: fetchError.code,
        name: fetchError.name
      })

      res.status(502).json({
        error: 'Upstream request failed',
        target,
        detail: fetchError.message,
        code: fetchError.code,
        timestamp: new Date().toISOString()
      })
      return
    }

    const requestTime = Date.now() - requestStart
    console.log('Upstream response received:', {
      status: upstream.status,
      ok: upstream.ok,
      time: requestTime,
      contentType: upstream.headers.get('content-type')
    })

    // If using pro base with a demo key, CoinGecko returns error_code 10011. Retry on the free base.
    let text = await upstream.text()
    try {
      if (usePro && upstream.status >= 400) {
        const json = JSON.parse(text)
        if (json?.error_code === 10011) {
          base = 'https://api.coingecko.com/api/v3'
          const retryUrl = `${base}/${path}${search}`
          upstream = await fetch(retryUrl, {
            method: req.method,
            headers,
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
            cache: 'no-store',
          })
          text = await upstream.text()
        }
      }
    } catch (_) {
      // ignore JSON parse errors; return original response
    }
    res.status(upstream.status)
    res.setHeader('content-type', upstream.headers.get('content-type') || 'application/json')

    // Cache GET responses at the edge to reduce CoinGecko calls
    if (req.method === 'GET') {
      res.setHeader('cache-control', 'public, s-maxage=60, stale-while-revalidate=30')
    } else {
      res.setHeader('cache-control', 'no-store')
    }

    console.log('API Response:', { status: upstream.status, contentType: upstream.headers.get('content-type') })
    res.send(text)
  } catch (err: any) {
    console.error('API Proxy Error:', err)
    res.status(500).json({
      error: 'Proxy error',
      detail: err?.message || String(err),
      timestamp: new Date().toISOString()
    })
  }
}
