import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signinFailure } from '../redux/user/userSlice'; // adjust path if needed

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Optional: call backend logout API
      // await fetch('/api/auth/signout');
      dispatch(signinFailure()); // Clear user from Redux
      navigate('/sign-in');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">!SafeBlog</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-green-500 font-medium transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-500 font-medium transition-colors">
              About
            </Link>
            <Link to="/projects" className="text-gray-700 hover:text-green-500 font-medium transition-colors">
              Projects
            </Link>
          </nav>

          {/* Desktop: Sign In or Profile Pic */}
          <div className="hidden md:block">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-all"
                >
                  {currentUser.profilePicture ? (
                    <img
                      src={currentUser.profilePicture}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
                      {currentUser.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </button>

                {/* Desktop Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">@{currentUser.username}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/sign-in">
                <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile: Profile (left of hamburger) + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Profile Icon (Mobile) */}
            {currentUser && (
              <button
                onClick={() => {
                  setProfileMenuOpen(!profileMenuOpen);
                  setMobileMenuOpen(false); // Close main menu if open
                }}
                className="relative"
              >
                {currentUser.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-green-500"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                    {currentUser.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setProfileMenuOpen(false); // Close profile menu
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Main Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-gray-700 hover:text-green-500 font-medium py-2">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-green-500 font-medium py-2">About</Link>
              <Link to="/projects" className="text-gray-700 hover:text-green-500 font-medium py-2">Projects</Link>
              
              {!currentUser && (
                <Link to="/sign-in">
                  <button className="mt-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                    Sign In
                  </button>
                </Link>
              )}
            </nav>
          </div>
        )}

                {/* Mobile Profile Dropdown – Fixed hover red */}
                {/* Mobile Profile Dropdown – PERFECTLY ALIGNED */}
        {profileMenuOpen && currentUser && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="px-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                {currentUser.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                    {currentUser.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">@{currentUser.username}</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setProfileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:text-green-500 hover:bg-gray-100 font-medium rounded-lg transition-colors border-b border-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}