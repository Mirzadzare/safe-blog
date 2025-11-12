import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signinFailure } from '../redux/user/userSlice';

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
      dispatch(signinFailure());
      navigate('/sign-in');
    } catch (error) {
      console.log(error);
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

  return (
    <header ref={headerRef} className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">!SafeBlog</span>
          </Link>

          {/* Right Side: Profile + Hamburger */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => {
                    setProfileMenuOpen(!profileMenuOpen);
                    setMenuOpen(false);
                  }}
                  className="hover:bg-gray-100 rounded-full p-1 transition-all"
                >
                  {currentUser.profilePicture ? (
                    <img src={currentUser.profilePicture} alt="profile" className="w-9 h-9 rounded-full object-cover border-2 border-green-500" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                      {currentUser.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </button>

                {profileMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        {currentUser.profilePicture ? (
                          <img src={currentUser.profilePicture} alt="profile" className="w-12 h-12 rounded-full object-cover border-2 border-green-500" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                            {currentUser.username?.[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">@{currentUser.username}</p>
                          <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-6 py-3 text-gray-700 hover:bg-gray-100 font-medium"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="relative">
              <button
                ref={menuButtonRef}
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  setProfileMenuOpen(false);
                }}
                className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center
                  ${menuOpen 
                    ? 'bg-gray-100 text-gray-400 ring-1' 
                    : 'hover:bg-gray-100 text-gray-700'
                  }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <nav className="flex flex-col">
                    <Link
                      to="/"
                      onClick={() => setMenuOpen(false)}
                      className="px-6 py-3 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                    >
                      Home
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setMenuOpen(false)}
                      className="px-6 py-3 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                    >
                      About
                    </Link>
                    <Link
                      to="/projects"
                      onClick={() => setMenuOpen(false)}
                      className="px-6 py-3 text-gray-700 hover:bg-gray-100 font-medium transition-colors border-b border-gray-100"
                    >
                      Projects
                    </Link>

                    {!currentUser && (
                      <div className="px-6 py-3">
                        <Link to="/sign-in" onClick={() => setMenuOpen(false)}>
                          <button className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all">
                            Sign In
                          </button>
                        </Link>
                      </div>
                    )}
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}