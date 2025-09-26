import { useSearchParams } from 'react-router-dom'

export type WindowOpt = '24h' | '7d'
export type TopOpt = 'all' | 'gainers' | 'losers'

export default function Filters() {
  const [params, setParams] = useSearchParams()
  const window = (params.get('window') as WindowOpt) || '24h'
  const top = (params.get('top') as TopOpt) || 'all'
  const minCap = params.get('mincap') || ''
  const maxCap = params.get('maxcap') || ''

  function update(k: string, v?: string) {
    const p = new URLSearchParams(params)
    if (v && v !== 'all') p.set(k, v)
    else p.delete(k)
    setParams(p, { replace: true })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Time Window Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600 dark:text-fg-muted">Period:</span>
        <div className="flex gap-2">
          {(['24h', '7d'] as WindowOpt[]).map((w) => (
            <button
              key={w}
              onClick={() => update('window', w)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                w === window
                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-bg-soft dark:text-fg-muted dark:hover:bg-bg-hover'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Category Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600 dark:text-fg-muted">Show:</span>
        <div className="flex gap-2">
          {(['all', 'gainers', 'losers'] as TopOpt[]).map((t) => (
            <button
              key={t}
              onClick={() => update('top', t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                t === top
                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-bg-soft dark:text-fg-muted dark:hover:bg-bg-hover'
              }`}
            >
              {t === 'all' ? 'All Coins' : t === 'gainers' ? 'Top Gainers' : 'Top Losers'}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => setParams(new URLSearchParams(), { replace: true })}
        className="ml-auto px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium transition-all duration-200 hover:bg-gray-200 hover:shadow-md dark:bg-bg-soft dark:text-fg-muted dark:hover:bg-bg-hover"
      >
        Reset
      </button>
    </div>
  )
}

