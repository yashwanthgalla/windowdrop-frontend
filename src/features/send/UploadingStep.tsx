import React from 'react';
import { XCircle, ShieldCheck } from 'lucide-react';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Button } from '../../components/ui/Button';
import { useTransferStore } from '../../store/useTransferStore';
import { formatBytes } from '../../utils/fileHelpers';

export const UploadingStep: React.FC = () => {
  const { uploadProgress, cancelSending } = useTransferStore();

  const formattedUploaded = formatBytes(uploadProgress.uploadedBytes);
  const formattedTotal = formatBytes(uploadProgress.totalBytes);

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-7">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          Encrypting & Uploading
        </h3>
        <p className="text-sm text-[#6E6E73] dark:text-[#98989D] max-w-sm">
          Encrypting with AES-256-GCM in 1 MiB frames into staging storage
        </p>
      </div>

      {/* Circular Progress Ring */}
      <div className="py-2">
        <ProgressRing
          percent={uploadProgress.percent}
          speed={uploadProgress.speed}
          bytesFormatted={`${formattedUploaded} / ${formattedTotal} • ETA ${uploadProgress.eta}`}
          size={160}
          strokeWidth={12}
        />
      </div>

      {/* Security pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.08] text-xs text-[#6E6E73] dark:text-[#98989D]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
        <span>AES-256-GCM encrypted • Zero plaintext at rest</span>
      </div>

      {/* Cancel button */}
      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          leftIcon={<XCircle className="w-4 h-4 text-[#6E6E73]" />}
          onClick={cancelSending}
        >
          Cancel Transfer
        </Button>
      </div>
    </div>
  );
};
