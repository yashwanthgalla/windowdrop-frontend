import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpFromLine, ArrowDownToLine, Lock, AlertTriangle } from 'lucide-react';
import { SegmentedControl, type SegmentedOption } from '../components/ui/SegmentedControl';
import { SendFlow } from '../features/send/SendFlow';
import { ReceiveFlow } from '../features/receive/ReceiveFlow';
import { HowItWorks } from '../components/HowItWorks';
import { useTransferStore } from '../store/useTransferStore';

const CURRENT_YEAR = new Date().getFullYear();

export const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    activeTab,
    setActiveTab,
    session,
    activityBanner,
    initApp,
    setCode,
  } = useTransferStore();

  useEffect(() => {
    initApp();
    const codeParam = searchParams.get('code');
    if (codeParam) {
      const cleanParam = codeParam.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 8);
      if (cleanParam.length > 0) {
        setCode(cleanParam);
        setActiveTab('receive');
      }
    }
  }, [initApp, searchParams, setCode, setActiveTab]);

  const isSendingActive = session?.activity.state === 'sending';
  const isReceivingActive = session?.activity.state === 'receiving';

  const tabOptions: SegmentedOption<'send' | 'receive'>[] = [
    {
      value: 'send',
      label: 'Send',
      icon: isReceivingActive ? (
        <Lock className="w-4 h-4 stroke-[2]" />
      ) : (
        <ArrowUpFromLine className="w-4 h-4 stroke-[2.2]" />
      ),
      disabled: isReceivingActive,
      disabledTooltip: "You're receiving files. Finish or cancel to send.",
    },
    {
      value: 'receive',
      label: 'Receive',
      icon: isSendingActive ? (
        <Lock className="w-4 h-4 stroke-[2]" />
      ) : (
        <ArrowDownToLine className="w-4 h-4 stroke-[2.2]" />
      ),
      disabled: isSendingActive,
      disabledTooltip: "You're sending files. Finish or cancel to receive.",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Activity Conflict Banner */}
      {activityBanner && (
        <div className="w-full max-w-4xl lg:max-w-5xl mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{activityBanner}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="w-full text-center pt-6 sm:pt-10 pb-6 sm:pb-8 max-w-3xl mx-auto space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.02em] text-[#1D1D1F] dark:text-[#F5F5F7] leading-tight">
            Send anything. Securely.
          </h1>
          <p className="text-base sm:text-lg text-[#6E6E73] dark:text-[#98989D] max-w-xl mx-auto font-normal leading-relaxed">
            Peer-to-peer file and folder sharing with single-use 8-digit codes. Direct streaming encryption with zero persistent content.
          </p>
        </div>

        {/* Apple Segmented Control */}
        <div className="flex justify-center pt-2">
          <SegmentedControl
            options={tabOptions}
            value={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </section>

      {/* Main Flow Card */}
      <main className="w-full max-w-4xl lg:max-w-5xl mx-auto transition-all duration-300">
        {activeTab === 'send' ? <SendFlow /> : <ReceiveFlow />}
      </main>

      {/* How It Works Section */}
      <div className="w-full max-w-6xl mx-auto pb-16">
        <HowItWorks />
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto py-8 border-t border-black/[0.06] dark:border-white/[0.08] text-center text-xs text-[#6E6E73] dark:text-[#98989D] space-y-3">
        <p className="font-medium text-[#1D1D1F]/70 dark:text-[#F5F5F7]/70">
          For security we log your IP address and approximate location.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p>© {CURRENT_YEAR} DropCode. Single-Use Staging Transfer Engine.</p>
          <div className="flex items-center gap-6">
            <span>AES-256-GCM Encrypted</span>
            <span>•</span>
            <span>India DPDP Compliant</span>
            <span>•</span>
            <span>Auto-purged on Delivery</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
