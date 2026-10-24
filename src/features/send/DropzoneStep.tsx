import React, { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FolderUp, FileUp, Folder, ArrowUpCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useTransferStore } from '../../store/useTransferStore';
import { getDroppedFilesAndFolders, extractFilePath } from '../../utils/fileHelpers';

export const DropzoneStep: React.FC = () => {
  const { addSelectedFiles } = useTransferStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const processItemsList = (items: { file: File; path: string }[], isFolder = false) => {
    const hasFolder = isFolder || items.some((f) => f.path.includes('/'));
    addSelectedFiles(items, hasFolder);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true,
    onDrop: async (acceptedFiles, _rejections, event) => {
      if (event && 'dataTransfer' in event && (event as DragEvent).dataTransfer) {
        const { files: dropped, hasFolder } = await getDroppedFilesAndFolders((event as DragEvent).dataTransfer!);
        if (dropped.length > 0) {
          processItemsList(dropped, hasFolder);
          return;
        }
      }
      const processed = acceptedFiles.map((file) => ({
        file,
        path: extractFilePath(file),
      }));
      processItemsList(processed);
    },
  });

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const processed = Array.from(e.target.files).map((file) => ({
        file,
        path: extractFilePath(file),
      }));
      processItemsList(processed, false);
      e.target.value = '';
    }
  };

  const handleFolderClick = () => {
    folderInputRef.current?.click();
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const processed = Array.from(e.target.files).map((file) => ({
        file,
        path: extractFilePath(file),
      }));
      processItemsList(processed, true);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      {/* Hidden file & folder inputs */}
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

      {/* Drop area */}
      <div {...getRootProps()} className="w-full">
        <input {...getInputProps()} className="hidden" tabIndex={-1} />

        <motion.div
          animate={{
            scale: isDragActive ? 1.015 : 1,
            borderColor: isDragActive ? '#0071E3' : 'rgba(0, 0, 0, 0.12)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`relative flex flex-col items-center justify-center p-8 sm:p-14 rounded-[24px] border-2 border-dashed transition-all duration-200 cursor-pointer text-center select-none ${
            isDragActive
              ? 'bg-[#0071E3]/5 dark:bg-[#0A84FF]/10 dark:border-[#0A84FF] shadow-lg shadow-[#0071E3]/10'
              : 'bg-white/50 dark:bg-[#1C1C1E]/50 border-black/[0.12] dark:border-white/[0.16] hover:border-black/[0.25] dark:hover:border-white/[0.3] hover:bg-white/80 dark:hover:bg-[#1C1C1E]/80'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Icon with animated pulse on drag */}
          <motion.div
            animate={isDragActive ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] bg-[#0071E3]/10 dark:bg-[#0A84FF]/15 text-[#0071E3] dark:text-[#0A84FF] flex items-center justify-center mb-5 shadow-sm"
          >
            {isDragActive ? (
              <ArrowUpCircle className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
            ) : (
              <FolderUp className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.8]" />
            )}
          </motion.div>

          {/* Headline */}
          <h3 className="text-xl sm:text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            {isDragActive ? 'Drop them right here' : 'Drag files or folders here'}
          </h3>
          <p className="text-sm sm:text-base text-[#6E6E73] dark:text-[#98989D] mt-1.5 max-w-sm">
            Drag files or complete folders directly to generate a secure transfer code.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            <Button
              type="button"
              variant="primary"
              size="md"
              leftIcon={<FileUp className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose Files
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={<Folder className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                handleFolderClick();
              }}
            >
              Choose Folder
            </Button>
          </div>

          {/* Safe notice */}
          <div className="mt-6 flex items-center gap-2 text-xs text-[#6E6E73] dark:text-[#98989D]">
            <span>5-minute auto-expiring code</span>
            <span>•</span>
            <span>Zero raw file cloud persistence</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
