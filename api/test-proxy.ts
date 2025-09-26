export default async function handler(req: any, res: any) {
  try {
    // Test the proxy logic step by step
    console.log('Testing proxy with URL:', req.url)

    // Simulate what our main coingecko.ts function does
    const testPath = req.query.testPath || 'coins/markets'
    const testQuery = req.query.testQuery || 'vs_currency=usd&order=market_cap_desc&per_page=3&page=1'

    const key = process.env.COINGECKO_API_KEY
    const usePro = process.env.COINGECKO_USE_PRO === 'true'
    const baseUrl = usePro ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3'
    const fullUrl = `${baseUrl}/${testPath}?${testQuery}`

    const headers: Record<string, string> = { 'accept': 'application/json' }
    if (usePro && key) {
      headers['x-cg-pro-api-key'] = key
    }

    console.log('Making request to:', fullUrl)
    console.log('With headers:', headers)

    const startTime = Date.now()
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
      // Add timeout
      signal: AbortSignal.timeout(25000) // 25 seconds
    })
    const requestTime = Date.now() - startTime

    console.log('Response received:', {
      status: response.status,
      ok: response.ok,
      time: requestTime
    })

    if (response.ok) {
      const data = await response.text()

      // Return the same headers as our proxy would
      res.setHeader('content-type', response.headers.get('content-type') || 'application/json')
      res.setHeader('cache-control', 'public, s-maxage=60, stale-while-revalidate=30')

      res.status(200).json({
        success: true,
        proxyTest: {
          url: fullUrl,
          status: response.status,
          time: requestTime,
          dataLength: data.length,
          sample: data.substring(0, 500) + (data.length > 500 ? '...' : ''),
          headers: Object.fromEntries(response.headers.entries())
        }
      })
    } else {
      const errorText = await response.text()
      res.status(response.status).json({
        success: false,
        proxyTest: {
          url: fullUrl,
          status: response.status,
          statusText: response.statusText,
          time: requestTime,
          error: errorText,
          headers: Object.fromEntries(response.headers.entries())
        }
      })
    }

  } catch (error: any) {
    console.error('Proxy test error:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
  }
}