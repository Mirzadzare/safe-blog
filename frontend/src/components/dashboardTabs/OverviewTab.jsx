import { useSelector } from "react-redux";

export default function OverviewTab() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {currentUser?.username}!
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Here's an overview of your account
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            {currentUser?.profilePicture ? (
              <img 
                src={currentUser.profilePicture} 
                alt="profile" 
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                {currentUser?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h3 className="font-bold text-slate-900">{currentUser?.username}</h3>
              <p className="text-sm text-slate-600">{currentUser?.email}</p>
            </div>
          </div>
          {currentUser?.isAdmin && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin
            </span>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Account Status</h3>
          <p className="text-emerald-100 text-sm mb-4">Your account is active and secure</p>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold">All systems operational</span>
          </div>
        </div>
      </div>
    </>
  );
}