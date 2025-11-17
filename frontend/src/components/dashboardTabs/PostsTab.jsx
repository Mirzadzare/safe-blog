import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  Edit3, 
  Trash2, 
  Loader2,
  FileText
} from 'lucide-react';

export default function PostsTab() {

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('desc');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const PER_PAGE = 12;
  const observer = useRef();

  const buildQuery = useCallback(() => {
    const q = new URLSearchParams();
    q.append('limit', PER_PAGE);
    q.append('startIndex', (page - 1) * PER_PAGE);
    q.append('order', sort);

    if (searchTerm) q.append('searchTerm', searchTerm);
    if (category) q.append('category', category);

    return q.toString();
  }, [page, sort, searchTerm, category]);

  const fetchPosts = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;

      try {
        setSearching(true);
        const res = await fetch(`/api/v1/posts?${buildQuery()}`);
        const data = await res.json();

        if (!res.ok || data.success === false)
          throw new Error(data.message);

        const newPosts = data.posts || [];

        setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
        setHasMore(newPosts.length === PER_PAGE);
      } catch (err) {
        toast.error(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
        setSearching(false);
      }
    },
    [buildQuery, hasMore]
  );

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(true);
  }, [searchTerm, category, sort]);

  const lastRef = useCallback(
    (node) => {
      if (loading || searching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, searching, hasMore]
  );

  useEffect(() => {
    if (page > 1) fetchPosts();
  }, [page]);

  const openDeleteModal = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      setDeleting(postToDelete._id);
      const res = await fetch(`/api/v1/posts/${postToDelete._id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setPosts((p) => p.filter((x) => x._id !== postToDelete._id));
      toast.success('Post deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeleting(null);
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };

  const debouncedSearch = useMemo(
    () => debounce((v) => setSearchTerm(v), 500),
    []
  );

  const onSearchChange = (e) => {
    const v = e.target.value;
    setSearchInput(v);
    debouncedSearch(v);
  };

  const LoadingSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden border border-slate-200">
          <div className="h-48 bg-slate-100 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
            <div className="flex gap-2 pt-3">
              <div className="h-9 bg-slate-100 rounded w-20 animate-pulse" />
              <div className="h-9 bg-slate-100 rounded w-20 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Delete Post Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-2">Delete Post?</h3>
            <p className="text-sm sm:text-base text-slate-600 text-center mb-2">
              Are you sure you want to delete <span className="font-semibold text-slate-900">"{postToDelete?.title}"</span>?
            </p>
            <p className="text-sm text-slate-500 text-center mb-6">
              This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPostToDelete(null);
                }}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Manage Posts</h2>
            <p className="text-slate-600 mt-1">{posts.length} posts total</p>
          </div>
          <button
            onClick={() => navigate('/create-post')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Post</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={searchInput}
                type="text"
                placeholder="Search posts..."
                onChange={onSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 
                         focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none cursor-pointer
                           hover:bg-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="">All Categories</option>
                  <option value="tech">Technology</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none cursor-pointer
                           hover:bg-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && posts.length === 0 && <LoadingSkeleton />}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
            <div className="inline-flex p-5 bg-slate-50 rounded-lg mb-4">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No posts found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || category 
                ? "Try adjusting your filters or search query" 
                : "Get started by creating your first post"}
            </p>
            <button
              onClick={() => navigate('/create-post')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Post
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {posts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <article
                key={post._id}
                ref={i === posts.length - 1 ? lastRef : null}
                onClick={() => navigate(`/post/${post.slug}`)}
                className="group bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {post.image ? (
                    <img
                      src={`${post.image}?tr=w_800,h_512,c_fill,g_auto,f_webp`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-6xl font-bold text-slate-300">
                        {post.title[0].toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors mb-3">
                    {post.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 font-medium capitalize">
                        {post.category}
                    </span>
                    
                    <time className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                    </time>
                    </div>
                </div>

                {/* Actions - Fixed to bottom */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-3">
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/update-post/${post._id}`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg font-medium transition-all"
                    >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                    </button>

                    <button
                    disabled={deleting === post._id}
                    onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(post);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {deleting === post._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4" />
                    )}
                    <span>{deleting === post._id ? 'Deleting...' : 'Delete'}</span>
                    </button>
                </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Loading More Indicator */}
        {searching && posts.length > 0 && (
          <div className="flex items-center justify-center gap-2 py-8 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">Loading more posts...</span>
          </div>
        )}

        {/* End Message */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium">
              You've reached the end
            </div>
          </div>
        )}
      </div>
    </>
  );
}