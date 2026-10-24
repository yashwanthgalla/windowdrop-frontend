import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { DropzoneStep } from './DropzoneStep';
import { ReviewStep } from './ReviewStep';
import { UploadingStep } from './UploadingStep';
import { CodeReadyStep } from './CodeReadyStep';
import { useTransferStore } from '../../store/useTransferStore';

export const SendFlow: React.FC = () => {
  const { sendStep } = useTransferStore();

  if (sendStep === 'ready') {
    return (
      <div className="w-full relative">
        <CodeReadyStep />
      </div>
    );
  }

  return (
    <Card variant="glass" className="w-full relative">
      <AnimatePresence mode="wait">
        {sendStep === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <DropzoneStep />
          </motion.div>
        )}

        {sendStep === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <ReviewStep />
          </motion.div>
        )}

        {sendStep === 'uploading' && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <UploadingStep />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
