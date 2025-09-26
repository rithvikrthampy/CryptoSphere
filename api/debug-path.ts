export default async function handler(req: any, res: any) {
  res.status(200).json({
    message: 'Debug endpoint - shows how Vercel handles catch-all routes',
    url: req.url,
    query: req.query,
    pathParam: req.query['...path'],
    pathParamAlternative: req.query.path,
    method: req.method,
    timestamp: new Date().toISOString()
  })
}