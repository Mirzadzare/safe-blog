import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from "../redux/user/userSlice";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const profileButtonRef = useRef(null);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/v1/users/signout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Sign out failed");

      dispatch(signOut());

      toast.success("Signed out successfully!");
      navigate("/sign-in");
    } catch (error) {
      console.error(error);
      toast.error("Could not sign out. Try again.");
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target) &&
        !menuButtonRef.current?.contains(event.target) &&
        !profileButtonRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <header 
      ref={headerRef} 
      className="bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo - Left */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group transition-all flex-shrink-0"
            aria-label="SafeBlog Home"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-teal-600 transition-all duration-200">
              !SafeBlog
            </span>
          </Link>

          {/* Center Navigation - Desktop Only */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2" aria-label="Main navigation">
            <Link 
              to="/" 
              className="px-4 py-2 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              About
            </Link>
            <Link 
              to="/projects" 
              className="px-4 py-2 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Projects
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {currentUser ? (
              <>
                {/* Profile Avatar Button - Logged In */}
                <div className="relative">
                  <button
                    ref={profileButtonRef}
                    onClick={() => {
                      setProfileMenuOpen(!profileMenuOpen);
                      setMenuOpen(false);
                    }}
                    className="group relative hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-full"
                    aria-label="User menu"
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="true"
                  >
                    {currentUser.profilePicture ? (
                      <img 
                        src={currentUser.profilePicture} 
                        alt={`${currentUser.username}'s profile`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-md group-hover:border-emerald-600 group-hover:shadow-lg transition-all" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
                        {currentUser.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full transition-transform duration-200 ${profileMenuOpen ? 'scale-110' : ''}`}></div>
                  </button>

                  {/* Profile Dropdown */}
                  {profileMenuOpen && (
                    <div 
                      className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      {/* User Info Header */}
                      <div className="px-5 py-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          {currentUser.profilePicture ? (
                            <img 
                              src={currentUser.profilePicture} 
                              alt="profile" 
                              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm" 
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                              {currentUser.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate">@{currentUser.username}</p>
                            <p className="text-sm text-slate-600 truncate">{currentUser.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors duration-150"
                          role="menuitem"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 font-medium transition-colors duration-150 text-left"
                          role="menuitem"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hamburger Menu Button - Logged In (Mobile Only) */}
                <div className="relative md:hidden">
                  <button
                    ref={menuButtonRef}
                    onClick={() => {
                      setMenuOpen(!menuOpen);
                      setProfileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                      ${menuOpen 
                        ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                        : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    aria-label="Navigation menu"
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                  >
                    <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {menuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>

                  {/* Main Menu Dropdown */}
                  {menuOpen && (
                    <div 
                      className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <nav className="py-2">
                        <Link
                          to="/"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors duration-150"
                          role="menuitem"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Home
                        </Link>
                        <Link
                          to="/about"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors duration-150"
                          role="menuitem"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          About
                        </Link>
                        <Link
                          to="/projects"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors duration-150"
                          role="menuitem"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Projects
                        </Link>
                      </nav>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Sign In Button - Not Logged In */}
                <Link 
                  to="/sign-in"
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </Link>

                {/* Hamburger Menu Button - Not Logged In */}
                <div className="relative">
                  <button
                    ref={menuButtonRef}
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={`block md:hidden p-2.5 rounded-lg transition-all duration-200 items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                      ${menuOpen 
                        ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                        : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    aria-label="Navigation menu"
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                  >
                    <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {menuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>

                  {/* Navigation Dropdown - Not Logged In */}
                  {menuOpen && (
                    <div 
                      className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <nav className="py-2">
                        <Link
                          to="/"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors duration-150"
                          role="menuitem"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Home
                        </Link>
                        <Link
                          to="/about"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors duration-150"
                          role="menuitem"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          About
                        </Link>
                        <Link
                          to="/projects"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors duration-150"
                          role="menuitem"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Projects
                        </Link>
                        
                        <div className="border-t border-slate-100 mt-2 pt-2">
                          <Link
                            to="/sign-in"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-emerald-600 hover:bg-emerald-50 font-semibold transition-colors duration-150"
                            role="menuitem"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Sign In
                          </Link>
                        </div>
                      </nav>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}