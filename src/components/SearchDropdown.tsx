import { useState, useRef, useEffect } from 'react'
import { Search, TrendingUp, Filter, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { searchCoins } from '@/lib/api'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

type SearchFilter = 'all' | 'top100' | 'defi' | 'gaming' | 'ai'

const SEARCH_FILTERS: { value: SearchFilter; label: string; description: string }[] = [
  { value: 'all', label: 'All', description: 'Search all cryptocurrencies' },
  { value: 'top100', label: 'Top 100', description: 'Search top 100 by market cap' },
  { value: 'defi', label: 'DeFi', description: 'Decentralized Finance tokens' },
  { value: 'gaming', label: 'Gaming', description: 'Gaming and NFT tokens' },
  { value: 'ai', label: 'AI', description: 'Artificial Intelligence tokens' },
]

export default function SearchDropdown() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<SearchFilter>('all')
  const [showFilters, setShowFilters] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', query, selectedFilter],
    queryFn: () => searchCoins(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
  })

  // Filter results based on selected filter
  const filteredResults = searchResults?.coins.filter(coin => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'top100') return coin.market_cap_rank && coin.market_cap_rank <= 100
    if (selectedFilter === 'defi') return coin.name.toLowerCase().includes('defi') || coin.symbol.toLowerCase().includes('uni') || coin.symbol.toLowerCase().includes('sushi')
    if (selectedFilter === 'gaming') return coin.name.toLowerCase().includes('game') || coin.name.toLowerCase().includes('nft')
    if (selectedFilter === 'ai') return coin.name.toLowerCase().includes('ai') || coin.name.toLowerCase().includes('artificial')
    return true
  }) || []

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowFilters(false)
        setQuery('')
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setShowFilters(false)
        setQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(value.length >= 2)
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
    setShowFilters(false)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <div className="flex gap-2 sm:gap-3">
          <div className="flex-1 relative group min-w-0">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => query.length >= 2 && setIsOpen(true)}
              placeholder="Search cryptocurrencies..."
              className="w-full h-11 rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent hover:border-gray-300 dark:bg-bg-soft dark:border-gray-600 dark:text-fg dark:placeholder-fg-muted dark:hover:border-gray-500 dark:focus:border-accent"
              aria-label="Search coins"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-accent dark:text-fg-muted" size={16} />

            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <button
            onClick={toggleFilters}
            className={`w-11 h-11 rounded-full border transition-all duration-200 flex items-center justify-center relative shrink-0 ${
              selectedFilter !== 'all'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-gray-200 bg-white text-gray-400 hover:text-accent hover:border-accent/50 dark:bg-bg-soft dark:border-gray-600 dark:text-fg-muted dark:hover:text-accent dark:hover:border-accent/50'
            }`}
            title="Search filters"
          >
            <Filter size={16} />
            {selectedFilter !== 'all' && (
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full" />
            )}
          </button>
        </div>

        {/* Filter Dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute top-full left-0 right-0 z-[60] mt-2 rounded-xl border border-border-light bg-white/95 backdrop-blur-sm shadow-lg dark:bg-bg-card/95 dark:border-border"
            >
              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-fg">Search Filters</span>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-bg-hover rounded shrink-0"
                  >
                    <X size={16} className="text-gray-400 dark:text-fg-muted" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SEARCH_FILTERS.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => {
                        setSelectedFilter(filter.value)
                        setShowFilters(false)
                      }}
                      className={`p-2 text-left rounded-lg transition-all duration-200 min-w-0 ${
                        selectedFilter === filter.value
                          ? 'bg-accent text-white'
                          : 'hover:bg-gray-50 dark:hover:bg-bg-hover text-gray-700 dark:text-fg'
                      }`}
                      title={filter.description}
                    >
                      <div className="font-medium text-sm truncate">{filter.label}</div>
                      {selectedFilter === filter.value && (
                        <div className="text-xs opacity-90 mt-1 overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {filter.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && searchResults && filteredResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-border-light bg-white/95 backdrop-blur-sm shadow-lg dark:bg-bg-card/95 dark:border-border max-h-96 overflow-y-auto scrollbar-thin"
          >
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-500 dark:text-fg-muted uppercase tracking-wide">
                <div className="flex items-center gap-2 min-w-0">
                  <TrendingUp size={12} className="shrink-0" />
                  <span className="truncate">Search Results</span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="hidden sm:inline">{SEARCH_FILTERS.find(f => f.value === selectedFilter)?.label}</span>
                  {selectedFilter !== 'all' && (
                    <span className="bg-accent/20 text-accent px-1.5 py-0.5 rounded text-[10px]">
                      {filteredResults.length}
                    </span>
                  )}
                </div>
              </div>
              {filteredResults.slice(0, 8).map((coin) => (
                <Link
                  key={coin.id}
                  to={`/coin/${coin.id}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-bg-hover group"
                >
                  <div className="relative">
                    <img
                      src={coin.thumb}
                      alt=""
                      className="w-8 h-8 rounded-full shadow-sm transition-transform duration-200 group-hover:scale-110"
                    />
                    <div className="absolute -inset-1 rounded-full bg-accent/20 opacity-0 blur-sm transition-opacity duration-200 group-hover:opacity-100" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-fg transition-colors duration-200 group-hover:text-accent truncate">
                        {coin.name}
                      </span>
                      <span className="text-xs uppercase text-gray-500 dark:text-fg-muted bg-gray-100 dark:bg-bg-soft px-2 py-0.5 rounded-full">
                        {coin.symbol}
                      </span>
                    </div>
                    {coin.market_cap_rank && (
                      <div className="text-xs text-gray-500 dark:text-fg-muted mt-0.5">
                        Rank #{coin.market_cap_rank}
                      </div>
                    )}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Search size={12} className="text-accent" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && query.length >= 2 && searchResults && filteredResults.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-border-light bg-white/95 backdrop-blur-sm shadow-lg dark:bg-bg-card/95 dark:border-border"
        >
          <div className="p-4 text-center text-gray-500 dark:text-fg-muted">
            No results found for "{query}"
          </div>
        </motion.div>
      )}
    </div>
  )
}