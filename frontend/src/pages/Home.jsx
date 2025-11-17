// src/pages/Home.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const PostCardSkeleton = () => (
  <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-pulse cursor-pointer">
    <div className="aspect-video bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-slate-200 rounded w-20" />
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-full" />
      <div className="h-4 bg-slate-200 rounded w-2/3" />
      <div className="flex justify-between">
        <div className="h-3 bg-slate-200 rounded w-24" />
        <div className="h-3 bg-slate-200 rounded w-16" />
      </div>
    </div>
  </div>
);

const PostCard = ({ post, onNavigate }) => {
  const navigate = useNavigate();
  const readTime = Math.ceil((post.content?.replace(/<[^>]*>/g, '').length || 0) / 1000);

  const handleClick = (e) => {
    e.preventDefault();
    onNavigate(`/post/${post.slug || post._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-emerald-500 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      role="article"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
    >
      {/* Image */}
      {post.image ? (
        <div className="aspect-video overflow-hidden bg-slate-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-3">
        {/* Category */}
        {post.category && (
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full transition-colors group-hover:bg-emerald-200">
            {post.category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed">
          {post.content?.replace(/<[^>]*>/g, '').substring(0, 130)}...
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <time dateTime={post.createdAt}>
            {format(new Date(post.createdAt), 'MMM d, yyyy')}
          </time>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime} min read
          </span>
        </div>
      </div>
    </div>
  );
};

const StatsBanner = ({ totalPosts, lastMonthPosts }) => (
  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-8 text-white overflow-hidden relative">
    <div className="absolute inset-0 bg-black opacity-10"></div>
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
      <div>
        <p className="text-emerald-100 text-sm font-medium">Total Articles</p>
        <p className="text-4xl font-bold mt-1">{totalPosts?.toLocaleString() || 0}</p>
      </div>
      <div>
        <p className="text-emerald-100 text-sm font-medium">This Month</p>
        <p className="text-4xl font-bold mt-1">+{lastMonthPosts || 0}</p>
      </div>
      <div className="flex items-center justify-center md:justify-end">
        <Link
          to="/create-post"
          className="px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg"
        >
          Write Now
        </Link>
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN HOME COMPONENT
// ============================================================================
export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.3 });
  const limit = 9;

  // Fetch posts
  const fetchPosts = useCallback(async (reset = false) => {
    const index = reset ? 0 : startIndex;
    const url = new URL('/api/v1/posts', window.location.origin);
    url.searchParams.append('startIndex', index);
    url.searchParams.append('limit', limit);
    url.searchParams.append('order', sortOrder);
    if (searchTerm) url.searchParams.append('searchTerm', searchTerm);
    if (category) url.searchParams.append('category', category);

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        const newPosts = data.posts || [];
        setPosts(prev => (reset ? newPosts : [...prev, ...newPosts]));
        setTotalPosts(data.totalPosts);
        setLastMonthPosts(data.lastMonthPosts);
        setHasMore(newPosts.length === limit);
        setStartIndex(index + newPosts.length);
      } else {
        toast.error('Failed to load posts');
      }
    } catch (error) {
        toast.error('Network error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [startIndex, searchTerm, category, sortOrder]);

  // Initial + filter reset
  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setStartIndex(0);
    fetchPosts(true);
  }, [searchTerm, category, sortOrder]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loadingMore && posts.length > 0) {
      setLoadingMore(true);
      fetchPosts();
    }
  }, [inView, hasMore, loadingMore, fetchPosts]);

  // Debounced search
  const debounceRef = useRef(null);
  const handleSearch = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchTerm(value), 500);
  };

  const handleNavigate = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  // Loading state
  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center">
              <div className="h-10 bg-slate-200 rounded w-80 mx-auto mb-4 animate-pulse" />
              <div className="h-5 bg-slate-200 rounded w-96 mx-auto animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Hero Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight">
            Discover <span className="text-emerald-600">Great Stories</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore ideas, insights, and inspiration from writers around the world.
          </p>
        </header>

        {/* Stats Banner */}
        <StatsBanner totalPosts={totalPosts} lastMonthPosts={lastMonthPosts} />

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search titles or content..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="">All Categories</option>
              <option value="tech">Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="travel">Travel</option>
              <option value="food">Food & Drink</option>
              <option value="business">Business</option>
            </select>

            <select
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
            >
              <option value="desc">Latest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Posts Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onNavigate={handleNavigate} />
          ))}
        </section>

        {/* Load More */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-12">
            {loadingMore ? (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full" />
                <p className="text-slate-600 font-medium">Loading more stories...</p>
              </div>
            ) : (
              <div className="h-10" />
            )}
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && !loading && (
          <div className="text-center py-24">
            <svg className="w-24 h-24 text-slate-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No posts found</h3>
            <p className="text-slate-600">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}