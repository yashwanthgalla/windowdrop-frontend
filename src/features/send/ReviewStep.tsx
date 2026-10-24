import React, { useRef, useMemo, useState } from 'react';
import {
  KeyRound,
  Trash2,
  Plus,
  FolderPlus,
  List,
  FolderTree as FolderTreeIcon,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FileRow } from '../../components/ui/FileRow';
import { FolderTree } from '../../components/ui/FolderTree';
import { useTransferStore } from '../../store/useTransferStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatBytes, buildFolderTree, extractFilePath } from '../../utils/fileHelpers';

export const ReviewStep: React.FC = () => {
  const { user } = useAuthStore();
  const {
    selectedFiles,
    addSelectedFiles,
    removeSelectedFile,
    clearSelectedFiles,
    startUpload,
  } = useTransferStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [senderName, setSenderName] = useState('');

  const totalSize = useMemo(() => {
    return selectedFiles.reduce((acc, curr) => acc + curr.file.size, 0);
  }, [selectedFiles]);

  const hasFolders = useMemo(() => {
    return selectedFiles.some((f) => f.path.includes('/'));
  }, [selectedFiles]);

  const treeNodes = useMemo(() => {
    return buildFolderTree(
      selectedFiles.map((f) => ({
        id: f.id,
        name: f.file.name,
        size: f.file.size,
        path: f.path,
        type: f.file.type,
      }))
    );
  }, [selectedFiles]);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const processed = Array.from(e.target.files).map((file) => ({
        file,
        path: extractFilePath(file),
      }));
      addSelectedFiles(processed, false);
      e.target.value = '';
    }
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const processed = Array.from(e.target.files).map((file) => ({
        file,
        path: extractFilePath(file),
      }));
      addSelectedFiles(processed, true);
      e.target.value = '';
    }
  };

  const handleRemoveByPath = (path: string) => {
    const matching = selectedFiles.filter(
      (f) => f.path === path || f.path.startsWith(`${path}/`)
    );
    matching.forEach((f) => removeSelectedFile(f.id));
  };

  const handleAction = async () => {
    if (selectedFiles.length === 0) return;
    setIsSubmitting(true);
    try {
      await startUpload(senderName.trim() || undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusPill = () => {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#34C759]/15 text-[#34C759]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Free & Direct
      </span>
    );
  };

  const btnConfig = {
    label: 'Generate Code',
    disabled: selectedFiles.length === 0 || isSubmitting,
    icon: <KeyRound className="w-4 h-4" />,
  };

  return (
    <div className="w-full space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFilesSelect}
        tabIndex={-1}
      />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-expect-error webkitdirectory is standard in browsers
        webkitdirectory=""
        directory=""
        multiple
        className="hidden"
        onChange={handleFolderSelect}
        tabIndex={-1}
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              Review Selection
            </h3>
            {renderStatusPill()}
          </div>
          <p className="text-sm text-[#6E6E73] dark:text-[#98989D] mt-0.5">
            {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected (
            {formatBytes(totalSize)})
          </p>
        </div>

        {/* View toggle & add buttons */}
        <div className="flex items-center gap-2 flex-wrap">
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

          <Button
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => fileInputRef.current?.click()}
          >
            Add Files
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<FolderPlus className="w-3.5 h-3.5" />}
            onClick={() => folderInputRef.current?.click()}
          >
            Add Folder
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-[#FF3B30]" />}
            onClick={clearSelectedFiles}
            className="hover:text-[#FF3B30]"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Files List / Tree */}
      <div className="max-h-[360px] overflow-y-auto pr-1 space-y-2">
        {hasFolders && viewMode === 'tree' ? (
          <FolderTree nodes={treeNodes} onRemoveItem={handleRemoveByPath} />
        ) : (
          selectedFiles.map((item) => (
            <FileRow
              key={item.id}
              id={item.id}
              name={item.file.name}
              size={item.file.size}
              path={item.path}
              type={item.file.type}
              onRemove={() => removeSelectedFile(item.id)}
            />
          ))
        )}
      </div>

      {/* Optional sender display name for guest */}
      {!user && (
        <div className="flex items-center gap-3 pt-2">
          <input
            type="text"
            placeholder="Your name or alias (optional, max 40 chars)"
            maxLength={40}
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
          />
        </div>
      )}

      {/* Footer bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
        <div className="text-sm">
          <div className="flex items-center gap-2 text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">
            <span>Total:</span>
            <span className="font-semibold">{formatBytes(totalSize)}</span>
          </div>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-0.5">
            Single-use short-lived code • Encrypted staging storage
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          leftIcon={btnConfig.icon}
          disabled={btnConfig.disabled}
          isLoading={isSubmitting}
          onClick={handleAction}
          className="w-full sm:w-auto"
        >
          {btnConfig.label}
        </Button>
      </div>
    </div>
  );
};
