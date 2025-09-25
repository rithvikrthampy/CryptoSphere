export function formatCurrency(n: number, opts: { compact?: boolean } = {}) {
  const { compact } = opts
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 2,
  }).format(n)
}

export function formatNumber(n: number, compact = true) {
  return new Intl.NumberFormat(undefined, {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 2,
  }).format(n)
}

export function formatChange(pct?: number) {
  if (pct == null || Number.isNaN(pct)) return '—'
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(2)}%`
}

export function formatDate(ts: number) {
  return new Date(ts).toLocaleString()
}

export function formatCurrencyCode(n: number, code: string, opts: { compact?: boolean } = {}) {
  const { compact } = opts
  const upper = code.toUpperCase()
  if (upper === 'USDT') {
    // Not a real ISO currency; format like USD and append code
    return `${new Intl.NumberFormat(undefined, {
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: 2,
    }).format(n)} ${upper}`
  }
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: upper as any,
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: 2,
    }).format(n)
  } catch {
    return `${formatNumber(n, !opts.compact)} ${upper}`
  }
}
