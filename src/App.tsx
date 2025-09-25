import { Outlet, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ThemeToggle from './components/ThemeToggle'
import SearchDropdown from './components/SearchDropdown'

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-full bg-gray-50 dark:bg-bg transition-colors duration-300">
      <header className="sticky top-0 z-40 border-b border-border-light bg-white/80 backdrop-blur-md dark:bg-bg/80 dark:border-border">
        <div className="container-max flex h-16 items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white transition-colors duration-200 hover:text-accent dark:hover:text-accent"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            Crypto<span className="text-accent">Sphere</span>
          </Link>
          <div className="flex-1 max-w-xl">
            <SearchDropdown />
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="container-max py-8 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="border-t border-border-light bg-white/50 dark:bg-bg-soft dark:border-border">
        <div className="container-max py-8 text-center">
          <div className="text-sm text-gray-600 dark:text-fg-muted">
            Powered by <span className="font-medium text-accent">CryptoSphere</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-fg-muted mt-2">
            Your comprehensive cryptocurrency market companion
          </div>
        </div>
      </footer>
    </div>
  )
}

