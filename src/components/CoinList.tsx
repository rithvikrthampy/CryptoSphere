import { MarketCoin } from '@/lib/types'
import CoinRow from './CoinRow'
import { motion } from 'framer-motion'

export default function CoinList({ coins }: { coins: MarketCoin[] }) {
  if (coins.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-gray-400 dark:text-fg-muted mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.469-.898-6.045-2.37L5.5 11.5"/>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-fg mb-2">No cryptocurrencies found</h3>
        <p className="text-gray-500 dark:text-fg-muted">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light bg-gray-50/50 dark:bg-bg-soft/50 dark:border-border">
              <th className="py-4 pl-4 pr-4 text-left font-semibold text-gray-700 dark:text-fg-subtle">
                Coin
              </th>
              <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-fg-subtle">
                Price
              </th>
              <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-fg-subtle">
                1h %
              </th>
              <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-fg-subtle">
                24h %
              </th>
              <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-fg-subtle">
                7d %
              </th>
              <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-fg-subtle">
                24h Volume
              </th>
              <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-fg-subtle">
                Market Cap
              </th>
              <th className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-fg-subtle">
                Last 7 Days
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border">
            {coins.map((coin, index) => (
              <CoinRow key={coin.id} coin={coin} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
