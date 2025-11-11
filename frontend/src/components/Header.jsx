import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const path = window.location.pathname;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' }
  ];

  return (
    <nav className='bg-slate-900/95 backdrop-blur-lg border-b border-cyan-500/30 sticky top-0 z-50 shadow-lg shadow-cyan-500/10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          
          {/* Logo */}
          <div className='flex items-center'>
            <a href='/' className='flex items-center gap-2 group'>
              <div className='bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                </svg>
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
                Safe<span className='text-white'>Blog</span>
              </span>
            </a>
          </div>

          {/* Search Bar - Desktop */}
          <div className='hidden lg:flex flex-1 max-w-md mx-8'>
            <div className='relative w-full'>
              <input
                type='text'
                placeholder='Search articles...'
                className='w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all'
              />
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-1'>
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  path === link.path
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-cyan-400'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Side Buttons */}
          <div className='flex items-center gap-3'>
            {/* Search Button - Mobile */}
            <button className='lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 transition-all'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className='hidden sm:flex p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-400 hover:text-yellow-300 transition-all'
            >
              {isDarkMode ? (
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
                </svg>
              ) : (
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z' clipRule='evenodd' />
                </svg>
              )}
            </button>

            {/* Sign In Button */}
            <a href='/sign-in'>
              <button className='hidden sm:flex px-4 py-2 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-white font-medium transition-all duration-300'>
                Sign In
              </button>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className='md:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 transition-all'
            >
              {isMenuOpen ? (
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              ) : (
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden border-t border-slate-800 bg-slate-900/98 backdrop-blur-lg'>
          <div className='px-4 py-3 space-y-1'>
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  path === link.path
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-cyan-400'
                }`}
              >
                {link.name}
              </a>
            ))}
            
            {/* Mobile Sign In */}
            <a href='/sign-in'>
              <button className='w-full mt-2 px-4 py-3 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-white font-medium transition-all duration-300'>
                Sign In
              </button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}