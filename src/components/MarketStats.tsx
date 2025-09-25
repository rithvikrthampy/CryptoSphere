import { useQuery } from '@tanstack/react-query'
import { getGlobalStats, getTrending, getTopMarketCoins } from '@/lib/api'
import { formatCurrency, formatChange, formatNumber } from '@/lib/format'
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'

export default function MarketStats() {
  const globalStats = useQuery({
    queryKey: ['global-stats'],
    queryFn: getGlobalStats,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })

  const trending = useQuery({
    queryKey: ['trending'],
    queryFn: getTrending,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })

  const allCoins = useQuery({
    queryKey: ['top-gainers-losers'],
    queryFn: () => getTopMarketCoins({ page: 1, perPage: 100 }),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })

  const { topGainers, topLosers } = useMemo(() => {
    if (!allCoins.data) return { topGainers: [], topLosers: [] }

    const sorted = [...allCoins.data].sort((a, b) =>
      (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0)
    )

    return {
      topGainers: sorted.slice(0, 3),
      topLosers: sorted.reverse().slice(0, 3)
    }
  }, [allCoins.data])

  if (globalStats.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 loading-shimmer rounded-xl" />
        <div className="h-48 loading-shimmer rounded-xl" />
        <div className="h-48 loading-shimmer rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={20} className="text-accent" />
          <h3 className="font-semibold text-gray-900 dark:text-fg">Market Overview</h3>
        </div>

        <div className="space-y-3">
          {globalStats.data && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-fg-muted">Total Market Cap</span>
                <span className="font-medium text-gray-900 dark:text-fg">
                  {formatCurrency(globalStats.data.data.total_market_cap.usd, { compact: true })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-fg-muted">24h Volume</span>
                <span className="font-medium text-gray-900 dark:text-fg">
                  {formatCurrency(globalStats.data.data.total_volume.usd, { compact: true })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-fg-muted">Market Cap Change</span>
                <span className={`flex items-center gap-1 font-medium ${
                  globalStats.data.data.market_cap_change_percentage_24h_usd >= 0
                    ? 'text-success'
                    : 'text-danger'
                }`}>
                  {globalStats.data.data.market_cap_change_percentage_24h_usd >= 0
                    ? <TrendingUp size={14} />
                    : <TrendingDown size={14} />
                  }
                  {formatChange(globalStats.data.data.market_cap_change_percentage_24h_usd)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-fg-muted">Active Cryptocurrencies</span>
                <span className="font-medium text-gray-900 dark:text-fg">
                  {formatNumber(globalStats.data.data.active_cryptocurrencies)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Trending */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Flame size={20} className="text-accent" />
          <h3 className="font-semibold text-gray-900 dark:text-fg">Trending</h3>
        </div>

        <div className="space-y-2">
          {trending.isLoading ? (
            Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-12 loading-shimmer rounded-lg" />
            ))
          ) : trending.data?.coins ? (
            trending.data.coins.slice(0, 3).map(({ item }) => (
              <Link
                key={item.id}
                to={`/coin/${item.id}`}
                className="flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-bg-hover group"
              >
                <img src={item.thumb} alt="" className="w-6 h-6 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-fg truncate group-hover:text-accent transition-colors">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-fg-muted">
                      #{item.market_cap_rank}
                    </span>
                  </div>
                </div>
                <TrendingUp size={14} className="text-accent" />
              </Link>
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-fg-muted text-center py-4">
              Unable to load trending data
            </div>
          )}
        </div>
      </div>

      {/* Top Gainers */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-success" />
          <h3 className="font-semibold text-gray-900 dark:text-fg">Top Gainers</h3>
        </div>

        <div className="space-y-2">
          {allCoins.isLoading ? (
            Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-12 loading-shimmer rounded-lg" />
            ))
          ) : topGainers.length > 0 ? (
            topGainers.map((coin) => (
              <Link
                key={coin.id}
                to={`/coin/${coin.id}`}
                className="flex items-center justify-between p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-bg-hover group"
              >
                <div className="flex items-center gap-2">
                  <img src={coin.image} alt="" className="w-6 h-6 rounded-full" />
                  <div>
                    <div className="font-medium text-sm text-gray-900 dark:text-fg group-hover:text-accent transition-colors">
                      {coin.symbol.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-fg-muted">
                      {formatCurrency(coin.current_price)}
                    </div>
                  </div>
                </div>
                <span className="text-success font-medium text-sm">
                  {formatChange(coin.price_change_percentage_24h)}
                </span>
              </Link>
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-fg-muted text-center py-4">
              Unable to load gainers data
            </div>
          )}
        </div>
      </div>

      {/* Top Losers */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingDown size={20} className="text-danger" />
          <h3 className="font-semibold text-gray-900 dark:text-fg">Top Losers</h3>
        </div>

        <div className="space-y-2">
          {allCoins.isLoading ? (
            Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-12 loading-shimmer rounded-lg" />
            ))
          ) : topLosers.length > 0 ? (
            topLosers.map((coin) => (
              <Link
                key={coin.id}
                to={`/coin/${coin.id}`}
                className="flex items-center justify-between p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-bg-hover group"
              >
                <div className="flex items-center gap-2">
                  <img src={coin.image} alt="" className="w-6 h-6 rounded-full" />
                  <div>
                    <div className="font-medium text-sm text-gray-900 dark:text-fg group-hover:text-accent transition-colors">
                      {coin.symbol.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-fg-muted">
                      {formatCurrency(coin.current_price)}
                    </div>
                  </div>
                </div>
                <span className="text-danger font-medium text-sm">
                  {formatChange(coin.price_change_percentage_24h)}
                </span>
              </Link>
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-fg-muted text-center py-4">
              Unable to load losers data
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
