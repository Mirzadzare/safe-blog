import { useState, useRef } from 'react';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserStart, deleteUserSuccess, deleteUserFailure, updateUserSuccess } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function AccountTab() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(currentUser?.profilePicture || null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [accountForm, setAccountForm] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
  });

  const handleAccountChange = (e) => {
    setAccountForm({ ...accountForm, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAccount = async () => {
    try {
      setUpdateLoading(true);

      const formData = new FormData();
      formData.append('username', accountForm.username);
      if (selectedFile) formData.append('image', selectedFile);

      const res = await fetch("/api/v1/users/profile", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to update account.");
      }

      dispatch(updateUserSuccess({
        username: data.user.username,
        profilePicture: data.user.profilePicture,
      }));

      if (data.user.profilePicture) {
        setImagePreview(data.user.profilePicture);
      }
      
      toast.success("Account updated successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      dispatch(deleteUserStart());
      const res = await fetch("/api/v1/users", { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        dispatch(deleteUserSuccess());
        toast.success('Account deleted successfully!');
        setTimeout(() => navigate('/sign-in'), 2000);
      } else {
        throw new Error(data.message || 'Failed to delete account');
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message || 'Failed to delete account.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-2">Delete Account?</h3>
            <p className="text-sm sm:text-base text-slate-600 text-center mb-6">
              Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
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

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
        <p className="text-sm sm:text-base text-slate-600">
          Manage your profile information and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Profile Picture</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-slate-100">
                  {currentUser?.username?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold text-slate-900 mb-1">Change Avatar</h3>
              <p className="text-sm text-slate-600 mb-3">JPG, PNG or GIF. Max 2MB.</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all text-sm"
              >
                Upload New Photo
              </button>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={accountForm.username}
                onChange={handleAccountChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={accountForm.email}
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-200 text-slate-600 text-xs font-semibold rounded">
                  Not Editable
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed for security reasons</p>
            </div>

            <button
              onClick={handleUpdateAccount}
              disabled={updateLoading}
              className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {updateLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">Delete Account</h3>
              <p className="text-sm text-red-700 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={deleteLoading}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}