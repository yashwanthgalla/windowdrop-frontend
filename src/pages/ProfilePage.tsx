import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Mail,
  Calendar,
  ShieldCheck,
  AlertCircle,
  ArrowUpFromLine,
  ArrowDownToLine,
  HardDrive,
  Edit3,
  CheckCircle2,
  Clock,
  Folder,
  File,
  X,
  RefreshCw,
} from 'lucide-react';
import { apiClient, type ProfileResponse, type HistoryEntry } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { formatBytes } from '../utils/fileHelpers';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [historyRole, setHistoryRole] = useState<'sent' | 'received'>('sent');
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?next=/profile');
    }
  }, [user, authLoading, navigate]);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.getProfile();
      setProfile(data);
      setEditDisplayName(data.displayName || '');
      setEditUsername(data.username || '');
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async (role: 'sent' | 'received') => {
    try {
      setHistoryLoading(true);
      const res = await apiClient.getHistory(role, undefined, 20);
      setHistoryEntries(res.entries);
    } catch (err) {
      console.error('Failed to load history:', err);
      setHistoryEntries([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    let active = true;
    apiClient
      .getProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setEditDisplayName(data.displayName || '');
        setEditUsername(data.username || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    apiClient
      .getHistory(historyRole, undefined, 20)
      .then((res) => {
        if (!active) return;
        setHistoryEntries(res.entries);
        setHistoryLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load history:', err);
        if (active) {
          setHistoryEntries([]);
          setHistoryLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [user, historyRole]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await apiClient.updateProfile({
        displayName: editDisplayName,
        username: editUsername,
      });
      setProfile(updated);
      setEditOpen(false);
      showToast('Profile updated successfully', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || (loading && !profile)) {
    return (
      <div className="w-full py-8 space-y-6">
        <div className="h-48 rounded-[24px] bg-black/[0.04] dark:bg-white/[0.04] animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="w-full py-6 space-y-8 animate-fadeIn">
      {/* Profile Header Glass Banner */}
      <div className="relative overflow-hidden rounded-[28px] border border-black/[0.08] dark:border-white/[0.12] bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl p-6 sm:p-10 shadow-apple-card">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-[#0071E3]/20 to-[#34C759]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar and Info */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#0071E3] to-[#0A84FF] text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-[#0071E3]/25 flex-shrink-0">
              {profile?.displayName ? (
                profile.displayName.charAt(0).toUpperCase()
              ) : (
                <UserIcon className="w-10 h-10" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                  {profile?.displayName}
                </h1>
                {profile?.username && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-black/[0.05] dark:bg-white/[0.08] text-[#0071E3] dark:text-[#0A84FF]">
                    @{profile.username}
                  </span>
                )}
                {profile?.emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" /> Unverified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D]">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" /> {profile?.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Joined {memberSince}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={() => {
                loadProfile();
                loadHistory(historyRole);
              }}
            >
              Refresh
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={<Edit3 className="w-4 h-4" />}
              onClick={() => setEditOpen(true)}
            >
              Edit Profile
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              leftIcon={<ArrowUpFromLine className="w-4 h-4" />}
              onClick={() => navigate('/')}
            >
              Transfer Hub
            </Button>
          </div>
        </div>
      </div>

      {/* Grid: Plan Badge & Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Account Tier Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">
              Account Tier
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#34C759]/10 text-[#34C759] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Free & Unlimited
            </h4>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1">
              Full transfer speed & folder sharing
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.05] text-xs text-[#34C759] font-medium">
            Active Community Access
          </div>
        </Card>

        {/* Sent Transfers */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">
              Total Sent
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <ArrowUpFromLine className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {profile?.stats.sentCount || 0}
            </h4>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1">
              Packages created and shared
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.05] text-xs text-[#6E6E73] dark:text-[#98989D]">
            Payloads auto-purged on receipt
          </div>
        </Card>

        {/* Received Transfers */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">
              Total Received
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#34C759]/10 text-[#34C759] flex items-center justify-center">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {profile?.stats.receivedCount || 0}
            </h4>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1">
              Single-use packages decrypted
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.05] text-xs text-[#6E6E73] dark:text-[#98989D]">
            Decrypted directly in transit
          </div>
        </Card>

        {/* Total Bandwidth */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">
              Data Transferred
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {formatBytes((profile?.stats.totalSentBytes || 0) + (profile?.stats.totalReceivedBytes || 0))}
            </h4>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1">
              Combined upload & download
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.05] text-xs text-[#6E6E73] dark:text-[#98989D]">
            Zero permanent storage
          </div>
        </Card>
      </div>

      {/* Embedded Activity & Transfer History Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              Transfer Audit Log
            </h3>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
              File names and metadata retained for audit. Payload contents are destroyed immediately.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-[12px] bg-black/[0.04] dark:bg-white/[0.06] p-1 border border-black/[0.05] dark:border-white/[0.08]">
              <button
                type="button"
                onClick={() => setHistoryRole('sent')}
                className={`px-3 py-1.5 rounded-[9px] text-xs font-semibold transition-all ${
                  historyRole === 'sent'
                    ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-[#0071E3] dark:text-[#0A84FF]'
                    : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F]'
                }`}
              >
                Sent History
              </button>
              <button
                type="button"
                onClick={() => setHistoryRole('received')}
                className={`px-3 py-1.5 rounded-[9px] text-xs font-semibold transition-all ${
                  historyRole === 'received'
                    ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-[#0071E3] dark:text-[#0A84FF]'
                    : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F]'
                }`}
              >
                Received History
              </button>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => loadHistory(historyRole)}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* History List */}
        {historyLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : historyEntries.length === 0 ? (
          <Card className="p-12 text-center">
            <Clock className="w-10 h-10 text-[#6E6E73] mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              No {historyRole} transfers recorded
            </h4>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1 max-w-sm mx-auto">
              {historyRole === 'sent'
                ? 'Packages you upload and seal with an 8-character single-use code will appear here.'
                : 'Packages you claim and download using a transfer code will appear here.'}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {historyEntries.map((entry) => (
              <Card key={entry.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
                      {entry.counterpartName ? `${entry.counterpartName}` : 'Anonymous Peer'}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        entry.state === 'delivered'
                          ? 'bg-[#34C759]/10 text-[#34C759]'
                          : entry.state === 'expired'
                          ? 'bg-black/[0.06] dark:bg-white/[0.08] text-[#6E6E73]'
                          : 'bg-[#0071E3]/10 text-[#0071E3]'
                      }`}
                    >
                      {entry.state}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6E73] dark:text-[#98989D]">
                    {entry.items && entry.items.length > 0 ? (
                      entry.items.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.05] px-2 py-0.5 rounded-md">
                          {item.path.includes('/') ? (
                            <Folder className="w-3 h-3 text-[#0071E3]" />
                          ) : (
                            <File className="w-3 h-3" />
                          )}
                          {item.name}
                        </span>
                      ))
                    ) : (
                      <span>Transfer payload</span>
                    )}
                    {entry.items && entry.items.length > 3 && (
                      <span className="text-[11px] font-semibold">+{entry.items.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 text-right flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.04] dark:border-white/[0.06]">
                  <div>
                    <span className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7] block">
                      {formatBytes(entry.totalBytes)}
                    </span>
                    <span className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {entry.state === 'delivered' && (
                    <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <dialog
          open
          aria-labelledby="edit-profile-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-md w-full h-full max-w-none max-h-none border-0 m-0"
        >
          <button
            type="button"
            className="fixed inset-0 w-full h-full cursor-default bg-transparent"
            onClick={() => setEditOpen(false)}
            aria-label="Close edit profile dialog"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-[24px] bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 id="edit-profile-title" className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Edit Profile
              </h3>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="p-1 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label
                  htmlFor="profile-display-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="profile-display-name"
                  type="text"
                  required
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-[14px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.12] text-sm outline-none focus:border-[#0071E3]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-username"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] mb-1.5"
                >
                  Username (@)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-[#6E6E73] font-mono text-sm">@</span>
                  <input
                    id="profile-username"
                    type="text"
                    required
                    pattern="^[a-zA-Z0-9_]{3,30}$"
                    title="3-30 alphanumeric characters or underscore"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().trim())}
                    className="w-full h-11 pl-8 pr-3.5 rounded-[14px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.12] text-sm font-mono outline-none focus:border-[#0071E3]"
                  />
                </div>
                <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-1">
                  Alphanumeric and underscores only (3-30 characters)
                </p>
              </div>

              <div className="flex gap-3 pt-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setEditOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSaving}
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </dialog>
      )}
    </div>
  );
};
