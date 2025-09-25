import { useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') ?? ''
  const [value, setValue] = useState(initial)

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(params)
      if (value) next.set('q', value)
      else next.delete('q')
      setParams(next, { replace: true })
    }, 300)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search coins..."
        className="w-full rounded-lg border border-white/10 bg-white/60 px-10 py-2 text-sm outline-none ring-accent/30 transition focus:ring-2 dark:bg-bg.soft"
        aria-label="Search coins"
      />
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" size={16} />
    </div>
  )
}

