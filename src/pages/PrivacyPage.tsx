import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, EyeOff, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 space-y-10">
      {/* Header */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#34C759]/10 text-[#34C759] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>India DPDP Act & GDPR Aligned</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#6E6E73] dark:text-[#98989D]">
          Last Updated: October 2026 • Effective Immediately
        </p>
      </section>

      {/* Summary Highlight Box */}
      <section className="p-6 sm:p-7 rounded-[24px] bg-[#0071E3]/5 dark:bg-[#0A84FF]/10 border border-[#0071E3]/20 space-y-3">
        <div className="flex items-center gap-2 text-[#0071E3] dark:text-[#0A84FF]">
          <EyeOff className="w-5 h-5" />
          <h2 className="text-base font-semibold">The Zero-Retention Privacy Promise</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#1D1D1F]/90 dark:text-[#F5F5F7]/90 leading-relaxed">
          DropCode was architected around a single core tenet: <strong>we do not keep your files</strong>. When you upload files for transfer, they exist only as an encrypted temporary buffer until your recipient finishes downloading them, or until the transfer timer elapses. Once delivered or expired, file payloads are permanently shredded from our staging servers.
        </p>
      </section>

      {/* Main Legal Content */}
      <div className="prose dark:prose-invert max-w-none space-y-8 text-sm text-[#1D1D1F]/80 dark:text-[#F5F5F7]/80 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            1. Information We Collect
          </h2>
          <p>
            Depending on how you interact with DropCode (as a guest visitor or an authenticated account holder), we may process the following categories of information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D]">
            <li>
              <strong>Ephemeral Transfer Metadata:</strong> File names, relative directory paths (for folders), file byte sizes, declared MIME types, transfer status, creation timestamp, and expiration timestamp.
            </li>
            <li>
              <strong>Network & Security Logs:</strong> Your IP address, approximate geographical region (country/city level), and browser User-Agent. These are temporarily logged strictly for rate limiting, DDoS mitigation, and preventing abuse of our free staging infrastructure.
            </li>
            <li>
              <strong>Account Information (Optional):</strong> If you choose to sign in via Google Authentication or email verification, we process your email address, display name, and avatar URL provided by the identity provider.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            2. What We NEVER Collect or Store
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                <strong>No File Content Retention:</strong> We never index, parse, read, or sell the contents of files transferred through DropCode.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                <strong>No AI Model Training:</strong> Your files, codes, and transfers are never used to train machine learning models.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                <strong>No Third-Party Advertising Trackers:</strong> We do not employ third-party ad pixels, cross-site trackers, or behavioral profiling.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                <strong>No Permanent Backups:</strong> Once a transfer expires or finishes downloading, file chunks are unlinked from the filesystem.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            3. How File Data is Staged & Destroyed
          </h2>
          <p>
            When a sender uploads files, the files are buffered on our secure Linux staging server within a dedicated, restricted workspace folder keyed by an unguessable UUID. All transfers are protected with AES-256-GCM encryption.
          </p>
          <p>
            Upon successful claim and delivery, or upon expiration of the 5-minute code timer (or 15-minute download window), an automated cleanup worker calls operating system unlinks on all staging payloads. The disk blocks are immediately released.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3" id="dpdp">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            4. Compliance with India DPDP Act & Global Regulations
          </h2>
          <p>
            In accordance with the Digital Personal Data Protection Act, 2023 of India and standard global data protection frameworks:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D]">
            <li>We act strictly as a data processor for ephemeral transfers initiated directly by you.</li>
            <li>You have the right to request deletion of your account and associated transfer history logs at any time via your Profile settings.</li>
            <li>We do not transfer personal data to unauthorized third parties.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            5. Cookies & Local Storage
          </h2>
          <p>
            DropCode does not use third-party marketing cookies. We use browser LocalStorage strictly for functional purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D]">
            <li><code>dropcode-theme</code>: Remembers your dark / light mode display preference.</li>
            <li><code>dropcode-auth-token</code>: Stores your Firebase session token if you log into an account.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            6. Contact Our Privacy Officer
          </h2>
          <p>
            If you have questions, concerns, or requests concerning this Privacy Policy or your data rights, please contact our team:
          </p>
          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-xs">
            <p className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">DropCode Privacy Desk</p>
            <p className="text-[#6E6E73] dark:text-[#98989D] mt-0.5">Email: <a href="mailto:privacy@dropcode.app" className="text-[#0071E3] dark:text-[#0A84FF] hover:underline">privacy@dropcode.app</a></p>
            <p className="text-[#6E6E73] dark:text-[#98989D]">Or visit our <Link to="/support" className="text-[#0071E3] dark:text-[#0A84FF] hover:underline">Support Center</Link></p>
          </div>
        </section>
      </div>
    </div>
  );
};
