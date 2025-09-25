import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartOptions,
  TooltipItem,
} from 'chart.js'
import { formatCurrency, formatNumber, formatDate } from '@/lib/format'
import { useState } from 'react'
import { ChartRange } from '@/lib/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

type DualChartProps = {
  priceData: [number, number][]
  marketCapData: [number, number][]
  range: ChartRange
  onHover?: (data: { date: string; price: number; marketCap: number; volume?: number } | null) => void
}

export default function DualChart({ priceData, marketCapData, range, onHover }: DualChartProps) {
  const [activeChart, setActiveChart] = useState<'price' | 'marketCap'>('price')

  const labels = priceData.map(([timestamp]) => new Date(timestamp).toLocaleString())
  const prices = priceData.map(([, price]) => price)
  const marketCaps = marketCapData.map(([, cap]) => cap)

  const isPriceUp = (prices[prices.length - 1] ?? 0) >= (prices[0] ?? 0)
  const isMarketCapUp = (marketCaps[marketCaps.length - 1] ?? 0) >= (marketCaps[0] ?? 0)

  const baseOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#4f9cff',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: false,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex
            const timestamp = priceData[index]?.[0]
            return timestamp ? formatDate(timestamp) : ''
          },
          label: (context: TooltipItem<'line'>) => {
            const index = context.dataIndex
            const price = prices[index]
            const marketCap = marketCaps[index]

            if (onHover) {
              const timestamp = priceData[index]?.[0]
              onHover({
                date: timestamp ? formatDate(timestamp) : '',
                price: price || 0,
                marketCap: marketCap || 0,
              })
            }

            if (activeChart === 'price') {
              return `Price: ${formatCurrency(price || 0)}`
            } else {
              return `Market Cap: ${formatCurrency(marketCap || 0, { compact: true })}`
            }
          },
        },
        external: (context) => {
          if (!context.tooltip.opacity) {
            onHover?.(null)
          }
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.15)',
          borderColor: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          color: '#6b7280',
          maxTicksLimit: 8,
          font: { size: 12 },
          callback: function(value, index) {
            const timestamp = priceData[index as number]?.[0]
            if (!timestamp) return ''

            const date = new Date(timestamp)
            if (range === '1') {
              return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            } else if (range === '7' || range === '30') {
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            } else {
              return date.toLocaleDateString('en-US', { year: '2-digit', month: 'short' })
            }
          },
        },
      },
      y: {
        type: 'linear',
        display: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.15)',
          borderColor: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          color: '#6b7280',
          font: { size: 12 },
          callback: function(value) {
            if (activeChart === 'price') {
              return formatCurrency(value as number, { compact: true })
            } else {
              return formatCurrency(value as number, { compact: true })
            }
          },
        },
      },
    },
    elements: {
      point: { radius: 0, hoverRadius: 6 },
      line: { tension: 0.1 },
    },
    onHover: (event, elements) => {
      const canvas = event.native?.target as HTMLCanvasElement
      if (canvas) {
        canvas.style.cursor = elements.length > 0 ? 'crosshair' : 'default'
      }
    },
  }

  const priceChartData = {
    labels,
    datasets: [
      {
        label: 'Price',
        data: prices,
        borderColor: isPriceUp ? '#10b981' : '#ef4444',
        backgroundColor: isPriceUp
          ? 'rgba(16, 185, 129, 0.1)'
          : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        pointBackgroundColor: isPriceUp ? '#10b981' : '#ef4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 3,
      },
    ],
  }

  const marketCapChartData = {
    labels,
    datasets: [
      {
        label: 'Market Cap',
        data: marketCaps,
        borderColor: isMarketCapUp ? '#8b5cf6' : '#ec4899',
        backgroundColor: isMarketCapUp
          ? 'rgba(139, 92, 246, 0.1)'
          : 'rgba(236, 72, 153, 0.1)',
        borderWidth: 3,
        fill: true,
        pointBackgroundColor: isMarketCapUp ? '#8b5cf6' : '#ec4899',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 3,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex rounded-lg border border-border-light bg-white/60 p-1 dark:bg-bg-soft dark:border-border">
          <button
            onClick={() => setActiveChart('price')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeChart === 'price'
                ? 'bg-accent text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 dark:text-fg-muted dark:hover:text-fg'
            }`}
          >
            Price
          </button>
          <button
            onClick={() => setActiveChart('marketCap')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeChart === 'marketCap'
                ? 'bg-purple text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 dark:text-fg-muted dark:hover:text-fg'
            }`}
          >
            Market Cap
          </button>
        </div>
      </div>

      <div className="h-96 relative">
        {activeChart === 'price' ? (
          <Line data={priceChartData} options={baseOptions} />
        ) : (
          <Line data={marketCapChartData} options={baseOptions} />
        )}
      </div>
    </div>
  )
}