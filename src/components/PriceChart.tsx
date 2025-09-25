import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js'
import { formatCurrency } from '@/lib/format'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

export default function PriceChart({
  prices,
}: {
  prices: [number, number][]
}) {
  const labels = prices.map((p) => new Date(p[0]).toLocaleString())
  const data = prices.map((p) => p[1])
  const isUp = (data[data.length - 1] ?? 0) >= (data[0] ?? 0)
  return (
    <div className="h-80">
      <Line
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              intersect: false,
              callbacks: {
                label: (ctx) => formatCurrency(ctx.parsed.y),
              },
            },
          },
          scales: {
            x: { ticks: { color: '#9fb0c0' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#9fb0c0' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          },
          elements: { point: { radius: 0 } },
        }}
        data={{
          labels,
          datasets: [
            {
              label: 'Price',
              data,
              borderColor: isUp ? '#10b981' : '#ef4444',
              backgroundColor: 'rgba(79,156,255,0.15)',
              borderWidth: 2,
              tension: 0.3,
              fill: true,
            },
          ],
        }}
      />
    </div>
  )
}

