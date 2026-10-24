import React, { useMemo, useState, useEffect } from 'react';
import {
  Archive,
  FolderTree as FolderTreeIcon,
  List,
  CheckCircle2,
  Clock,
  Download,
  FolderDown,
  Check,
  User,
  XCircle,
  Loader2,
  Folder,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FolderTree } from '../../components/ui/FolderTree';
import { useTransferStore } from '../../store/useTransferStore';
import { useToastStore } from '../../store/useToastStore';
import {
  formatBytes,
  buildFolderTree,
  downloadBlob,
  isFileSystemAccessSupported,
  saveItemsToDirectory,
  getFileCategoryIcon,
} from '../../utils/fileHelpers';
import { apiClient } from '../../api/client';

export const PreviewStep: React.FC = () => {
  const {
    verifiedTransfer,
    receiverStatus,
    cancelReceiving,
  } = useTransferStore();
  const { showToast } = useToastStore();

  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [timeLeft, setTimeLeft] = useState<string>('15:00');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isSavingFolder, setIsSavingFolder] = useState<boolean>(false);
  const [folderSaveProgress, setFolderSaveProgress] = useState<{ current: number; total: number; name: string } | null>(null);

  const items = verifiedTransfer?.items;
  const files = useMemo(() => items || [], [items]);
  const totalSize = verifiedTransfer?.totalSize || 0;
  const transferId = verifiedTransfer?.transferId || '';
  const token = verifiedTransfer?.downloadToken || '';
  const packageName = verifiedTransfer?.originalFilename || 'package';

  const isSingleFile = files.length === 1;
  const singleFile = files[0];

  // Download window countdown
  useEffect(() => {
    if (!verifiedTransfer?.downloadExpiresAt) return;
    const target = new Date(verifiedTransfer.downloadExpiresAt).getTime();

    const updateTimer = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft('00:00');
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [verifiedTransfer?.downloadExpiresAt]);

  const hasFolders = useMemo(() => {
    return files.some((f) => f.path.includes('/'));
  }, [files]);

  const treeNodes = useMemo(() => {
    return buildFolderTree(
      files.map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        path: f.path,
        type: f.type,
      }))
    );
  }, [files]);

  // Mapping of downloaded status from polling
  const downloadedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    receiverStatus?.items.forEach((it) => {
      map[it.id] = it.downloaded;
    });
    return map;
  }, [receiverStatus]);

  const isDelivered = receiverStatus?.state === 'delivered';

  const handleDownloadSingle = async (itemId: string, itemName?: string) => {
    const item = files.find((f) => f.id === itemId);
    const fileName = itemName || item?.name || 'download';
    setDownloadingId(itemId);
    try {
      const blob = await apiClient.downloadItemAsBlob(transferId, itemId, token);
      downloadBlob(blob, fileName);
      showToast(`Downloaded ${fileName}`, 'success');
    } catch (err: any) {
      console.warn('Blob download fallback triggered:', err);
      // Fallback directly to browser link
      const url = apiClient.getItemDownloadUrl(transferId, itemId, token);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSaveToFolder = async (itemsToSave?: Array<typeof files[0]>) => {
    const targetItems = itemsToSave || files;
    if (targetItems.length === 0) return;

    if (!isFileSystemAccessSupported()) {
      showToast(
        'Direct folder save is available on Chromium browsers (Chrome/Edge). Downloading package archive instead.',
        'info'
      );
      handleDownloadZip();
      return;
    }

    setIsSavingFolder(true);
    setFolderSaveProgress({ current: 0, total: targetItems.length, name: targetItems[0].name });

    try {
      await saveItemsToDirectory(
        targetItems,
        (id) => apiClient.downloadItemAsBlob(transferId, id, token),
        (current, total, name) => {
          setFolderSaveProgress({ current, total, name });
        }
      );
      showToast(`Successfully saved ${targetItems.length} items directly to your folder!`, 'success');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User cancelled folder picker
        return;
      }
      console.error('Folder saving error:', err);
      showToast('Could not save folder directly. Downloading zip archive instead.', 'error');
      handleDownloadZip();
    } finally {
      setIsSavingFolder(false);
      setFolderSaveProgress(null);
    }
  };

  const handleDownloadAllFiles = async () => {
    setIsSavingFolder(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setFolderSaveProgress({ current: i + 1, total: files.length, name: item.name });
        const blob = await apiClient.downloadItemAsBlob(transferId, item.id, token);
        downloadBlob(blob, item.name);
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
      showToast('All files downloaded successfully in their original formats', 'success');
    } catch (err: any) {
      console.error('Multi-download error:', err);
      showToast('Error downloading files', 'error');
    } finally {
      setIsSavingFolder(false);
      setFolderSaveProgress(null);
    }
  };

  const handleDownloadZip = () => {
    const url = apiClient.getZipDownloadUrl(transferId, token);
    const cleanPackageName = packageName.replace(/\.zip$/i, '');
    const fileName = `${cleanPackageName}.zip`;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadedCount = receiverStatus?.items.filter((i) => i.downloaded).length || 0;
  const progressPercent = files.length > 0 ? Math.round((downloadedCount / files.length) * 100) : 0;

  const SingleFileIcon = isSingleFile ? getFileCategoryIcon(singleFile.name, singleFile.type) : Download;

  return (
    <div className="w-full space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#0071E3] dark:text-[#0A84FF]" />
            <h3 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              Package from {verifiedTransfer?.sender.displayName || 'Sender'}
            </h3>
          </div>
          <p className="text-sm text-[#6E6E73] dark:text-[#98989D] mt-0.5">
            {files.length} {files.length === 1 ? 'file' : 'files'} • {formatBytes(totalSize)}
            {hasFolders && ` • Folder: ${packageName}`}
          </p>
        </div>

        {/* Live Window Countdown & Delivered State */}
        <div className="flex items-center gap-3">
          {isDelivered ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34C759]/15 text-[#34C759] text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Delivered
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">
              <Clock className="w-3.5 h-3.5" />
              Download window: {timeLeft}
            </span>
          )}

          {hasFolders && (
            <div className="inline-flex p-1 bg-black/[0.04] dark:bg-white/[0.06] rounded-[10px]">
              <button
                type="button"
                onClick={() => setViewMode('tree')}
                className={`p-1.5 rounded-[8px] text-xs font-medium transition-colors ${
                  viewMode === 'tree'
                    ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-[#1D1D1F] dark:text-[#F5F5F7]'
                    : 'text-[#6E6E73] dark:text-[#98989D]'
                }`}
                aria-label="Folder tree view"
              >
                <FolderTreeIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-[8px] text-xs font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-[#1D1D1F] dark:text-[#F5F5F7]'
                    : 'text-[#6E6E73] dark:text-[#98989D]'
                }`}
                aria-label="Flat list view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delivered Success Banner */}
      {isDelivered && (
        <div className="p-4 rounded-2xl bg-[#34C759]/10 border border-[#34C759]/20 flex items-center gap-3 text-[#34C759]">
          <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-sm">Transfer successfully delivered!</p>
            <p className="opacity-90">All files have been decrypted and saved. Staging objects are purged from server.</p>
          </div>
        </div>
      )}

      {/* Real-time saving folder / multi-download progress banner */}
      {folderSaveProgress && (
        <div className="p-4 rounded-2xl bg-[#0071E3]/10 dark:bg-[#0A84FF]/10 border border-[#0071E3]/20 dark:border-[#0A84FF]/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#0071E3] dark:text-[#0A84FF] font-medium">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Writing files ({folderSaveProgress.current} of {folderSaveProgress.total})
            </span>
            <span>
              {Math.round((folderSaveProgress.current / folderSaveProgress.total) * 100)}%
            </span>
          </div>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] truncate">
            Saving: {folderSaveProgress.name}
          </p>
          <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#0071E3] dark:bg-[#0A84FF] transition-all duration-200 rounded-full"
              style={{ width: `${Math.round((folderSaveProgress.current / folderSaveProgress.total) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Progress Bar for server downloads */}
      {!isDelivered && files.length > 1 && !folderSaveProgress && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#6E6E73] dark:text-[#98989D]">
            <span>Download Progress ({downloadedCount} of {files.length} items)</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#0071E3] dark:bg-[#0A84FF] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* File List / Tree with Download Trigger Buttons */}
      <div className="max-h-[360px] overflow-y-auto pr-1 space-y-2">
        {hasFolders && viewMode === 'tree' ? (
          <FolderTree
            nodes={treeNodes}
            downloadingId={downloadingId}
            onDownloadItem={(id, name) => {
              const matching = files.find((f) => f.id === id || f.path === id || f.name === name);
              if (matching) {
                handleDownloadSingle(matching.id, matching.name);
              } else {
                handleDownloadSingle(id, name);
              }
            }}
            onDownloadFolder={(node) => {
              const matching = files.filter(
                (f) => f.path === node.path || f.path.startsWith(`${node.path}/`)
              );
              if (matching.length > 0) {
                handleSaveToFolder(matching);
              }
            }}
          />
        ) : (
          files.map((item) => {
            const isDownloaded = Boolean(downloadedMap[item.id]);
            const isItemDownloading = downloadingId === item.id;
            const ItemIcon = getFileCategoryIcon(item.name, item.type);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/5 dark:border-white/10 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 text-[#0071E3] dark:text-[#0A84FF]">
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                      {item.path} • {formatBytes(item.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isDownloaded ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#34C759] px-2 py-1 rounded-full bg-[#34C759]/10">
                      <Check className="w-3.5 h-3.5" />
                      Downloaded
                    </span>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isItemDownloading}
                      leftIcon={isItemDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      onClick={() => handleDownloadSingle(item.id, item.name)}
                    >
                      {isItemDownloading ? 'Downloading...' : 'Download'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          leftIcon={<XCircle className="w-4 h-4 text-[#FF3B30]" />}
          onClick={cancelReceiving}
          className="hover:text-[#FF3B30] w-full sm:w-auto"
        >
          Abandon Transfer
        </Button>

        {isSingleFile ? (
          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={Boolean(downloadingId)}
            leftIcon={downloadingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <SingleFileIcon className="w-4 h-4" />}
            onClick={() => handleDownloadSingle(singleFile.id, singleFile.name)}
            className="w-full sm:w-auto font-semibold shadow-md shadow-[#0071E3]/20"
          >
            {downloadingId ? 'Downloading...' : `Download ${singleFile.name}`}
          </Button>
        ) : hasFolders ? (
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={<Archive className="w-4 h-4" />}
              onClick={handleDownloadZip}
              className="w-full sm:w-auto"
            >
              Download (.zip)
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={isSavingFolder}
              leftIcon={isSavingFolder ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderDown className="w-4 h-4" />}
              onClick={() => handleSaveToFolder()}
              className="w-full sm:w-auto font-semibold shadow-md shadow-[#0071E3]/20"
            >
              {isSavingFolder ? 'Saving Folder...' : 'Save Folder to Device'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={<Archive className="w-4 h-4" />}
              onClick={handleDownloadZip}
              className="w-full sm:w-auto"
            >
              Download (.zip)
            </Button>
            {isFileSystemAccessSupported() && (
              <Button
                type="button"
                variant="secondary"
                size="md"
                disabled={isSavingFolder}
                leftIcon={<Folder className="w-4 h-4" />}
                onClick={() => handleSaveToFolder()}
                className="w-full sm:w-auto"
              >
                Save to Folder
              </Button>
            )}
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={isSavingFolder}
              leftIcon={isSavingFolder ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              onClick={handleDownloadAllFiles}
              className="w-full sm:w-auto font-semibold shadow-md shadow-[#0071E3]/20"
            >
              {isSavingFolder ? 'Downloading Files...' : 'Download All Files'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
