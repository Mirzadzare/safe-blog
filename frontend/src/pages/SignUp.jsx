import { useState } from 'react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      <div className='flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-8 min-h-screen'>
        
        {/* Left Side - Branding */}
        <div className='flex-1 space-y-6'>
          <div>
            <div className='flex items-center gap-2 group cursor-pointer'>
              <div className='bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-lg shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                </svg>
              </div>
              <span className='text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
                Safe<span className='text-white'>Blog</span>
              </span>
            </div>
          </div>
          
          <div className='space-y-4 text-gray-300'>
            <p className='text-lg leading-relaxed'>
              A secure platform for cybersecurity professionals to share knowledge and insights.
            </p>
            <div className='flex items-start gap-3'>
              <svg className='w-6 h-6 text-cyan-400 flex-shrink-0 mt-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
              </svg>
              <p className='text-sm'>End-to-end encryption for all communications</p>
            </div>
            <div className='flex items-start gap-3'>
              <svg className='w-6 h-6 text-cyan-400 flex-shrink-0 mt-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' />
              </svg>
              <p className='text-sm'>Multi-factor authentication support</p>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className='flex-1'>
          <div className='bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-700'>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-white mb-2'>Create Account</h2>
              <p className='text-gray-400 text-sm'>Join our secure community today</p>
            </div>

            {showAlert && (
              <div className='mb-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg'>
                <span className='text-sm text-blue-300'>Demo mode: Action successful!</span>
              </div>
            )}

            {/* Social Login Buttons */}
            <div className='space-y-3 mb-6'>
              <button
                onClick={() => handleSocialLogin('Google')}
                className='w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg'
              >
                <svg className='w-5 h-5' viewBox='0 0 24 24'>
                  <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
                  <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
                  <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
                  <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleSocialLogin('Facebook')}
                className='w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                </svg>
                Continue with Facebook
              </button>
            </div>

            <div className='relative mb-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-slate-600'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-slate-800 text-gray-400'>Or continue with email</span>
              </div>
            </div>

            {/* Email Signup Form */}
            <div className='space-y-4'>
              <div>
                <label htmlFor="username" className='text-gray-300 mb-2 block text-sm font-medium'>
                  Username
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                    </svg>
                  </div>
                  <input
                    type='text'
                    placeholder='Choose a username'
                    id='username'
                    value={formData.username}
                    onChange={handleChange}
                    className='w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all'
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className='text-gray-300 mb-2 block text-sm font-medium'>
                  Email Address
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                  </div>
                  <input
                    type='email'
                    placeholder='your@email.com'
                    id='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all'
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className='text-gray-300 mb-2 block text-sm font-medium'>
                  Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                    </svg>
                  </div>
                  <input
                    type='password'
                    placeholder='Create a strong password'
                    id='password'
                    value={formData.password}
                    onChange={handleChange}
                    className='w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all'
                    required
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className='w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50'
              >
                Create Account
              </button>
            </div>

            <div className='mt-6 text-center'>
              <p className='text-gray-400 text-sm'>
                Already have an account?{' '}
                <span className='text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer'>
                  Sign In
                </span>
              </p>
            </div>

            <div className='mt-6 pt-6 border-t border-slate-700'>
              <p className='text-xs text-gray-500 text-center'>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}