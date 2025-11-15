import { useState, useRef } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// TipTap Imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

// Custom Toolbar Button Component
const MenuButton = ({ onClick, active, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded hover:bg-slate-100 transition-all ${
      active ? 'bg-emerald-100 text-emerald-700' : 'text-slate-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

export default function CreatePost() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Form State
  const [postForm, setPostForm] = useState({
    title: '',
    category: '',
  });

  // Image Upload
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [publishLoading, setPublishLoading] = useState(false);

  // Categories
  const categories = [
    'Technology', 'Lifestyle', 'Travel', 'Food', 'Health',
    'Business', 'Entertainment', 'Sports', 'Education', 'Other'
  ];

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-96 p-4',
      },
    },
    onUpdate: ({ editor }) => {
      setPostForm(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Handlers
  const handleInputChange = (e) => {
    setPostForm({ ...postForm, [e.target.id]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setPostForm({ ...postForm, category: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublish = async () => {
    try {
      if (!postForm.title.trim()) return toast.error("Please enter a title");
      if (!editor?.getHTML().trim() || editor.getHTML() === '<p></p>') {
        return toast.error("Please enter post content");
      }

      setPublishLoading(true);

      const formData = new FormData();
      formData.append('title', postForm.title);
      formData.append('content', editor.getHTML());
      if (postForm.category){
        formData.append('category', postForm.category);
      }
      if (selectedFile){
        formData.append('image', selectedFile);
      }
      const res = await fetch("/api/v1/posts/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to create post.");
      }

      toast.success("Post published successfully!");
      
      // Reset
      setPostForm({ title: '', category: '' });
      editor?.commands.clearContent();
      setImagePreview(null);
      setSelectedFile(null);

      setTimeout(() => navigate(`/post/${data.post.slug || data.post._id}`), 1500);
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setPublishLoading(false);
    }
  };

  if (!currentUser?.isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Create New Post
          </h1>
          <p className="text-slate-600">Share your thoughts with the world</p>
        </div>

        {/* Main Form */}
        <div className="space-y-6">
          {/* Title & Category */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
                  Post Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={postForm.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                  placeholder="Enter an engaging title..."
                  maxLength={100}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {postForm.title.length}/100 characters
                </p>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={postForm.category}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Cover Image</h2>
            
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Cover preview" 
                  className="w-full h-64 object-cover rounded-lg border-2 border-slate-200"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all"
              >
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-700 font-semibold mb-1">Click to upload cover image</p>
                  <p className="text-sm text-slate-500">PNG, JPG or GIF (max 5MB)</p>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Content Editor with Toolbar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Post Content</h2>

            {/* Toolbar */}
            {editor && (
              <div className="flex flex-wrap gap-1 p-3 bg-slate-50 border-b border-slate-200 mb-4 rounded-t-lg">
                {/* Heading */}
                <select
                  className="px-2 py-1 text-sm rounded bg-white border border-slate-300"
                  onChange={(e) => editor.chain().focus().toggleHeading({ level: parseInt(e.target.value) }).run()}
                  value={editor.isActive('heading', { level: 1 }) ? 1 : editor.isActive('heading', { level: 2 }) ? 2 : 0}
                >
                  <option value="0">Normal Text</option>
                  <option value="1">Heading 1</option>
                  <option value="2">Heading 2</option>
                  <option value="3">Heading 3</option>
                </select>

                <div className="w-px bg-slate-300 mx-2" />

                {/* Text Style */}
                <MenuButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  active={editor.isActive('bold')}
                >
                  <strong>B</strong>
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  active={editor.isActive('italic')}
                >
                  <em>I</em>
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  active={editor.isActive('strike')}
                >
                  S
                </MenuButton>

                <div className="w-px bg-slate-300 mx-2" />

                {/* Lists */}
                <MenuButton
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  active={editor.isActive('bulletList')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  active={editor.isActive('orderedList')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </MenuButton>

                <div className="w-px bg-slate-300 mx-2" />

                {/* Link */}
                <MenuButton
                  onClick={() => {
                    const url = window.prompt('URL');
                    if (url) editor.chain().focus().setLink({ href: url }).run();
                  }}
                  active={editor.isActive('link')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </MenuButton>

                {/* Clear */}
                <MenuButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                  Clear
                </MenuButton>
              </div>
            )}

            {/* Editor */}
            <div className="border border-slate-200 rounded-b-lg overflow-hidden">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              disabled={publishLoading}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {publishLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Publish Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}