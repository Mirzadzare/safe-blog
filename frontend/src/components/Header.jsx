import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function HackerHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
  ];

  const triggerGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 400);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-green-500/40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onMouseEnter={triggerGlitch}
        >
          <span className="text-green-500 font-mono text-lg animate-pulse">&gt;</span>
          <div className="relative">
            <span className={`text-2xl font-bold font-mono tracking-wider ${glitch ? 'animate-pulse' : ''}`}>
              <span className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">!Safe</span>
              <span className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">Blog</span>
            </span>
            <span className="ml-2 text-xs text-green-500 font-mono opacity-70">
              v1.0.0
              <span className="inline-block w-2 h-2 ml-1 bg-green-500 rounded-full animate-ping"></span>
            </span>

            {glitch && (
              <>
                <span className="absolute top-0 left-0 text-cyan-400 opacity-70 animate-ping" style={{ clipPath: 'inset(0 0 55% 0)' }}>
                  SafeBlog
                </span>
                <span className="absolute top-0 left-0 text-pink-400 opacity-60 animate-ping delay-75" style={{ clipPath: 'inset(55% 0 0 0)' }}>
                  SafeBlog
                </span>
              </>
            )}
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-5 py-2 text-green-400 font-mono text-sm rounded transition-all duration-300
                  ${active
                    ? 'bg-green-950/60 border border-green-500 text-green-300 shadow-lg shadow-green-500/50'
                    : 'hover:bg-green-950/40 border border-transparent hover:border-green-500/50'
                  }
                `}
                onMouseEnter={!active ? triggerGlitch : undefined}
              >
                <span className="text-green-500">&gt;</span> {link.name}
                {active && <span className="ml-2 animate-pulse">_</span>}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link
            to="/sign-in"
            className="hidden sm:flex items-center gap-2 px-5 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 text-green-400 font-mono text-sm rounded transition-all duration-300 shadow-md shadow-green-500/20 hover:shadow-green-500/40"
          >
            <span>&gt;</span> Sign In
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded bg-green-950/30 hover:bg-green-950/50 border border-green-500/50 text-green-400 transition-all"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-green-500/30 bg-black">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    block px-5 py-3 text-green-400 font-mono rounded transition-all
                    ${active
                      ? 'bg-green-950/60 border border-green-500 text-green-300 shadow-lg shadow-green-500/50'
                      : 'hover:bg-green-950/40 border border-green-500/30'
                    }
                  `}
                >
                  <span className="text-green-500">&gt;</span> {link.name}
                  {active && <span className="ml-2 animate-pulse">_</span>}
                </Link>
              );
            })}
            <Link
              to="/sign-in"
              onClick={() => setIsMenuOpen(false)}
              className="block px-5 py-3 bg-green-500/10 border border-green-500/50 text-green-400 font-mono rounded text-center"
            >
              <span>&gt;</span> Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}