import React from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { getFileCategoryIcon, formatBytes } from '../../utils/fileHelpers';

interface FileRowProps {
  id?: string;
  name: string;
  size: number;
  path?: string;
  type?: string;
  onRemove?: () => void;
  onDownload?: () => void;
  isDownloading?: boolean;
}

function renderFileCategoryIcon(name: string, type?: string, className?: string) {
  const Icon = getFileCategoryIcon(name, type);
  return React.createElement(Icon, { className });
}

export const FileRow: React.FC<FileRowProps> = ({
  name,
  size,
  path,
  type,
  onRemove,
  onDownload,
  isDownloading = false,
}) => {
  const displayFolder = path && path.includes('/') ? path.split('/').slice(0, -1).join('/') : null;

  return (
    <div className="group flex items-center justify-between p-3.5 sm:p-4 rounded-[16px] bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06] transition-all duration-150">
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 pr-2">
        {/* Icon box */}
        <div className="w-10 h-10 rounded-[12px] bg-[#0071E3]/10 dark:bg-[#0A84FF]/15 text-[#0071E3] dark:text-[#0A84FF] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
          {renderFileCategoryIcon(name, type, 'w-5 h-5')}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm sm:text-base font-medium text-[#1D1D1F] dark:text-[#F5F5F7] truncate leading-tight">
            {name}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#6E6E73] dark:text-[#98989D]">
            <span>{formatBytes(size)}</span>
            {displayFolder && (
              <>
                <span>•</span>
                <span className="truncate max-w-[200px]" title={displayFolder}>
                  in {displayFolder}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action: Remove or Download */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading}
            aria-label={`Download ${name}`}
            className="p-2 rounded-[10px] text-[#0071E3] dark:text-[#0A84FF] hover:bg-[#0071E3]/10 dark:hover:bg-[#0A84FF]/15 transition-colors focus-visible:ring-2 focus-visible:ring-[#0071E3]"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${name}`}
            className="p-2 rounded-[10px] text-[#6E6E73] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 dark:text-[#98989D] dark:hover:text-[#FF3B30] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF3B30]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
