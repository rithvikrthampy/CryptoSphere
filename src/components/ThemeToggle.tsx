import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

function getSystemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(false)

  // Initialize theme after component mounts to avoid SSR issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark') {
        setDark(true)
      } else if (saved === 'light') {
        setDark(false)
      } else {
        setDark(getSystemPrefersDark())
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      if (dark) {
        root.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        root.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }, [dark])

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setDark((d) => !d)}
      className="inline-flex items-center gap-2 rounded-lg border border-border-light bg-white/80 px-3 py-2 text-sm shadow-sm transition-all duration-200 hover:shadow-md hover:bg-white dark:bg-bg-soft dark:border-border dark:hover:bg-bg-hover dark:text-fg"
    >
      {dark ? (
        <Moon size={16} className="text-blue-400" />
      ) : (
        <Sun size={16} className="text-amber-500" />
      )}
      <span className="hidden sm:inline font-medium">
        {dark ? 'Dark' : 'Light'}
      </span>
    </button>
  )
}

