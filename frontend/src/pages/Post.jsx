import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// ============================================================================
// CONSTANTS
// ============================================================================
const COMMENT_MAX_LENGTH = 200;
const RECENT_POSTS_LIMIT = 3;

// ============================================================================
// COMPONENTS
// ============================================================================
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    Back
  </button>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="flex flex-col items-center gap-3">
      <svg className="animate-spin h-12 w-12 text-emerald-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-slate-600 text-lg">Loading post...</p>
    </div>
  </div>
);

const CategoryBadge = ({ category }) => (
  <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full mb-4">
    {category}
  </span>
);

const PostMeta = ({ createdAt, contentLength }) => (
  <div className="flex items-center gap-4 text-white/70 text-sm">
    <span>
      {new Date(createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}
    </span>
    <span>•</span>
    <span>{Math.ceil(contentLength / 1000)} min read</span>
  </div>
);

const SignInPrompt = () => (
  <div className="mb-8 p-6 bg-slate-50 rounded-lg border-2 border-slate-200 text-center">
    <p className="text-slate-600 mb-3">Please sign in to leave a comment</p>
    <Link
      to="/sign-in"
      className="inline-block px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all"
    >
      Sign In
    </Link>
  </div>
);

const CommentForm = ({ currentUser, commentText, setCommentText, onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="mb-8">
    <div className="flex items-start gap-4">
      <img
        src={currentUser.profilePicture}
        alt={currentUser.username}
        className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 flex-shrink-0"
      />
      <div className="flex-1">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
          rows="3"
          maxLength={COMMENT_MAX_LENGTH}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-500">
            {commentText.length}/{COMMENT_MAX_LENGTH} characters
          </span>
          <button
            type="submit"
            disabled={loading || !commentText.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>
    </div>
  </form>
);

const CommentEditForm = ({ text, setText, onSave, onCancel }) => (
  <div className="mb-3">
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
      rows="3"
      maxLength={COMMENT_MAX_LENGTH}
    />
    <div className="flex items-center justify-between mt-2">
      <span className="text-xs text-slate-500">
        {text.length}/{COMMENT_MAX_LENGTH} characters
      </span>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!text.trim()}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

const CommentItem = ({
  comment,
  currentUser,
  postUserId,
  onLike,
  onShowLikes,
  onEdit,
  onDelete,
  isEditing,
  editText,
  setEditText,
  onSaveEdit,
  onCancelEdit,
}) => {
  const { user } = comment; // Already populated by backend
  const isAuthor = user?._id === postUserId;
  const isOwner = currentUser?._id === user?._id;
  const isLiked = comment.likes?.includes(currentUser?._id);

  if (!user) {
    return (
      <div className="flex gap-4 pb-6 border-b border-slate-200 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-slate-200" />
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 pb-6 border-b border-slate-200 last:border-0">
      <img
        src={user.profilePicture}
        alt={user.username}
        className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900">{user.username}</span>
              {isAuthor && (
                <span className="inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Author
                </span>
              )}
              {user.isAdmin && (
                <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  Admin
                </span>
              )}
            </div>
            <span className="text-sm text-slate-500">
              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              {comment.createdAt !== comment.updatedAt && (
                <span className="ml-2 text-slate-400">(edited)</span>
              )}
            </span>
          </div>
        </div>

        {isEditing ? (
          <CommentEditForm
            text={editText}
            setText={setEditText}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
          />
        ) : (
          <p className="text-slate-700 mb-3 break-words">{comment.content}</p>
        )}

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={onLike}
            disabled={!currentUser}
            className={`flex items-center gap-1.5 text-sm ${
              isLiked
                ? 'text-emerald-600 font-semibold'
                : 'text-slate-500 hover:text-emerald-600'
            } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg
              className="w-5 h-5"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            <span>{comment.numberOfLikes || comment.likes?.length || 0}</span>
          </button>

          {comment.likes?.length > 0 && (
            <button
              onClick={onShowLikes}
              className="text-sm text-slate-500 hover:text-emerald-600 transition-colors"
            >
              View likes
            </button>
          )}

          {isOwner && !isEditing && (
            <button
              onClick={onEdit}
              className="text-sm text-slate-600 hover:text-emerald-600 transition-colors font-medium"
            >
              Edit
            </button>
          )}

          {(isOwner || currentUser?.isAdmin) && (
            <button
              onClick={onDelete}
              className="text-sm text-red-600 hover:text-red-700 transition-colors font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyComments = () => (
  <div className="text-center py-12">
    <svg
      className="w-16 h-16 text-slate-300 mx-auto mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
    <p className="text-slate-600">No comments yet. Be the first to comment!</p>
  </div>
);

const LikesModal = ({ show, onClose, users }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Liked by {users.length} {users.length === 1 ? 'person' : 'people'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900 truncate">{user.username}</h4>
                    {user.isAdmin && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                </div>
                <Link
                  to={`/user/${user._id}`}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all"
                  onClick={onClose}
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentArticle = ({ post }) => (
  <Link
    to={`/post/${post.slug || post._id}`}
    className="group block mb-4 last:mb-0"
  >
    <div className="flex gap-3">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1">
          {post.title}
        </h4>
        <p className="text-xs text-slate-500">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  </Link>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function Post() {
  const { postSlug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [selectedCommentLikes, setSelectedCommentLikes] = useState([]);

  // FETCH POST
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/posts?slug=${postSlug}`);
        const data = await res.json();

        if (!res.ok || !data.posts?.[0]) {
          toast.error('Post not found');
          navigate('/');
          return;
        }
        setPost(data.posts[0]);
      } catch (error) {
        toast.error('Failed to load post');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug, navigate]);

  // FETCH RECENT POSTS
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/v1/posts?limit=${RECENT_POSTS_LIMIT}`);
        const data = await res.json();
        if (res.ok) setRecentPosts(data.posts || []);
      } catch (error) {
        console.error('Failed to fetch recent posts:', error);
      }
    };
    fetchRecentPosts();
  }, []);

  // FETCH COMMENTS
  useEffect(() => {
    if (!post?._id) return;

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/v1/comment/${post._id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setComments(data.comments || []);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    fetchComments();
  }, [post?._id]);

  // CREATE COMMENT
  const handleSubmitComment = useCallback(async (e) => {
  e.preventDefault();
  if (!currentUser || !post?._id || !commentText.trim()) return;

  try {
    setCommentLoading(true);
    const res = await fetch('/api/v1/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: commentText,
        postId: post._id,
        userId: currentUser._id,
      }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Use root-level data (due to ..._doc spread)
      // OR use data.comment — both work
      const newComment = data.comment || data;

      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      toast.success('Comment added!');
    } else {
      toast.error(data.message || 'Failed to add comment');
    }
  } catch (error) {
    console.error('Submit error:', error);
    toast.error('Network error');
  } finally {
    setCommentLoading(false);
  }
}, [currentUser, commentText, post?._id]);

  // LIKE COMMENT
  const handleLikeComment = useCallback(async (commentId) => {
    if (!currentUser) return toast.error('Sign in to like');

    try {
      const res = await fetch(`/api/v1/comment/like/${commentId}`, { method: 'PUT' });
      const { likes, numberOfLikes, isLiked } = await res.json();

      if (res.ok) {
        setComments(comments.map(c =>
          c._id === commentId
            ? { ...c, likes, numberOfLikes, isLiked }
            : c
        ));
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  }, [currentUser, comments]);

  // DELETE COMMENT
  const handleDeleteComment = useCallback(async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const res = await fetch(`/api/v1/comment/delete/${commentId}`, { method: 'DELETE' });
      if (res.ok) {
        setComments(comments.filter(c => c._id !== commentId));
        toast.success('Comment deleted');
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  }, [comments]);

  // EDIT COMMENT
  const handleEditComment = useCallback((comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.content);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingCommentId(null);
    setEditCommentText('');
  }, []);

  const handleUpdateComment = useCallback(async (commentId) => {
  if (!editCommentText.trim() || editCommentText.length > COMMENT_MAX_LENGTH) {
    toast.error(`Comment must be 1–${COMMENT_MAX_LENGTH} characters`);
    return;
  }

  try {
    const res = await fetch(`/api/v1/comment/edit/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editCommentText.trim() }),
    });

    const data = await res.json();

    if (res.ok && data.success && data.comment) {
      // Normalize: map userId → user, add numberOfLikes
      const updatedComment = {
        ...data.comment,
        user: data.comment.userId, // ← Critical fix
        numberOfLikes: data.comment.likes?.length || 0,
        likes: data.comment.likes || [],
      };

      // Update comments array
      setComments(prev =>
        prev.map(c => (c._id === commentId ? updatedComment : c))
      );

      // EXIT EDIT MODE IMMEDIATELY
      setEditingCommentId(null);
      setEditCommentText('');
      toast.success('Comment updated!');

    } else {
      toast.error(data.message || 'Failed to update');
    }
  } catch (error) {
    console.error('Update error:', error);
    toast.error('Network error');
  }
}, [editCommentText]);

  // SHOW LIKES MODAL
  const handleShowLikes = useCallback((commentId) => {
    const comment = comments.find(c => c._id === commentId);
    if (!comment?.likes?.length) return;

    // Use pre-fetched user data from comment.user
    const likers = comment.likes.map(userId => {
      const commentWithUser = comments.find(c => c.user?._id === userId);
      return commentWithUser?.user || null;
    }).filter(Boolean);

    setSelectedCommentLikes(likers);
    setShowLikesModal(true);
  }, [comments]);

  // RENDER
  if (loading) return <LoadingSpinner />;
  if (!post) return null;

  const contentLength = post.content?.replace(/<[^>]*>/g, '').length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        {post.image && (
          <div className="absolute inset-0 opacity-20">
            <img src={post.image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <BackButton onClick={() => navigate(-1)} />
          {post.category && <CategoryBadge category={post.category} />}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
          <PostMeta createdAt={post.createdAt} contentLength={contentLength} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main */}
          <div className="lg:col-span-3">
            {post.image && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <img src={post.image} alt={post.title} className="w-full h-[500px] object-cover" />
              </div>
            )}

            <article className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-8">
              <div
                className="prose prose-xl max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-emerald-600 prose-strong:text-slate-900 prose-headings:font-bold"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Comments */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Comments ({comments.length})</h2>

              {currentUser ? (
                <CommentForm
                  currentUser={currentUser}
                  commentText={commentText}
                  setCommentText={setCommentText}
                  onSubmit={handleSubmitComment}
                  loading={commentLoading}
                />
              ) : (
                <SignInPrompt />
              )}

              <div className="space-y-6">
                {comments.length === 0 ? (
                  <EmptyComments />
                ) : (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      currentUser={currentUser}
                      postUserId={post.userId}
                      onLike={() => handleLikeComment(comment._id)}
                      onShowLikes={() => handleShowLikes(comment._id)}
                      onEdit={() => handleEditComment(comment)}
                      onDelete={() => handleDeleteComment(comment._id)}
                      isEditing={editingCommentId === comment._id}
                      editText={editCommentText}
                      setEditText={setEditCommentText}
                      onSaveEdit={() => handleUpdateComment(comment._id)}
                      onCancelEdit={handleCancelEdit}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Recent Articles */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Recent Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentPosts.map((p) => (
                  <Link key={p._id} to={`/post/${p.slug || p._id}`} className="group">
                    <div className="bg-slate-50 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-emerald-500 transition-all">
                      {p.image && <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />}
                      <div className="p-4">
                        {p.category && (
                          <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full mb-2">
                            {p.category}
                          </span>
                        )}
                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
                          {p.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                <p className="text-emerald-100 mb-6">Get the latest articles delivered to your inbox.</p>
                <Link to="/sign-up" className="inline-block px-8 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-all">
                  Subscribe Now
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Recent Articles
                </h3>
                <div className="space-y-4">
                  {recentPosts.map((p) => <RecentArticle key={p._id} post={p} />)}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Join Our Community</h3>
                <p className="text-emerald-100 mb-4 text-sm">Connect with fellow readers and writers.</p>
                <Link to="/sign-up" className="block w-full px-4 py-3 bg-white text-emerald-600 font-bold rounded-lg text-center hover:bg-emerald-50 transition-all">
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LikesModal show={showLikesModal} onClose={() => setShowLikesModal(false)} users={selectedCommentLikes} />
    </div>
  );
}