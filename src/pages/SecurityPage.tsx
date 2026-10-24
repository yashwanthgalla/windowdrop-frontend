import React from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Flame,
  FileCode2,
  CheckCircle2,
} from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const pillars = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      desc: 'All HTTP traffic is secured via TLS 1.3 with Perfect Forward Secrecy (PFS). Staged file payloads are encrypted on disk with AES-256-GCM authenticated encryption.',
      badge: 'Transport & Rest',
      color: 'text-[#0071E3] dark:text-[#0A84FF] bg-[#0071E3]/10 dark:bg-[#0A84FF]/15',
    },
    {
      icon: KeyRound,
      title: 'Cryptographic 8-Digit Codes',
      desc: 'Codes are generated from a high-entropy alphanumeric alphabet (over 2.8 trillion possible codes). A strict 5-attempt rate limiter locks the transfer upon brute-force attempts.',
      badge: 'Access Control',
      color: 'text-[#FF9500] bg-[#FF9500]/10',
    },
    {
      icon: Flame,
      title: 'Automated Post-Delivery Shredding',
      desc: 'Files exist solely for the duration of the transfer. Once downloaded or expired, disk blocks are unlinked and immediately zeroed from the host filesystem.',
      badge: 'Zero Retention',
      color: 'text-[#FF3B30] bg-[#FF3B30]/10',
    },
    {
      icon: FileCode2,
      title: 'Executable File Guardrails',
      desc: 'Executable payloads (.exe, .bat, .cmd, .msi, .ps1, .sh) are detected through MIME sniffing and strict extension filtering to prevent malware spread.',
      badge: 'Threat Protection',
      color: 'text-[#34C759] bg-[#34C759]/10',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 sm:py-12 space-y-16">
      {/* Hero Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0071E3]/10 dark:bg-[#0A84FF]/15 text-[#0071E3] dark:text-[#0A84FF] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security Architecture & Cryptography</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          Built with Zero-Knowledge & Ephemeral Storage
        </h1>
        <p className="text-base sm:text-lg text-[#6E6E73] dark:text-[#98989D] max-w-2xl mx-auto leading-relaxed">
          How DropCode protects your files from interception, unauthorized access, and persistent exposure.
        </p>
      </section>

      {/* Security Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-[24px] bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/[0.06] dark:border-white/[0.08] shadow-apple-subtle backdrop-blur-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl ${pillar.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-[11px] font-mono font-semibold text-[#6E6E73] dark:text-[#98989D] bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-full uppercase">
                  {pillar.badge}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                {pillar.title}
              </h2>
              <p className="text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* Deep Dive: Cryptographic Lifecycle */}
      <section className="p-8 sm:p-10 rounded-[28px] bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3] dark:text-[#0A84FF]">
            Technical Specifications
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mt-1">
            Cryptographic Protocol & Defense Layers
          </h2>
        </div>

        <div className="space-y-6 text-sm text-[#1D1D1F]/80 dark:text-[#F5F5F7]/80">
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
              <span>1. Code Entropy & Brute Force Immunity</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed pl-6">
              Transfer codes are composed of 8 characters drawn from an unambiguous alphanumeric alphabet excluding visually confusing characters (such as O vs 0 and I vs 1). With 32 available characters across 8 positions, the total search space is 32^8 ≈ 1.099 × 10^12 combinations.
            </p>
            <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed pl-6">
              Our backend enforces an atomic counter per transfer session: after 5 failed code attempts from any IP address, the code is immediately disabled and placed in locked status.
            </p>
          </div>

          <div className="space-y-2 border-t border-black/[0.04] dark:border-white/[0.06] pt-4">
            <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
              <span>2. Memory & Disk Sanitation Protocol</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed pl-6">
              File chunks uploaded via the chunked streaming API are written to volatile sandboxed directories with strictly restricted Unix permissions (0700). The relational database stores only metadata hashes and expiry timestamps.
            </p>
            <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed pl-6">
              Upon successful delivery, an asynchronous sanitation thread unlinks the physical files and zeroes their metadata pointers.
            </p>
          </div>

          <div className="space-y-2 border-t border-black/[0.04] dark:border-white/[0.06] pt-4">
            <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
              <span>3. Single-Use Claim Mutual Exclusion</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed pl-6">
              To prevent interception or race conditions between multiple parties claiming the same code, DropCode employs an atomic database claim lock. The first receiver to successfully verify the code transitions the transfer state from <code>ready</code> to <code>claimed</code>. Any concurrent attempts are rejected with an access conflict error.
            </p>
          </div>
        </div>
      </section>

      {/* Vulnerability Reporting */}
      <section className="p-8 rounded-[24px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Responsible Security Disclosure
          </h3>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] max-w-md">
            If you believe you have discovered a vulnerability in DropCode's cryptographic implementation or API endpoints, please contact our security desk immediately.
          </p>
        </div>
        <a
          href="mailto:security@dropcode.app"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.1] dark:hover:bg-white/[0.12] text-xs font-mono font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors"
        >
          <span>security@dropcode.app</span>
        </a>
      </section>
    </div>
  );
};
