import { MarketCoin } from '@/lib/types'
import { formatChange, formatCurrency, formatNumber } from '@/lib/format'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import RowSparkline from './RowSparkline'

export default function CoinRow({ coin, index }: { coin: MarketCoin; index: number }) {
  const isUp = (coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0) >= 0

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.01 }}
      className="group border-b border-border cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:border-border dark:hover:bg-bg-hover"
    >
      <Link to={`/coin/${coin.id}`} className="contents">
        <td className="py-4 pl-4 pr-4 text-left">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={coin.image}
                alt=""
                className="h-8 w-8 rounded-full shadow-sm transition-transform duration-200 group-hover:scale-110"
              />
              <div className="absolute -inset-1 rounded-full bg-accent/20 opacity-0 blur-sm transition-opacity duration-200 group-hover:opacity-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 dark:text-fg transition-colors duration-200 group-hover:text-accent">{coin.name}</span>
              <span className="text-xs uppercase text-gray-500 dark:text-fg-muted">{coin.symbol}</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 text-right font-semibold text-gray-900 dark:text-fg">
          {formatCurrency(coin.current_price)}
        </td>
        <td className={`px-4 py-4 text-right font-medium ${((coin.price_change_percentage_1h_in_currency ?? 0) >= 0) ? 'text-success' : 'text-danger'}`}>
          {formatChange(coin.price_change_percentage_1h_in_currency)}
        </td>
        <td className={`px-4 py-4 text-right font-medium ${((coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0) >= 0) ? 'text-success' : 'text-danger'}`}>
          {formatChange(coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h)}
        </td>
        <td className={`px-4 py-4 text-right font-medium ${((coin.price_change_percentage_7d_in_currency ?? 0) >= 0) ? 'text-success' : 'text-danger'}`}>
          {formatChange(coin.price_change_percentage_7d_in_currency)}
        </td>
        <td className="px-4 py-4 text-right text-gray-600 dark:text-fg-muted">
          {formatCurrency(coin.total_volume, { compact: true })}
        </td>
        <td className="px-4 py-4 text-right font-medium text-gray-900 dark:text-fg">
          {formatCurrency(coin.market_cap, { compact: true })}
        </td>
        <td className="px-4 py-4 text-center">
          <div className="transition-transform duration-200 group-hover:scale-105">
            <RowSparkline values={coin.sparkline_in_7d?.price?.slice(-70)} />
          </div>
        </td>
      </Link>
    </motion.tr>
  )
}
