import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { EnterCodeStep } from './EnterCodeStep';
import { PreviewStep } from './PreviewStep';
import { useTransferStore } from '../../store/useTransferStore';

export const ReceiveFlow: React.FC = () => {
  const { receiveStep } = useTransferStore();

  return (
    <Card variant="glass" className="w-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        {receiveStep === 'enter-code' && (
          <motion.div
            key="enter-code"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <EnterCodeStep />
          </motion.div>
        )}

        {(receiveStep === 'preview' || receiveStep === 'delivered') && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <PreviewStep />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
