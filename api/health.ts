export default async function handler(req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    hasApiKey: !!process.env.COINGECKO_API_KEY,
    request: {
      url: req.url,
      method: req.method,
      query: req.query
    }
  })
}