import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

// Storage key based on wallet address
const getStorageKey = (address: string) => `portal-url-${address.toLowerCase()}`

function App() {
  const { address, isConnected } = useAccount()
  const [portalUrl, setPortalUrl] = useState<string | null>(null)
  const [inputUrl, setInputUrl] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSealing, setIsSealing] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load saved URL when wallet connects
  useEffect(() => {
    if (address) {
      const saved = localStorage.getItem(getStorageKey(address))
      if (saved) {
        setPortalUrl(saved)
      } else {
        setPortalUrl(null)
      }
    } else {
      setPortalUrl(null)
    }
  }, [address])

  const handleSealPortal = () => {
    if (!inputUrl.trim() || !address) return

    let url = inputUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    setIsSealing(true)

    // Ceremonial delay
    setTimeout(() => {
      localStorage.setItem(getStorageKey(address), url)
      setPortalUrl(url)
      setShowConfirm(false)
      setIsSealing(false)
      setInputUrl('')
    }, 1500)
  }

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-white/5">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="font-serif text-lg md:text-2xl tracking-tight">
            <span className="text-white">Portal</span>
            <span className="text-cyan-400">Frame</span>
          </h1>
        </div>
        <ConnectButton />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:py-12 relative z-10">
        {!isConnected ? (
          // Not connected state
          <div className="text-center max-w-xl mx-auto animate-fade-in">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 md:mb-8 relative">
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-500/30 animate-pulse" />
              <div className="absolute inset-2 rounded-xl border border-white/10 flex items-center justify-center bg-white/[0.02]">
                <svg className="w-10 h-10 md:w-12 md:h-12 text-cyan-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
            </div>
            <h2 className="font-serif text-2xl md:text-4xl mb-3 md:mb-4 text-white">
              Open Your Portal
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-8 leading-relaxed px-4">
              Connect your wallet to create a permanent iframe portal.
              <br className="hidden md:block" />
              <span className="text-cyan-400">Set once, view forever.</span>
            </p>
            <div className="inline-block">
              <ConnectButton />
            </div>
          </div>
        ) : portalUrl ? (
          // Portal is sealed - show iframe
          <div className="w-full max-w-6xl mx-auto flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span className="font-mono text-xs md:text-sm text-gray-400 truncate">
                  Portal sealed by {truncateAddress(address!)}
                </span>
              </div>
              <div className="font-mono text-xs text-gray-500 bg-white/5 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-white/5 truncate max-w-full">
                {portalUrl}
              </div>
            </div>

            {/* Portal Frame */}
            <div className="flex-1 relative rounded-xl md:rounded-2xl overflow-hidden portal-frame">
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-xl md:rounded-2xl border border-cyan-500/30 pointer-events-none z-10" />
              <div className="absolute -inset-[1px] rounded-xl md:rounded-2xl bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-cyan-500/20 blur-sm pointer-events-none animate-glow" />

              {/* Loading state */}
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0b] z-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    <span className="font-mono text-sm text-gray-400">Opening portal...</span>
                  </div>
                </div>
              )}

              <iframe
                src={portalUrl}
                className="w-full h-full bg-white rounded-xl md:rounded-2xl"
                onLoad={() => setIsLoaded(true)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          // Connected but no portal set - show input
          <div className="w-full max-w-xl mx-auto animate-fade-in px-4">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4 md:mb-6">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="font-mono text-xs md:text-sm text-cyan-400">
                  Connected as {truncateAddress(address!)}
                </span>
              </div>
              <h2 className="font-serif text-2xl md:text-4xl mb-3 md:mb-4 text-white">
                Seal Your Portal
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Enter a URL below. Once sealed, this portal is <span className="text-cyan-400 font-semibold">permanent</span>.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="relative group">
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-cyan-500/50 to-teal-500/50 opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="relative w-full px-4 md:px-6 py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-xl font-mono text-base md:text-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              <button
                onClick={() => setShowConfirm(true)}
                disabled={!inputUrl.trim()}
                className="w-full py-4 md:py-5 px-6 md:px-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl font-mono text-base md:text-lg font-medium text-white hover:from-cyan-400 hover:to-teal-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/20"
              >
                Open Portal
              </button>
            </div>

            <p className="text-center text-gray-600 text-xs md:text-sm mt-6 md:mt-8">
              Warning: This action cannot be undone for this wallet address.
            </p>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111113] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center border border-cyan-500/30">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl md:text-2xl mb-2 text-white">Seal This Portal?</h3>
              <p className="text-gray-400 text-sm md:text-base">
                This URL will be permanently locked to your wallet address.
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 md:p-4 mb-6 md:mb-8">
              <span className="font-mono text-xs md:text-sm text-cyan-400 break-all">{inputUrl}</span>
            </div>

            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSealing}
                className="flex-1 py-3 md:py-4 px-4 md:px-6 bg-white/5 border border-white/10 rounded-xl font-mono text-sm md:text-base text-gray-400 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSealPortal}
                disabled={isSealing}
                className="flex-1 py-3 md:py-4 px-4 md:px-6 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl font-mono text-sm md:text-base font-medium text-white hover:from-cyan-400 hover:to-teal-400 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
              >
                {isSealing ? (
                  <>
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sealing...</span>
                  </>
                ) : (
                  'Seal Forever'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-4 md:py-6 text-center border-t border-white/5">
        <p className="text-gray-600 text-xs font-mono">
          Requested by <span className="text-gray-500">@web-user</span> · Built by <span className="text-gray-500">@clonkbot</span>
        </p>
      </footer>

      <style>{`
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .portal-frame {
          box-shadow:
            0 0 60px rgba(6, 182, 212, 0.1),
            0 0 100px rgba(6, 182, 212, 0.05);
        }
      `}</style>
    </div>
  )
}

export default App
