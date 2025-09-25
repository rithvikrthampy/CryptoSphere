import { MarketCoin } from '@/lib/types'
import { formatChange, formatCurrency, formatCurrencyCode } from '@/lib/format'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

export default function FeaturedCoin({ coin, pair = 'USDT' }: { coin: MarketCoin; pair?: string }) {
  const data = coin.sparkline_in_7d?.price ?? []
  const isUp = (coin.price_change_percentage_24h ?? 0) >= 0
  return (
    <div className="rounded-xl border border-white/10 bg-white/60 p-5 shadow-card dark:bg-bg.card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt="" className="h-10 w-10 rounded-full" />
          <div>
            <div className="text-lg font-semibold">
              {coin.symbol.toUpperCase()}/{pair.toUpperCase()}
              <span className="text-fg-muted text-sm"> · {coin.name}</span>
            </div>
            <div className="text-fg-muted text-sm">Rank #{coin.market_cap_rank}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{pair.toUpperCase() === 'USDT' ? formatCurrencyCode(coin.current_price, 'USDT') : formatCurrency(coin.current_price)}</div>
          <div className={isUp ? 'text-success' : 'text-danger'}>
            {formatChange(coin.price_change_percentage_24h)} (24h)
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Line
          height={72}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { intersect: false, mode: 'index' } },
            scales: { x: { display: false }, y: { display: false } },
            elements: { point: { radius: 0 } },
          }}
          data={{
            labels: data.map((_, i) => String(i)),
            datasets: [
              {
                label: coin.name,
                data,
                borderColor: isUp ? '#10b981' : '#ef4444',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3,
              },
            ],
          }}
        />
      </div>
    </div>
  )
}
