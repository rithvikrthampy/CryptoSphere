export default async function handler(req: any, res: any) {
  try {
    const key = process.env.COINGECKO_API_KEY
    const usePro = process.env.COINGECKO_USE_PRO === 'true'

    const baseUrl = usePro ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3'
    const testUrl = `${baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1`

    const headers: Record<string, string> = { 'accept': 'application/json' }
    if (usePro && key) {
      headers['x-cg-pro-api-key'] = key
    }

    console.log('Testing direct CoinGecko call:', { testUrl, hasKey: !!key, usePro })

    const response = await fetch(testUrl, { headers })
    const data = await response.text()

    res.status(200).json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      hasKey: !!key,
      usePro,
      testUrl,
      dataLength: data.length,
      dataSample: data.substring(0, 500) + (data.length > 500 ? '...' : ''),
      headers: Object.fromEntries(response.headers.entries())
    })
  } catch (error: any) {
    console.error('Test CoinGecko error:', error)
    res.status(500).json({
      error: error.message,
      stack: error.stack
    })
  }
}