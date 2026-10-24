import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Download,
  X,
  Loader2,
} from 'lucide-react';
import type { FolderTreeNode } from '../../types';
import { formatBytes, getFileCategoryIcon } from '../../utils/fileHelpers';

interface FolderTreeProps {
  nodes: FolderTreeNode[];
  onRemoveItem?: (pathOrId: string) => void;
  onDownloadItem?: (id: string, name: string) => void;
  onDownloadFolder?: (node: FolderTreeNode) => void;
  downloadingId?: string | null;
  level?: number;
}

function renderFileCategoryIcon(name: string, type?: string, className?: string) {
  const Icon = getFileCategoryIcon(name, type);
  return React.createElement(Icon, { className });
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  nodes,
  onRemoveItem,
  onDownloadItem,
  onDownloadFolder,
  downloadingId,
  level = 0,
}) => {
  return (
    <div className={`space-y-1.5 ${level > 0 ? 'ml-4 pl-3 border-l border-black/[0.08] dark:border-white/[0.1]' : ''}`}>
      {nodes.map((node) => (
        <TreeNodeItem
          key={node.path}
          node={node}
          onRemoveItem={onRemoveItem}
          onDownloadItem={onDownloadItem}
          onDownloadFolder={onDownloadFolder}
          downloadingId={downloadingId}
          level={level}
        />
      ))}
    </div>
  );
};

const TreeNodeItem: React.FC<{
  node: FolderTreeNode;
  onRemoveItem?: (pathOrId: string) => void;
  onDownloadItem?: (id: string, name: string) => void;
  onDownloadFolder?: (node: FolderTreeNode) => void;
  downloadingId?: string | null;
  level: number;
}> = ({ node, onRemoveItem, onDownloadItem, onDownloadFolder, downloadingId, level }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.isFolder) {
    const itemCount = node.children?.length || 0;

    return (
      <div className="rounded-[16px] overflow-hidden">
        {/* Folder header */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={`Toggle folder ${node.name}`}
          className="w-full flex items-center justify-between p-3 rounded-[14px] bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06] transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[#6E6E73] dark:text-[#98989D]">
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
            <div className="w-8 h-8 rounded-[10px] bg-[#0071E3]/10 dark:bg-[#0A84FF]/15 text-[#0071E3] dark:text-[#0A84FF] flex items-center justify-center flex-shrink-0">
              {isOpen ? (
                <FolderOpen className="w-4 h-4" />
              ) : (
                <Folder className="w-4 h-4" />
              )}
            </div>
            <span className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
              {node.name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#6E6E73] dark:text-[#98989D]">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6E6E73] dark:text-[#98989D]">
              {formatBytes(node.size)}
            </span>
            {onDownloadFolder && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadFolder(node);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    onDownloadFolder(node);
                  }
                }}
                title={`Save folder ${node.name} to device`}
                className="p-1 rounded-[6px] hover:bg-black/10 dark:hover:bg-white/10 text-[#0071E3] dark:text-[#0A84FF] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </button>

        {/* Folder children */}
        <AnimatePresence initial={false}>
          {isOpen && node.children && node.children.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="mt-1"
            >
              <FolderTree
                nodes={node.children}
                onRemoveItem={onRemoveItem}
                onDownloadItem={onDownloadItem}
                onDownloadFolder={onDownloadFolder}
                downloadingId={downloadingId}
                level={level + 1}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // File node
  const isDownloading = downloadingId === node.id;

  return (
    <div className="group flex items-center justify-between p-2.5 sm:p-3 rounded-[12px] bg-black/[0.015] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] border border-black/[0.03] dark:border-white/[0.05] transition-colors">
      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
        <div className="w-7 h-7 rounded-[8px] bg-black/[0.04] dark:bg-white/[0.08] text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center justify-center flex-shrink-0">
          {renderFileCategoryIcon(node.name, node.type, 'w-3.5 h-3.5')}
        </div>
        <span className="text-xs sm:text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
          {node.name}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-[#6E6E73] dark:text-[#98989D]">
          {formatBytes(node.size)}
        </span>

        {onDownloadItem && node.id && (
          <button
            type="button"
            onClick={() => onDownloadItem(node.id!, node.name)}
            disabled={isDownloading}
            aria-label={`Download ${node.name}`}
            className="p-1.5 rounded-[8px] text-[#0071E3] dark:text-[#0A84FF] hover:bg-[#0071E3]/10 dark:hover:bg-[#0A84FF]/15 transition-colors"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {onRemoveItem && (
          <button
            type="button"
            onClick={() => onRemoveItem(node.path)}
            aria-label={`Remove ${node.name}`}
            className="p-1.5 rounded-[8px] text-[#6E6E73] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 dark:text-[#98989D] dark:hover:text-[#FF3B30] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
