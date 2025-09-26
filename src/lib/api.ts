import type { MarketChart, MarketCoin, CoinDetail, SearchResult, PaginationOptions, ChartRange } from './types'

const API_BASE = '/api/coingecko'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'accept': 'application/json' },
      ...init,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      let errorMessage = `API Error ${res.status}`

      // Check if we got HTML instead of JSON (deployment issue)
      if (text.includes('<!doctype') || text.includes('<!DOCTYPE')) {
        errorMessage = 'API service temporarily unavailable. Please try again later.'
        const error = Object.assign(
          new Error(errorMessage),
          { status: 503, body: text, isDeploymentIssue: true }
        )
        throw error
      }

      if (res.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.'
      } else if (res.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (res.status === 404) {
        errorMessage = 'Resource not found.'
      }

      const error = Object.assign(
        new Error(errorMessage),
        { status: res.status, body: text }
      )
      throw error
    }

    const json = await res.json()
    return json as T
  } catch (error: any) {
    // Handle network errors or JSON parsing errors
    if (error.name === 'SyntaxError' && error.message.includes('Unexpected token')) {
      const deploymentError = Object.assign(
        new Error('API service is currently unavailable. Please try again later.'),
        { status: 503, isDeploymentIssue: true }
      )
      throw deploymentError
    }
    throw error
  }
}

export function getTopMarketCoins(pagination?: PaginationOptions) {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: pagination ? pagination.perPage.toString() : '100',
    page: pagination ? pagination.page.toString() : '1',
    price_change_percentage: '1h,24h,7d,30d,1y',
    sparkline: 'true',
  })
  return request<MarketCoin[]>(`/coins/markets?${params.toString()}`)
}

export function getCoinDetail(id: string) {
  return request<CoinDetail>(`/coins/${id}`)
}

export function getMarketChart(id: string, days: ChartRange, daily: boolean = false) {
  const params = new URLSearchParams({ vs_currency: 'usd', days: days })
  if (daily && days !== '1') params.set('interval', 'daily')
  return request<MarketChart>(`/coins/${id}/market_chart?${params.toString()}`)
}

export function getSingleMarketCoin(id: string, vsCurrency: string = 'usdt') {
  const params = new URLSearchParams({
    vs_currency: vsCurrency,
    ids: id,
    price_change_percentage: '1h,24h,7d',
    sparkline: 'true',
  })
  return request<MarketCoin[]>(`/coins/markets?${params.toString()}`)
}

export function searchCoins(query: string) {
  const params = new URLSearchParams({ query })
  return request<SearchResult>(`/search?${params.toString()}`)
}

// Add function to get market cap chart data
export function getMarketCapChart(id: string, days: ChartRange) {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    days: days,
    interval: days === '1' ? 'hourly' : 'daily'
  })
  return request<MarketChart>(`/coins/${id}/market_chart?${params.toString()}`)
}

// Get global market stats
export function getGlobalStats() {
  return request<{
    data: {
      active_cryptocurrencies: number
      market_cap_percentage: Record<string, number>
      total_market_cap: Record<string, number>
      total_volume: Record<string, number>
      market_cap_change_percentage_24h_usd: number
    }
  }>('/global')
}

// Get trending coins
export function getTrending() {
  return request<{
    coins: Array<{
      item: {
        id: string
        name: string
        symbol: string
        market_cap_rank: number
        thumb: string
        price_btc: number
      }
    }>
    categories: Array<{
      id: string
      name: string
      market_cap_1h_change: number
    }>
  }>('/search/trending')
}
