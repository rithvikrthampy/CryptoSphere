import { ChartRange } from '@/lib/types'

type TimeFiltersProps = {
  selectedRange: ChartRange
  onRangeChange: (range: ChartRange) => void
  isLoading?: boolean
}

const TIME_RANGES: { value: ChartRange; label: string; description: string }[] = [
  { value: '1', label: '24H', description: 'Last 24 hours' },
  { value: '7', label: '7D', description: 'Last 7 days' },
  { value: '30', label: '1M', description: 'Last 30 days' },
  { value: '90', label: '3M', description: 'Last 3 months' },
  { value: '365', label: '1Y', description: 'Last 1 year' },
  { value: 'max', label: 'Max', description: 'All available data' },
]

export default function TimeFilters({
  selectedRange,
  onRangeChange,
  isLoading = false
}: TimeFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Time Range Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {TIME_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => !isLoading && onRangeChange(range.value)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedRange === range.value
                ? 'bg-accent text-white shadow-lg shadow-accent/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-bg-soft dark:text-fg-muted dark:hover:bg-bg-hover'
            }`}
            title={range.description}
          >
            {isLoading && selectedRange === range.value ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                <span>{range.label}</span>
              </div>
            ) : (
              range.label
            )}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-accent">
          <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <span>Loading chart data...</span>
        </div>
      )}
    </div>
  )
}