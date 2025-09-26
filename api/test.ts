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
    const testData = {
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      environment: {
        hasApiKey: !!process.env.COINGECKO_API_KEY,
        usePro: process.env.COINGECKO_USE_PRO === 'true',
        nodeVersion: process.version
      }
    }

    res.status(200).json(testData)
  } catch (err: any) {
    res.status(500).json({
      error: 'Test API error',
      detail: err?.message || String(err)
    })
  }
}