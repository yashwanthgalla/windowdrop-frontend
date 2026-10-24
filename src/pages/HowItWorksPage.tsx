import React from 'react';
import { Link } from 'react-router-dom';
import {
  FolderUp,
  KeyRound,
  Download,
  Shield,
  Zap,
  Flame,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Server,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Select & Stage Files',
      desc: 'Pick single files, multiple batches, or nested directory trees of any type up to 500 MB. Your browser prepares the payload with metadata and streams the chunks securely.',
      icon: FolderUp,
      badge: 'Client Preparation',
      color: 'from-blue-500/20 to-indigo-500/10 text-[#0071E3] dark:text-[#0A84FF]',
      details: [
        'Directory tree preservation with relative paths intact',
        'Automatic MIME-type validation and executable detection',
        'Direct streaming upload with progress feedback',
      ],
    },
    {
      num: '02',
      title: 'Get 8-Digit One-Time Code',
      desc: 'As soon as your upload finishes staging, DropCode generates an ultra-simple 8-character cryptographic transfer code (formatted as XXXX-XXXX) and an instant QR code.',
      icon: KeyRound,
      badge: 'Code Generation',
      color: 'from-amber-500/20 to-orange-500/10 text-[#FF9500]',
      details: [
        'Active for 5 minutes (code claims) or 15-minute download window',
        'Single-use claim locking prevents race conditions and interception',
        'Rate-limited: 5 failed verification attempts permanently locks the code',
      ],
    },
    {
      num: '03',
      title: 'Download & Immediate Shredding',
      desc: 'The recipient visits DropCode on any desktop, laptop, tablet, or phone, enters the 8-digit code or scans the QR, and downloads individual files or a merged ZIP.',
      icon: Download,
      badge: 'Zero-Retention Delivery',
      color: 'from-emerald-500/20 to-teal-500/10 text-[#34C759]',
      details: [
        'Direct stream download to recipient device',
        'Staged data is immediately shredded and purged from disk',
        'Zero residual file contents preserved in databases or backups',
      ],
    },
  ];

  const features = [
    {
      icon: Flame,
      title: 'Auto-Shredded Storage',
      desc: 'Unlike cloud drives that retain files indefinitely, DropCode automatically wipes staged assets the moment delivery completes or the timer reaches zero.',
    },
    {
      icon: Shield,
      title: 'AES-256-GCM Staging',
      desc: 'Files in transit and temporarily buffered on staging storage are protected by military-grade AES-256 encryption with authenticated data integrity.',
    },
    {
      icon: Zap,
      title: 'No App or Plugin Required',
      desc: 'Works completely inside any modern browser on Windows, Mac, Linux, iOS, and Android without downloading extensions or native installers.',
    },
    {
      icon: RefreshCw,
      title: 'Preserved Folder Structures',
      desc: 'Send entire project directories, source code trees, or nested document folders without needing to manually zip them first.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 sm:py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0071E3]/10 dark:bg-[#0A84FF]/15 text-[#0071E3] dark:text-[#0A84FF] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Architecture & Workflow</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          How DropCode Works
        </h1>
        <p className="text-base sm:text-lg text-[#6E6E73] dark:text-[#98989D] max-w-2xl mx-auto leading-relaxed">
          DropCode was built for one mission: fast, secure, peer-to-peer file transfer with absolute zero content retention.
        </p>
      </section>

      {/* 3 Step Deep Dive */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-[24px] bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/[0.06] dark:border-white/[0.08] shadow-apple-subtle backdrop-blur-md transition-all hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="font-mono text-sm font-bold text-[#6E6E73] dark:text-[#98989D] bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-full">
                      STEP {s.num}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0071E3] dark:text-[#0A84FF]">
                      {s.badge}
                    </span>
                    <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mt-0.5">
                      {s.title}
                    </h2>
                  </div>

                  <p className="text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
                    {s.desc}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                    {s.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#1D1D1F]/80 dark:text-[#F5F5F7]/80 leading-normal">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759] shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technical Blueprint */}
      <section className="p-8 sm:p-10 rounded-[28px] bg-white/60 dark:bg-[#1C1C1E]/60 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3] dark:text-[#0A84FF]">
            Under The Hood
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mt-1">
            The Zero-Retention Lifecycle
          </h2>
          <p className="text-sm text-[#6E6E73] dark:text-[#98989D] mt-2 leading-relaxed">
            Every transfer follows a deterministic, state-machine driven lifecycle. Here is how your data travels from sender to receiver:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              <Server className="w-4 h-4 text-[#0071E3] dark:text-[#0A84FF]" />
              <span>Isolated Ephemeral Staging</span>
            </div>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
              Uploaded files are stored in an isolated, sandboxed staging folder on the backend server. The database stores only file hashes, byte sizes, and expiry timestamps—never the actual file payload.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              <Cpu className="w-4 h-4 text-[#34C759]" />
              <span>Deterministic File Shredder</span>
            </div>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
              When the receiver confirms receipt or when 5 minutes expire without a receiver claiming the code, the staging daemon triggers a secure unlink that frees the inodes and zeroes out storage blocks.
            </p>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Built with Privacy First Principles
          </h2>
          <p className="text-sm text-[#6E6E73] dark:text-[#98989D] mt-1">
            Engineered from ground up to ensure your files remain exclusively yours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/[0.06] dark:border-white/[0.08] flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center shrink-0 text-[#0071E3] dark:text-[#0A84FF]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {f.title}
                  </h3>
                  <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center p-10 rounded-[28px] bg-gradient-to-b from-[#0071E3]/10 to-transparent border border-[#0071E3]/20 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
          Ready to share your first file?
        </h2>
        <p className="text-sm text-[#6E6E73] dark:text-[#98989D] max-w-md mx-auto">
          No sign up required for standard transfers. Generate a code in under 10 seconds.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start a Transfer Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
