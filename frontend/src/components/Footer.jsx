export default function Footer() {
  return (
    <footer className='relative w-full border-t border-green-500/50 bg-black backdrop-blur-sm py-6'>
      <div className='max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-green-400 font-mono text-sm'>

        {/* Left Side - System Log Style */}
        <div className='mb-4 md:mb-0 text-left flex-1'>
          <p className='text-green-400/90'>
            <span className='text-green-300'>&gt;</span> Connection: <span className='text-green-500 animate-pulse'>stable</span><br />
            <span className='text-green-300'>&gt;</span> Last login: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Center - Brand Signature */}
        <div className='flex flex-col items-center flex-1'>
          <p className='text-green-400 font-semibold text-lg tracking-wide text-center'>
            !Safe<span className='text-green-300'>Blog</span>
          </p>
          <p className='text-xs text-green-500/70 text-center'>© {new Date().getFullYear()} All Rights Reserved</p>
        </div>

        {/* Right Side - Quick Links */}
        <div className='mt-4 md:mt-0 text-right flex-1 space-y-1'>
          <p className='text-green-400/90 hover:text-green-300 cursor-pointer transition-colors'>
            [ Docs ]
          </p>
          <p className='text-green-400/90 hover:text-green-300 cursor-pointer transition-colors'>
            [ GitHub ]
          </p>
          <p className='text-green-400/90 hover:text-green-300 cursor-pointer transition-colors'>
            [ Support ]
          </p>
        </div>
      </div>

      {/* Animated glowing line */}
      <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500/0 via-green-500/80 to-green-500/0 animate-pulse'></div>

      {/* CSS-only subtle background animation */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute inset-0 bg-green-500/5 animate-[footerGlow_3s ease-in-out infinite]'></div>
      </div>

      <style jsx>{`
        @keyframes footerGlow {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </footer>
  )
}
