import { MarketCoin, ChartRange } from '@/lib/types'
import { formatChange, formatCurrency, formatCurrencyCode, formatNumber } from '@/lib/format'
import { Line } from 'react-chartjs-2'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMarketChart } from '@/lib/api'
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

const TIME_RANGES: { value: ChartRange; label: string }[] = [
  { value: '1', label: '24H' },
  { value: '7', label: '7D' },
  { value: '30', label: '1M' },
  { value: '90', label: '3M' },
]

export default function EnhancedFeaturedCoin({ coin, pair = 'USDT' }: { coin: MarketCoin; pair?: string }) {
  const [selectedRange, setSelectedRange] = useState<ChartRange>('7')

  const chartData = useQuery({
    queryKey: ['featured-chart', coin.id, selectedRange],
    queryFn: () => getMarketChart(coin.id, selectedRange),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  })

  const isUp = (coin.price_change_percentage_24h ?? 0) >= 0

  // Use either chart data or sparkline fallback
  const chartPrices = chartData.data?.prices || coin.sparkline_in_7d?.price?.map((price, index) => [Date.now() - (168 - index) * 60 * 60 * 1000, price]) || []

  const stats = [
    {
      label: 'Market Cap',
      value: formatCurrency(coin.market_cap, { compact: true }),
      icon: BarChart3,
      change: coin.price_change_percentage_24h,
    },
    {
      label: '24h Volume',
      value: formatCurrency(coin.total_volume, { compact: true }),
      icon: Activity,
      change: coin.price_change_percentage_24h,
    },
    {
      label: 'Price',
      value: pair.toUpperCase() === 'USDT' ? formatCurrencyCode(coin.current_price, 'USDT') : formatCurrency(coin.current_price),
      icon: DollarSign,
      change: coin.price_change_percentage_24h,
    },
  ]

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: isUp ? '#10b981' : '#ef4444',
        borderWidth: 2,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            const index = context[0].dataIndex
            const timestamp = chartPrices[index]?.[0]
            return timestamp ? new Date(timestamp).toLocaleString() : ''
          },
          label: (context: any) => {
            return `Price: ${formatCurrency(context.parsed.y)}`
          },
        },
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      point: { radius: 0, hoverRadius: 6 },
      line: { tension: 0.3 },
    },
  }

  const chartDataConfig = {
    labels: chartPrices.map(([timestamp]) => new Date(timestamp).toLocaleString()),
    datasets: [
      {
        label: coin.name,
        data: chartPrices.map(([, price]) => price),
        borderColor: isUp ? '#10b981' : '#ef4444',
        backgroundColor: isUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        pointBackgroundColor: isUp ? '#10b981' : '#ef4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-bg-card dark:to-bg-soft/50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coin Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={coin.image} alt={coin.name} className="w-16 h-16 rounded-full shadow-lg" />
              <div className="absolute -inset-1 rounded-full bg-accent/20 opacity-50 blur-sm" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-fg">
                {coin.symbol.toUpperCase()}/{pair.toUpperCase()}
              </h2>
              <p className="text-gray-500 dark:text-fg-muted">{coin.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs font-medium">
                  Rank #{coin.market_cap_rank}
                </span>
                <span className="text-xs text-gray-500 dark:text-fg-muted">
                  Featured
                </span>
              </div>
            </div>
          </div>

          {/* Price and Change */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900 dark:text-fg">
              {pair.toUpperCase() === 'USDT' ? formatCurrencyCode(coin.current_price, 'USDT') : formatCurrency(coin.current_price)}
            </div>
            <div className={`flex items-center gap-2 text-lg font-medium ${isUp ? 'text-success' : 'text-danger'}`}>
              {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              <span>{formatChange(coin.price_change_percentage_24h)} (24h)</span>
            </div>
          </div>

          {/* Additional Changes */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-fg-muted">1h</span>
              <span className={coin.price_change_percentage_1h_in_currency && coin.price_change_percentage_1h_in_currency >= 0 ? 'text-success font-medium' : 'text-danger font-medium'}>
                {formatChange(coin.price_change_percentage_1h_in_currency)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-fg-muted">7d</span>
              <span className={coin.price_change_percentage_7d_in_currency && coin.price_change_percentage_7d_in_currency >= 0 ? 'text-success font-medium' : 'text-danger font-medium'}>
                {formatChange(coin.price_change_percentage_7d_in_currency)}
              </span>
            </div>
          </div>

          {/* View More Button */}
          <div className="mt-4">
            <a
              href={`/coin/${coin.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm transition-all duration-200 hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/30"
            >
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-fg">Market Data</h3>
          <div className="space-y-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-bg-soft/50">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-accent" />
                  <span className="text-sm text-gray-600 dark:text-fg-muted">{label}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-fg">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-fg">Price Chart</h3>
            <div className="flex gap-1 rounded-lg border border-border-light bg-white/80 p-1 dark:bg-bg-soft dark:border-border">
              {TIME_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedRange(range.value)}
                  disabled={chartData.isLoading || chartData.isFetching}
                  className={`px-2 py-1 text-xs font-medium rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedRange === range.value
                      ? 'bg-accent text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-fg-muted dark:hover:text-fg'
                  }`}
                >
                  {chartData.isFetching && selectedRange === range.value ? (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 border border-white/60 border-t-white rounded-full animate-spin" />
                      <span>{range.label}</span>
                    </div>
                  ) : (
                    range.label
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-32 relative">
            {chartData.isLoading || chartData.isFetching ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex items-center gap-2 text-accent">
                  <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Loading chart...</span>
                </div>
              </div>
            ) : chartData.isError ? (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-fg-muted">
                <span className="text-sm">Chart unavailable</span>
              </div>
            ) : (
              <Line data={chartDataConfig} options={chartOptions} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}