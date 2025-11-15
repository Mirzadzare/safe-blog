import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AccountTab from "../components/dashboardTabs/AccountTab";
import SecurityTab from "../components/dashboardTabs/SecurityTab";
import PostsTab from "../components/dashboardTabs/PostsTab";
import OverviewTab from "../components/dashboardTabs/OverviewTab";
import UsersTab from "../components/dashboardTabs/UsersTab";

const VALID_TABS = ["overview", "home", "account", "security", "posts", "users"];

export default function Overview() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get("tab");

  // Get valid tab from URL
  const getValidTab = () => {
    const tab = urlTab?.toLowerCase();
    if (tab && VALID_TABS.includes(tab)) {
      if (tab === "posts" && !currentUser?.isAdmin) return "overview"
      if (tab === "users" && !currentUser?.isAdmin) return "overview";
      return tab;
    }
    return "overview";
  };

  const [activeTab, setActiveTab] = useState(getValidTab);

  // Sync URL → active tab
  useEffect(() => {
    const validTab = getValidTab();
    if (validTab !== activeTab) {
      setActiveTab(validTab);
    }
  }, [urlTab, currentUser?.isAdmin]);

  // Sync active tab → URL
  useEffect(() => {
    const currentUrlTab = searchParams.get("tab");
    if (currentUrlTab !== activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, [activeTab, searchParams, setSearchParams]);

  const switchTab = (tab) => {
    if (tab === "posts" && !currentUser?.isAdmin) return;
    setActiveTab(tab);
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/v1/users/signout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Sign out failed");

      dispatch(signOut());
      toast.success("Signed out successfully!");
      window.location.href = "/sign-in";
    } catch {
      toast.error("Could not sign out. Try again.");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: "account",   label: "Account",   icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "security",  label: "Security",  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  ];

  const adminTab = currentUser?.isAdmin
    ? [{ id: "posts", label: "Posts", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" }]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-4 lg:p-6">
          <div className="lg:sticky lg:top-6">
            <nav className="space-y-1">
              {[...tabs, ...adminTab].map((t) => (
                <button
                  key={t.id}
                  onClick={() => switchTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === t.id
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
                  </svg>
                  <span className="block sm:inline">{t.label}</span>
                </button>
              ))}

              <div className="border-t border-slate-200 my-2" />

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="block sm:inline">Sign Out</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {activeTab === "overview" && <OverviewTab />} 
            {activeTab === "account" && <AccountTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "posts" && currentUser?.isAdmin && <PostsTab />}
            {activeTab === "users" && currentUser?.isAdmin && <UsersTab />}
          </div>
        </main>
      </div>
    </div>
  );
}