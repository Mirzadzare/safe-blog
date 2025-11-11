import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signinFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart)
      const res = await fetch('/api/v1/auth/signin', {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success === false) {
        dispatch(signinFailure(data.message || "Access denied."))
        return;
      }

      if (res.ok){
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signinFailure(error.message))
    }
  };

  // Auto-dismiss error after 6s
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => dispatch(signinFailure(null)), 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, dispatch]);


  return (
    <div className='min-h-screen bg-black relative overflow-hidden'>
      {/* Matrix background */}
      <div className='absolute inset-0 bg-gradient-to-b from-black via-green-950/10 to-black'></div>
      <div className='absolute inset-0' style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(34, 197, 94, 0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className='relative flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-8 min-h-screen'>

        {/* Left Side - Branding */}
        <div className='flex-1 space-y-6 -mt-64'>
          <div>
            <div className='flex items-center gap-3 group cursor-pointer'>
              <div className='relative'>
                <div className='absolute inset-0 bg-green-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity'></div>
                <div className='relative bg-black border-2 border-green-500 p-3 rounded-lg shadow-lg shadow-green-500/50 group-hover:shadow-green-500/75 transition-all duration-300'>
                  <svg className='w-8 h-8 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' />
                  </svg>
                </div>
              </div>
              <div>
                <span className='text-4xl font-bold text-green-500 font-mono tracking-wider drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]'>
                  !Safe<span className='text-green-400'>Blog</span>
                </span>
                <div className='flex items-center gap-1 mt-1'>
                  <span className='text-xs text-green-500 font-mono'>v1.0.0</span>
                  <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-6 text-green-400/90'>
            <div className='border-l-2 border-green-500 pl-4'>
              <p className='text-lg leading-relaxed font-mono'>
                &gt; A !secure blog for my learning journey_
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className='flex-1 relative'>
          {/* ERROR ALERT */}
          {errorMessage && (
            <div className="absolute top-0 left-0 right-0 -mt-20 animate-bounce">
              <div className="mx-auto max-w-md p-4 bg-red-950/90 border-2 border-red-500 rounded-lg shadow-2xl shadow-red-500/50 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-2xl animate-pulse">Warning</span>
                  <div className="text-red-400 font-mono text-sm leading-tight">
                    <p className="text-red-300 font-bold">[ ACCESS DENIED ]</p>
                    <p>&gt; {errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className='relative'>
            <div className='absolute inset-0 bg-green-500 blur-2xl opacity-10'></div>
            <div className='relative bg-black/90 backdrop-blur-sm p-8 rounded-lg border-2 border-green-500/50 shadow-2xl shadow-green-500/20'>

              {/* Terminal Header */}
              <div className='flex items-center gap-2 mb-6 pb-4 border-b border-green-500/30'>
                <div className='flex gap-1.5'>
                  <div className='w-3 h-3 rounded-full bg-red-500/80'></div>
                  <div className='w-3 h-3 rounded-full bg-yellow-500/80'></div>
                  <div className='w-3 h-3 rounded-full bg-green-500/80'></div>
                </div>
                <span className='text-green-500 font-mono text-sm ml-2'>authentication.sh</span>
              </div>

              <div className='mb-6'>
                <h2 className='text-2xl font-bold text-green-500 mb-2 font-mono'>&gt; Account_Login</h2>
                <p className='text-green-400/70 text-sm font-mono'>// Welcome Back!</p>
              </div>

              {/* Social Buttons */}
              <div className='space-y-3 mb-6'>
                <button className='w-full flex items-center justify-center gap-3 bg-green-950/30 hover:bg-green-950/50 border border-green-500/50 hover:border-green-500 text-green-400 font-mono py-3 px-4 rounded transition-all duration-300 shadow-md shadow-green-500/10 hover:shadow-green-500/30'>
                  <svg className='w-5 h-5' viewBox='0 0 24 24'><path fill='currentColor' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/><path fill='currentColor' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/><path fill='currentColor' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/><path fill='currentColor' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/></svg>
                  <span>OAuth :: Google</span>
                </button>
                <button className='w-full flex items-center justify-center gap-3 bg-green-950/30 hover:bg-green-950/50 border border-green-500/50 hover:border-green-500 text-green-400 font-mono py-3 px-4 rounded transition-all duration-300 shadow-md shadow-green-500/10 hover:shadow-green-500/30'>
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/></svg>
                  <span>OAuth :: Facebook</span>
                </button>
              </div>

              <div className='relative mb-6'>
                <div className='absolute inset-0 flex items-center'><div className='w-full border-t border-green-500/30'></div></div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-black text-green-500/70 font-mono'>-- OR MANUAL AUTH --</span>
                </div>
              </div>

              {/* Form */}
              <div className='space-y-4'>
                <div>
                  <label htmlFor="email" className='text-green-500 mb-2 block text-sm font-mono'>&gt; email_address_</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <svg className='w-5 h-5 text-green-500/50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                      </svg>
                    </div>
                    <input
                      type='email' id='email' value={formData.email} onChange={handleChange}
                      placeholder='user@domain.tld'
                      className='w-full pl-10 pr-4 py-3 bg-black/50 border border-green-500/50 rounded text-green-400 placeholder-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className='text-green-500 mb-2 block text-sm font-mono'>&gt; secure_password_</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <svg className='w-5 h-5 text-green-500/50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                      </svg>
                    </div>
                    <input
                      type='password' id='password' value={formData.password} onChange={handleChange}
                      placeholder='****************'
                      className='w-full pl-10 pr-4 py-3 bg-black/50 border border-green-500/50 rounded text-green-400 placeholder-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono'
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className='w-full relative bg-green-500 hover:bg-green-600 disabled:bg-green-950/50 disabled:cursor-not-allowed text-black font-bold py-3 rounded transition-all duration-300 shadow-lg shadow-green-500/50 hover:shadow-green-500/75 font-mono uppercase tracking-wider'
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      EXECUTING AUTH...
                    </span>
                  ) : (
                    '[ Execute Sign In ]'
                  )}
                </button>
              </div>
              <div className='mt-6 text-center'>
                <p className='text-green-500/70 text-sm font-mono'>
                  New User?{' '}
                  <Link
                    to="/sign-up"
                    className='text-green-400 hover:text-green-300 font-medium transition-colors underline'
                  >
                    Register_Here
                  </Link>
                </p>
              </div>
              <div className='mt-6 pt-6 border-t border-green-500/30'>
                <p className='text-xs text-green-500/50 text-center font-mono'>
                  // Terms of Service | Privacy Policy | GDPR Compliant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}