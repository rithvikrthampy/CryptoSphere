export default async function handler(req: any, res: any) {
  const results: any = {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    tests: {}
  }

  try {
    // Test 1: Environment variables
    results.tests.environment = {
      hasApiKey: !!process.env.COINGECKO_API_KEY,
      usePro: process.env.COINGECKO_USE_PRO === 'true',
      nodeVersion: process.version,
      platform: process.platform
    }

    // Test 2: Basic network connectivity
    try {
      const startTime = Date.now()
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        headers: { 'User-Agent': 'Vercel-Test' }
      })
      const networkTime = Date.now() - startTime

      results.tests.network = {
        success: response.ok,
        status: response.status,
        time: networkTime,
        headers: Object.fromEntries(response.headers.entries())
      }
    } catch (error: any) {
      results.tests.network = {
        success: false,
        error: error.message,
        code: error.code
      }
    }

    // Test 3: CoinGecko connectivity
    try {
      const key = process.env.COINGECKO_API_KEY
      const usePro = process.env.COINGECKO_USE_PRO === 'true'
      const baseUrl = usePro ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3'

      const headers: Record<string, string> = {
        'accept': 'application/json',
        'User-Agent': 'crypto-sphere-vercel'
      }
      if (usePro && key) {
        headers['x-cg-pro-api-key'] = key
      }

      // Test ping endpoint
      const startTime = Date.now()
      const pingResponse = await fetch(`${baseUrl}/ping`, { headers })
      const pingTime = Date.now() - startTime
      const pingText = await pingResponse.text()

      results.tests.coingecko_ping = {
        success: pingResponse.ok,
        status: pingResponse.status,
        time: pingTime,
        response: pingText.substring(0, 200),
        headers: Object.fromEntries(pingResponse.headers.entries())
      }

      // Test actual API call
      const apiStartTime = Date.now()
      const apiResponse = await fetch(`${baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3&page=1`, {
        headers
      })
      const apiTime = Date.now() - apiStartTime
      const apiText = await apiResponse.text()

      results.tests.coingecko_api = {
        success: apiResponse.ok,
        status: apiResponse.status,
        time: apiTime,
        dataLength: apiText.length,
        sample: apiText.substring(0, 300) + (apiText.length > 300 ? '...' : ''),
        headers: Object.fromEntries(apiResponse.headers.entries())
      }

    } catch (error: any) {
      results.tests.coingecko = {
        success: false,
        error: error.message,
        code: error.code,
        stack: error.stack
      }
    }

    // Test 4: Timeout simulation
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const timeoutStartTime = Date.now()
      const timeoutResponse = await fetch('https://httpbin.org/delay/2', {
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      const timeoutTime = Date.now() - timeoutStartTime

      results.tests.timeout = {
        success: timeoutResponse.ok,
        time: timeoutTime,
        status: timeoutResponse.status
      }
    } catch (error: any) {
      results.tests.timeout = {
        success: false,
        error: error.message,
        code: error.code
      }
    }

    // Test 5: DNS resolution
    try {
      const dnsStartTime = Date.now()
      const dnsResponse = await fetch('https://api.coingecko.com/api/v3/ping')
      const dnsTime = Date.now() - dnsStartTime

      results.tests.dns = {
        success: dnsResponse.ok,
        time: dnsTime,
        ip: dnsResponse.headers.get('cf-ray') || 'unknown'
      }
    } catch (error: any) {
      results.tests.dns = {
        success: false,
        error: error.message
      }
    }

    res.status(200).json(results)
  } catch (error: any) {
    res.status(500).json({
      error: 'Diagnostic failed',
      message: error.message,
      stack: error.stack,
      results
    })
  }
}