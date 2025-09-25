import { CoinDetail } from '@/lib/types'
import { formatCurrency, formatNumber } from '@/lib/format'
import { TrendingUp, TrendingDown, Info } from 'lucide-react'

type CoinStatsProps = {
  coin: CoinDetail
  hoverData?: {
    date: string
    price: number
    marketCap: number
    volume?: number
  } | null
}

export default function CoinStats({ coin, hoverData }: CoinStatsProps) {
  const stats = [
    {
      label: 'Market Cap',
      value: hoverData?.marketCap ? formatCurrency(hoverData.marketCap, { compact: true }) : formatCurrency(coin.market_data.market_cap.usd, { compact: true }),
      info: 'The total market value of all coins in circulation',
    },
    {
      label: 'Fully Diluted Valuation',
      value: coin.market_data.fully_diluted_valuation?.usd
        ? formatCurrency(coin.market_data.fully_diluted_valuation.usd, { compact: true })
        : '—',
      info: 'Market cap if max supply was in circulation',
    },
    {
      label: '24 Hour Trading Vol',
      value: hoverData?.volume ? formatCurrency(hoverData.volume, { compact: true }) : formatCurrency(coin.market_data.total_volume.usd, { compact: true }),
      info: 'Total trading volume in the last 24 hours',
    },
    {
      label: 'Circulating Supply',
      value: coin.market_data.circulating_supply
        ? formatNumber(coin.market_data.circulating_supply, false)
        : '—',
      info: 'The number of coins currently in circulation',
    },
    {
      label: 'Total Supply',
      value: coin.market_data.total_supply
        ? formatNumber(coin.market_data.total_supply, false)
        : '—',
      info: 'Total number of coins that exist',
    },
    {
      label: 'Max Supply',
      value: coin.market_data.max_supply
        ? formatNumber(coin.market_data.max_supply, false)
        : '∞',
      info: 'Maximum number of coins that will ever exist',
    },
  ]

  const priceChanges = [
    {
      label: '24h',
      value: coin.market_data.price_change_percentage_24h,
      color: (coin.market_data.price_change_percentage_24h || 0) >= 0 ? 'text-success' : 'text-danger',
    },
    {
      label: '7d',
      value: coin.market_data.price_change_percentage_7d,
      color: (coin.market_data.price_change_percentage_7d || 0) >= 0 ? 'text-success' : 'text-danger',
    },
    {
      label: '30d',
      value: coin.market_data.price_change_percentage_30d,
      color: (coin.market_data.price_change_percentage_30d || 0) >= 0 ? 'text-success' : 'text-danger',
    },
    {
      label: '1y',
      value: coin.market_data.price_change_percentage_1y,
      color: (coin.market_data.price_change_percentage_1y || 0) >= 0 ? 'text-success' : 'text-danger',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Current Price */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <img src={coin.image.small} alt={coin.name} className="w-8 h-8 rounded-full" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-fg">{coin.name}</h2>
            <p className="text-sm text-gray-500 dark:text-fg-muted uppercase">{coin.symbol}</p>
          </div>
          {coin.market_data.market_cap_rank && (
            <div className="ml-auto bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-medium">
              Rank #{coin.market_data.market_cap_rank}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900 dark:text-fg">
            {hoverData?.price ? formatCurrency(hoverData.price) : formatCurrency(coin.market_data.current_price.usd)}
          </div>
          {hoverData?.date && (
            <div className="text-sm text-gray-500 dark:text-fg-muted">
              {hoverData.date}
            </div>
          )}
        </div>

        {/* Price Changes */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {priceChanges.map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-bg-soft/50">
              <span className="text-sm text-gray-600 dark:text-fg-muted">{label}</span>
              <div className={`flex items-center gap-1 text-sm font-medium ${color}`}>
                {(value || 0) >= 0 ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                <span>
                  {value != null ? `${value >= 0 ? '+' : ''}${value.toFixed(2)}%` : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Statistics */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-fg mb-4">Market Statistics</h3>
        <div className="space-y-4">
          {stats.map(({ label, value, info }) => (
            <div key={label} className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-fg-muted">{label}</span>
                <div className="relative">
                  <Info size={12} className="text-gray-400 dark:text-fg-muted cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-bg-card text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {info}
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-fg">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-fg mb-4">About {coin.name}</h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-fg-muted">
          <p>
            Track real-time price movements, market cap changes, and trading volume for {coin.name} ({coin.symbol.toUpperCase()}).
          </p>
          <p>
            Data is sourced from CoinGecko and updated regularly to provide accurate market information.
          </p>
        </div>
      </div>
    </div>
  )
}