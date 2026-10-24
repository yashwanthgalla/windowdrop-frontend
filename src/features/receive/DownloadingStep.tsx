import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useTransferStore } from '../../store/useTransferStore';

export const DownloadingStep: React.FC = () => {
  const { resetReceiveFlow } = useTransferStore();

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#34C759]/15 text-[#34C759] flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
          Download Complete
        </h3>
        <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
          All files have been securely transferred to your device.
        </p>
      </div>
      <Button variant="primary" size="md" onClick={resetReceiveFlow}>
        Done
      </Button>
    </div>
  );
};
