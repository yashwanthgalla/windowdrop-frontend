import React from 'react';
import { FolderUp, KeyRound, Download } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Select & Upload',
      description: 'Drag and drop individual files or complete directory structures up to 500 MB.',
      icon: FolderUp,
      color: 'text-[#0071E3] dark:text-[#0A84FF] bg-[#0071E3]/10 dark:bg-[#0A84FF]/15',
    },
    {
      step: '02',
      title: 'Generate Code',
      description: 'Receive an 8-digit one-time code or scan-ready QR code that expires in 10 minutes.',
      icon: KeyRound,
      color: 'text-[#FF9F0A] bg-[#FF9F0A]/10',
    },
    {
      step: '03',
      title: 'Download & Done',
      description: 'The receiver enters the code to preview and download all files in a single archive.',
      icon: Download,
      color: 'text-[#34C759] bg-[#34C759]/10',
    },
  ];

  return (
    <section className="w-full mt-16 sm:mt-24">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          How WindowsDrop Works
        </h2>
        <p className="text-sm sm:text-base text-[#6E6E73] dark:text-[#98989D] mt-1.5">
          Effortless peer-to-peer sharing in three simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative p-6 sm:p-7 rounded-[24px] bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/[0.06] dark:border-white/[0.08] shadow-apple-subtle backdrop-blur-md transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-12 h-12 rounded-[16px] flex items-center justify-center ${item.color} shadow-sm`}
                >
                  <Icon className="w-6 h-6 stroke-[1.9]" />
                </div>
                <span className="text-xs font-mono font-semibold text-[#6E6E73] dark:text-[#98989D] px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06]">
                  STEP {item.step}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <a
          href="/how-it-works"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0071E3] dark:text-[#0A84FF] hover:underline"
        >
          <span>Explore architecture & zero-retention deep-dive</span>
          <span>→</span>
        </a>
      </div>
    </section>
  );
};
