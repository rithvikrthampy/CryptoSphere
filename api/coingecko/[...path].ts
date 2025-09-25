// Vercel serverless proxy to CoinGecko
// Reads COINGECKO_API_KEY from env and attaches the correct header.

export default async function handler(req: any, res: any) {
  try {
    const pathParts = req.query.path
    const path = Array.isArray(pathParts) ? pathParts.join('/') : String(pathParts || '')
    const url = new URL(req.url, `http://${req.headers.host}`)
    const search = url.search ? url.search : ''

    const key = process.env.COINGECKO_API_KEY
    const usePro = process.env.COINGECKO_USE_PRO === 'true'
    let base = usePro ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3'
    const target = `${base}/${path}${search}`

    const headers: Record<string, string> = { 'accept': 'application/json' }
    if (usePro && key) {
      // Prefer pro header; some keys work with demo header. Try pro first.
      headers['x-cg-pro-api-key'] = key
    }

    let upstream = await fetch(target, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      // Do not cache at edge; rely on client caching.
      cache: 'no-store',
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
    res.send(text)
  } catch (err: any) {
    res.status(500).json({ error: 'Proxy error', detail: err?.message || String(err) })
  }
}
