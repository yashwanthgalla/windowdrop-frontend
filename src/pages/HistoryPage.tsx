import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Folder,
  File,
  Shield,
  RefreshCw,
  User,
  ArrowUpFromLine,
  ArrowDownToLine,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { apiClient } from '../api/client';
import type { HistoryEntry } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { formatBytes } from '../utils/fileHelpers';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuthStore();
  const [role, setRole] = useState<'sent' | 'received'>('sent');
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Auth requirement check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?next=/history');
    }
  }, [user, authLoading, navigate]);

  const loadHistory = useCallback(async (targetRole: 'sent' | 'received', cursor?: string) => {
    try {
      if (!cursor) {
        setIsLoading(true);
      } else {
        setLoadingMore(true);
      }
      const res = await apiClient.getHistory(targetRole, cursor, 20);
      if (!cursor) {
        setEntries(res.entries);
      } else {
        setEntries((prev) => [...prev, ...res.entries]);
      }
      setNextCursor(res.nextCursor);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      if (!cursor) setEntries([]);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    let active = true;
    apiClient
      .getHistory(role, undefined, 20)
      .then((res) => {
        if (!active) return;
        setEntries(res.entries);
        setNextCursor(res.nextCursor);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch history:', err);
        if (!active) return;
        setEntries([]);
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [role, user]);

  const handleRefresh = () => {
    loadHistory(role);
  };

  const handleLoadMore = () => {
    if (nextCursor) {
      loadHistory(role, nextCursor);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-[#0071E3]/10 dark:bg-[#0A84FF]/15 text-[#0071E3] dark:text-[#0A84FF] flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              Transfer History
            </h1>
          </div>
          <p className="text-sm text-[#6E6E73] dark:text-[#98989D]">
            File contents are never stored, only this log.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/')}
          >
            Transfer Hub
          </Button>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="flex items-center justify-between">
        <SegmentedControl
          options={[
            {
              value: 'sent',
              label: 'Sent Transfers',
              icon: <ArrowUpFromLine className="w-3.5 h-3.5" />,
            },
            {
              value: 'received',
              label: 'Received Transfers',
              icon: <ArrowDownToLine className="w-3.5 h-3.5" />,
            },
          ]}
          value={role}
          onChange={(val) => setRole(val as 'sent' | 'received')}
        />
        <span className="text-xs text-[#6E6E73] dark:text-[#98989D]">
          {entries.length} {entries.length === 1 ? 'record' : 'records'}
        </span>
      </div>

      {/* History List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      ) : entries.length === 0 ? (
        <Card variant="glass" className="text-center py-16 space-y-4">
          <Shield className="w-12 h-12 text-[#6E6E73] dark:text-[#98989D] mx-auto stroke-[1.5]" />
          <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            No {role === 'sent' ? 'Sent' : 'Received'} Transfers Found
          </h3>
          <p className="text-sm text-[#6E6E73] dark:text-[#98989D] max-w-sm mx-auto">
            Once you complete a file or folder transfer, metadata and verification records will appear here.
          </p>
          <Button variant="primary" size="md" onClick={() => navigate('/')}>
            Start a Transfer
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const isDelivered = entry.state === 'delivered';
            const isExpired = entry.state === 'expired';
            const isCancelled = entry.state === 'cancelled';

            return (
              <Card
                key={entry.id}
                variant="glass"
                className="p-5 hover:border-black/15 dark:hover:border-white/20 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.04] dark:border-white/[0.06] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs font-semibold">
                      <User className="w-4 h-4 text-[#0071E3] dark:text-[#0A84FF]" />
                    </div>
                    <div>
                      <span className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                        {role === 'sent' ? 'Sent to' : 'Received from'}
                      </span>
                      <h4 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                        {entry.counterpartName || 'Anonymous Guest'}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
                        isDelivered
                          ? 'bg-[#34C759]/10 text-[#34C759]'
                          : isExpired
                          ? 'bg-[#FF3B30]/10 text-[#FF3B30]'
                          : isCancelled
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-[#0071E3]/10 text-[#0071E3]'
                      }`}
                    >
                      {isDelivered && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isExpired && <Clock className="w-3.5 h-3.5" />}
                      {isCancelled && <ShieldAlert className="w-3.5 h-3.5" />}
                      <span className="capitalize">{entry.state}</span>
                    </span>

                    <span className="text-[#6E6E73] dark:text-[#98989D]">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6E6E73] dark:text-[#98989D]">
                  <div className="flex items-center gap-2 flex-wrap">
                    {entry.items && entry.items.length > 0 ? (
                      entry.items.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 font-mono text-[11px]"
                        >
                          {item.path.includes('/') ? (
                            <Folder className="w-3 h-3 text-[#0071E3]" />
                          ) : (
                            <File className="w-3 h-3 text-[#6E6E73]" />
                          )}
                          {item.name}
                        </span>
                      ))
                    ) : (
                      <span>Transfer package</span>
                    )}
                    {entry.items && entry.items.length > 3 && (
                      <span className="text-[11px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                        +{entry.items.length - 3} more
                      </span>
                    )}
                  </div>

                  <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Total: {formatBytes(entry.totalBytes)}
                  </span>
                </div>
              </Card>
            );
          })}

          {/* Load More Button */}
          {nextCursor && (
            <div className="pt-4 text-center">
              <Button
                variant="secondary"
                size="md"
                onClick={handleLoadMore}
                isLoading={loadingMore}
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      )}

      {/* DPDP Compliance Notice */}
      <div className="pt-8 text-center border-t border-black/[0.04] dark:border-white/[0.06]">
        <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
          For security and compliance with the Digital Personal Data Protection (DPDP) Act, IP address and approximate location metadata are retained for audit and fraud prevention. File payloads are destroyed immediately following delivery or expiration.
        </p>
      </div>
    </div>
  );
};
