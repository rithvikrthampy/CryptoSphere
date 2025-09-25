import { useState, useRef, useEffect } from 'react'
import { Settings, Search, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { searchCoins } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'

type FeaturedCoinSelectorProps = {
  currentCoinId: string
  onCoinChange: (coinId: string, coinName: string) => void
}

const POPULAR_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'vanar-chain', name: 'Vanar Chain', symbol: 'VANRY' },
]

export default function FeaturedCoinSelector({ currentCoinId, onCoinChange }: FeaturedCoinSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const selectorRef = useRef<HTMLDivElement>(null)

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['featured-search', searchQuery],
    queryFn: () => searchCoins(searchQuery),
    enabled: searchQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCoinSelect = (coinId: string, coinName: string) => {
    onCoinChange(coinId, coinName)
    setIsOpen(false)
    setSearchQuery('')
  }

  const currentCoin = POPULAR_COINS.find(coin => coin.id === currentCoinId)

  return (
    <div ref={selectorRef} className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-light bg-white/60 text-gray-700 hover:bg-white/80 transition-all duration-200 dark:bg-bg-soft dark:text-fg dark:border-border dark:hover:bg-bg-hover"
        title="Change featured coin"
      >
        <Settings size={16} />
        <span className="text-sm hidden sm:inline">
          Featured: {currentCoin?.symbol || 'VANRY'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 z-50 mt-2 w-80 rounded-xl border border-border-light bg-white/95 backdrop-blur-sm shadow-lg dark:bg-bg-card/95 dark:border-border"
          >
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-fg mb-3">
                Select Featured Coin
              </h3>

              {/* Search Input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cryptocurrencies..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-light bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 dark:bg-bg-soft dark:text-fg dark:placeholder-fg-muted dark:border-border"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-fg-muted" size={16} />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto scrollbar-thin">
                {searchQuery.length >= 2 ? (
                  searchResults && searchResults.coins.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.coins.slice(0, 10).map((coin) => (
                        <button
                          key={coin.id}
                          onClick={() => handleCoinSelect(coin.id, coin.name)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-bg-hover group text-left"
                        >
                          <img
                            src={coin.thumb}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-fg truncate">
                                {coin.name}
                              </span>
                              <span className="text-xs uppercase text-gray-500 dark:text-fg-muted bg-gray-100 dark:bg-bg-soft px-1.5 py-0.5 rounded">
                                {coin.symbol}
                              </span>
                            </div>
                            {coin.market_cap_rank && (
                              <div className="text-xs text-gray-500 dark:text-fg-muted">
                                Rank #{coin.market_cap_rank}
                              </div>
                            )}
                          </div>
                          {currentCoinId === coin.id && (
                            <Star className="w-4 h-4 text-accent fill-current" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-gray-500 dark:text-fg-muted text-sm">
                      {isLoading ? 'Searching...' : `No results found for "${searchQuery}"`}
                    </div>
                  )
                ) : (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-fg-muted uppercase tracking-wide">
                      Popular Coins
                    </div>
                    {POPULAR_COINS.map((coin) => (
                      <button
                        key={coin.id}
                        onClick={() => handleCoinSelect(coin.id, coin.name)}
                        className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-bg-hover group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900 dark:text-fg">
                            {coin.name}
                          </span>
                          <span className="text-xs uppercase text-gray-500 dark:text-fg-muted bg-gray-100 dark:bg-bg-soft px-1.5 py-0.5 rounded">
                            {coin.symbol}
                          </span>
                        </div>
                        {currentCoinId === coin.id && (
                          <Star className="w-4 h-4 text-accent fill-current" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}