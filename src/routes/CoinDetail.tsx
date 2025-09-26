import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCoinDetail, getMarketChart } from '@/lib/api'
import { useState } from 'react'
import DualChart from '@/components/DualChart'
import CoinStats from '@/components/CoinStats'
import TimeFilters from '@/components/TimeFilters'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react'
import { ChartRange } from '@/lib/types'

export default function CoinDetail() {
  const { id = '' } = useParams()
  const [range, setRange] = useState<ChartRange>('7')
  const [staticCoinData] = useState(() => null) // Static data that doesn't change on hover

  const detail = useQuery({
    queryKey: ['coin', id],
    queryFn: () => getCoinDetail(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  const chartData = useQuery({
    queryKey: ['chart', id, range],
    queryFn: () => getMarketChart(id, range),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  const getErrorMessage = () => {
    if (detail.error && 'status' in detail.error) {
      if (detail.error.status === 429) {
        return 'Rate limit reached. Please wait a moment before refreshing.'
      } else if (detail.error.status === 404) {
        return 'Cryptocurrency not found. It may have been delisted or the ID is incorrect.'
      }
    }
    return detail.error?.message || 'Failed to load cryptocurrency data.'
  }

  if (detail.isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full loading-shimmer" />
          <div className="space-y-2">
            <div className="w-48 h-8 loading-shimmer rounded" />
            <div className="w-24 h-4 loading-shimmer rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-12 loading-shimmer rounded-xl" />
            <div className="h-96 loading-shimmer rounded-2xl" />
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-48 loading-shimmer rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (detail.isError || !detail.data) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="error-state rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-60" />
          <h1 className="text-xl font-semibold mb-2">Unable to load cryptocurrency</h1>
          <p className="mb-6 opacity-90">{getErrorMessage()}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => detail.refetch()}
              className="btn-primary"
              disabled={detail.isFetching}
            >
              {detail.isFetching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Retrying...
                </>
              ) : (
                'Try Again'
              )}
            </button>
            <Link to="/" className="btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Markets
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const coin = detail.data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 rounded-lg border border-border-light bg-white/80 hover:bg-white transition-all duration-200 dark:bg-bg-soft dark:border-border dark:hover:bg-bg-hover"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-fg-muted" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={coin.image.large}
                alt={coin.name}
                className="w-12 h-12 rounded-full shadow-lg"
              />
              <div className="absolute -inset-1 rounded-full bg-accent/20 opacity-50 blur-sm" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-fg">
                {coin.name}
              </h1>
              <p className="text-gray-500 dark:text-fg-muted uppercase font-medium">
                {coin.symbol}
              </p>
            </div>
          </div>
        </div>

        {chartData.isFetching && (
          <div className="flex items-center gap-2 text-sm text-accent">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Updating chart...</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Sidebar - Now on Left */}
        <div className="space-y-6 order-2 lg:order-1">
          <CoinStats coin={coin} hoverData={staticCoinData} />
        </div>

        {/* Chart Section - Now on Right */}
        <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
          <TimeFilters
            selectedRange={range}
            onRangeChange={setRange}
            isLoading={chartData.isLoading || chartData.isFetching}
          />

          <div className="card p-6">
            {chartData.isLoading ? (
              <div className="h-96 loading-shimmer rounded-xl" />
            ) : chartData.isError ? (
              <div className="error-state rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-60" />
                <h3 className="font-semibold mb-2">Chart data unavailable</h3>
                <p className="text-sm mb-4">
                  {chartData.error && 'status' in chartData.error && chartData.error.status === 429
                    ? 'Rate limit reached. Chart will update automatically.'
                    : 'Unable to load chart data. Please try again.'}
                </p>
                {chartData.error && !('status' in chartData.error && chartData.error.status === 429) && (
                  <button
                    onClick={() => chartData.refetch()}
                    className="btn-secondary text-sm"
                    disabled={chartData.isFetching}
                  >
                    {chartData.isFetching ? 'Loading...' : 'Retry'}
                  </button>
                )}
              </div>
            ) : (
              chartData.data && (
                <DualChart
                  priceData={chartData.data.prices}
                  marketCapData={chartData.data.market_caps || chartData.data.prices.map(([timestamp], i) => [timestamp, coin.market_data.market_cap.usd])}
                  range={range}
                />
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

