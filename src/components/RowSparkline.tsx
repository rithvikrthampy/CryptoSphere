type Props = {
  values?: number[]
}

export default function RowSparkline({ values }: Props) {
  if (!values || values.length < 2) return <div className="h-7" />
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const w = 100
  const h = 28
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })
  const isUp = values[values.length - 1] >= values[0]
  const color = isUp ? '#10b981' : '#ef4444'
  const path = `M ${points[0]} L ${points.slice(1).join(' ')}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="mx-auto block">
      <path d={path} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

