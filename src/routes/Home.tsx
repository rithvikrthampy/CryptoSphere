import { useQuery } from '@tanstack/react-query'
import { getSingleMarketCoin, getTopMarketCoins } from '@/lib/api'
import EnhancedFeaturedCoin from '@/components/EnhancedFeaturedCoin'
import FeaturedCoinSelector from '@/components/FeaturedCoinSelector'
import CoinList from '@/components/CoinList'
import Filters, { TopOpt, WindowOpt } from '@/components/Filters'
import Pagination from '@/components/Pagination'
import MarketStats from '@/components/MarketStats'
import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, RefreshCw, TrendingUp } from 'lucide-react'

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [featuredCoinId, setFeaturedCoinId] = useState('vanar-chain')
  const [featuredCoinName, setFeaturedCoinName] = useState('Vanar Chain')

  // Load featured coin from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('featuredCoin')
    if (saved) {
      try {
        const { id, name } = JSON.parse(saved)
        setFeaturedCoinId(id)
        setFeaturedCoinName(name)
      } catch {
        // Keep default values if parsing fails
      }
    }
  }, [])

  const handleFeaturedCoinChange = (coinId: string, coinName: string) => {
    setFeaturedCoinId(coinId)
    setFeaturedCoinName(coinName)
    localStorage.setItem('featuredCoin', JSON.stringify({ id: coinId, name: coinName }))
  }

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['markets-all'],
    queryFn: async () => {
      // Start with just one page to minimize API calls
      const PAGE_SIZE = 250
      const allCoins: any[] = []

      try {
        // First page
        const coins = await getTopMarketCoins({ page: 1, perPage: PAGE_SIZE })
        allCoins.push(...coins)

        // Only fetch second page if first was successful and we need more data
        if (coins.length === PAGE_SIZE) {
          try {
            const coins2 = await getTopMarketCoins({ page: 2, perPage: PAGE_SIZE })
            allCoins.push(...coins2)
          } catch (error) {
            console.warn('Second page fetch failed, using first page only:', error)
          }
        }
      } catch (error) {
        console.warn('First page fetch failed:', error)
        throw error
      }

      return allCoins.slice(0, 500) // Max 500 coins
    },
    refetchInterval: false, // Disable automatic refetching
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour cache
    retry: 0, // No retries to prevent cascading failures
  })

  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase().trim()
  const window = (params.get('window') as WindowOpt) || '24h'
  const top = (params.get('top') as TopOpt) || 'all'

  const { filteredCoins, paginatedCoins, totalPages } = useMemo(() => {
    let list = data ?? []

    // Apply filters
    if (q) list = list.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
    if (top !== 'all') {
      const key = window === '24h' ? 'price_change_percentage_24h' : 'price_change_percentage_7d_in_currency'
      const sorted = [...list].sort((a: any, b: any) => (b[key] ?? 0) - (a[key] ?? 0))
      list = top === 'gainers' ? sorted.slice(0, 100) : sorted.reverse().slice(0, 100)
    }

    // Pagination
    const startIndex = (currentPage - 1) * perPage
    const endIndex = startIndex + perPage
    const paginated = list.slice(startIndex, endIndex)
    const pages = Math.ceil(list.length / perPage)

    return {
      filteredCoins: list,
      paginatedCoins: paginated,
      totalPages: pages
    }
  }, [data, q, window, top, currentPage, perPage])

  // Featured coin data - try to use existing data first
  const featuredCoinFromList = useMemo(() => {
    return data?.find(coin => coin.id === featuredCoinId)
  }, [data, featuredCoinId])

  const featuredQuery = useQuery({
    queryKey: ['featured-coin', featuredCoinId],
    queryFn: async () => {
      // Only fetch if not found in main list
      if (featuredCoinFromList) {
        return { coin: featuredCoinFromList, pair: 'USD' as const }
      }

      try {
        const usd = await getSingleMarketCoin(featuredCoinId, 'usd')
        return { coin: usd[0], pair: 'USD' as const }
      } catch (error) {
        console.warn('Featured coin fetch failed:', error)
        throw error
      }
    },
    staleTime: 20 * 60 * 1000, // 20 minutes
    refetchInterval: false, // Disable auto-refresh
    retry: 0, // Don't retry
    enabled: !!featuredCoinId,
  })
  const featuredDisplay = featuredQuery.data?.coin
  const featuredPair = featuredQuery.data?.pair || 'USDT'

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }

  const getErrorMessage = () => {
    if (error && 'status' in error) {
      if (error.status === 429) {
        return 'Rate limit reached. Data will refresh automatically in a few minutes.'
      }
    }
    return error?.message || 'Failed to load market data. Please try again.'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Market Stats Sidebar - Left Side */}
      <div className="lg:col-span-1 order-2 lg:order-1">
        <MarketStats marketData={data} />
      </div>

      {/* Main Content - Right Side */}
      <div className="lg:col-span-3 space-y-8 order-1 lg:order-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-accent" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-fg">Markets</h1>
            </div>
            {isFetching && (
              <div className="flex items-center gap-2 text-sm text-accent">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Refreshing...</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <FeaturedCoinSelector
              currentCoinId={featuredCoinId}
              onCoinChange={handleFeaturedCoinChange}
            />
          </div>
        </div>

        {isError && (
          <div className="error-state rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Unable to load market data</p>
              <p className="text-sm mt-1 opacity-90">{getErrorMessage()}</p>
              <button
                onClick={() => refetch()}
                className="btn-secondary mt-3 text-sm px-3 py-1.5"
                disabled={isFetching}
              >
                {isFetching ? 'Retrying...' : 'Try Again'}
              </button>
            </div>
          </div>
        )}

        {featuredQuery.isLoading ? (
          <div className="h-48 rounded-2xl loading-shimmer" />
        ) : featuredQuery.isError ? (
          <div className="card p-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 dark:text-fg-muted mb-3" />
            <h3 className="font-medium text-gray-900 dark:text-fg mb-2">
              Unable to load featured coin
            </h3>
            <p className="text-sm text-gray-500 dark:text-fg-muted mb-4">
              {featuredCoinName} data is currently unavailable
            </p>
            <button
              onClick={() => featuredQuery.refetch()}
              className="btn-secondary text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          featuredDisplay && <EnhancedFeaturedCoin coin={featuredDisplay} pair={featuredPair} />
        )}

        <Filters />

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-12 rounded-xl loading-shimmer" />
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="h-16 rounded-xl loading-shimmer" />
            ))}
          </div>
        ) : (
          <>
            <CoinList coins={paginatedCoins} />
            {filteredCoins.length > perPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                perPage={perPage}
                onPerPageChange={handlePerPageChange}
                totalItems={filteredCoins.length}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
