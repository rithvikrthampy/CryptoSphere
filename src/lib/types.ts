export type MarketCoin = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_1h_in_currency?: number
  price_change_percentage_24h_in_currency?: number
  price_change_percentage_24h?: number
  price_change_percentage_7d_in_currency?: number
  sparkline_in_7d?: { price: number[] }
}

export type CoinDetail = {
  id: string
  symbol: string
  name: string
  image: { large: string; small: string; thumb: string }
  market_data: {
    current_price: { usd: number }
    market_cap: { usd: number }
    market_cap_rank?: number
    fully_diluted_valuation?: { usd?: number }
    total_volume: { usd: number }
    circulating_supply?: number
    total_supply?: number
    max_supply?: number
    price_change_percentage_24h?: number
    price_change_percentage_7d?: number
    price_change_percentage_30d?: number
    price_change_percentage_1y?: number
  }
}

export type MarketChart = {
  prices: [number, number][]
  market_caps?: [number, number][]
  total_volumes?: [number, number][]
}

export type SearchResult = {
  coins: Array<{
    id: string
    name: string
    symbol: string
    market_cap_rank: number
    thumb: string
    large: string
  }>
}

export type PaginationOptions = {
  page: number
  perPage: number
}

export type ChartRange = '1' | '7' | '30' | '90' | '365' | 'max'
