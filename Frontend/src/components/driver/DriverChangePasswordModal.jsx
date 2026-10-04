import { useState } from "react";
import api from '../../services/api.js';
import useAuth from '../../hooks/useAuth';

export default function DriverChangePasswordModal({ isOpen, onClose }) {
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    try {
      setLoading(true);
      await api.put('/driver/change-password', { currentPassword, newPassword });
      alert('Password changed. Please sign in with your new password.');
      onClose();
      logout();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-[24px] p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">🔒</div>
          <div>
            <h2 className="text-white font-bold text-lg">Change Password</h2>
            <p className="text-zinc-400 text-xs">You must change temp password</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-zinc-400 text-xs">Current / Temp Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500"
              placeholder="Enter temp password from email"
            />
          </div>
          <div>
            <label className="text-zinc-400 text-xs">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white"
              placeholder="Min 8 characters"
            />
          </div>
          <div>
            <label className="text-zinc-400 text-xs">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white"
              placeholder="Confirm new password"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-200 transition disabled:opacity-50 mt-2"
          >
            {loading ? "Changing..." : "Update Password & Continue"}
          </button>
        </form>

        <p className="text-zinc-600 text-[11px] text-center mt-4">
          ⚠️ After change you will be logged out to login with new password
        </p>
      </div>
    </div>
  );
}