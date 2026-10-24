import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 space-y-10">
      {/* Header */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0071E3]/10 dark:bg-[#0A84FF]/15 text-[#0071E3] dark:text-[#0A84FF] text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          Terms of Service
        </h1>
        <p className="text-sm text-[#6E6E73] dark:text-[#98989D]">
          Last Updated: October 2026 • Effective Date: October 24, 2026
        </p>
      </section>

      {/* Overview Card */}
      <section className="p-6 rounded-[24px] bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/[0.06] dark:border-white/[0.08] shadow-apple-subtle backdrop-blur-md space-y-2">
        <h2 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
          Welcome to DropCode
        </h2>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
          These Terms of Service govern your access to and use of the DropCode web application, transfer APIs, and associated staging infrastructure. By uploading, downloading, or generating a transfer code on DropCode, you confirm your agreement to these terms.
        </p>
      </section>

      {/* Main Terms Sections */}
      <div className="space-y-8 text-sm text-[#1D1D1F]/80 dark:text-[#F5F5F7]/80 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            1. Description of Service
          </h2>
          <p>
            DropCode provides an ephemeral staging service designed to facilitate transient file transfers between sending and receiving devices using temporary 8-digit alphanumeric verification codes. DropCode is strictly a conduit for temporary transmission; <strong>it is not a backup service, archival storage, or persistent host</strong>.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            2. Acceptable Use Policy
          </h2>
          <p>
            You agree to use DropCode exclusively for lawful purposes. You shall not upload, transmit, or distribute any file, payload, or content that:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D]">
            <li>Contains viruses, ransomware, spyware, worms, trojans, rootkits, or malicious payload designed to exploit software vulnerabilities.</li>
            <li>Contains Child Sexual Abuse Material (CSAM), non-consensual explicit imagery, or terroristic content. Any detection will be reported immediately to law enforcement authorities.</li>
            <li>Infringes upon any copyright, patent, trademark, trade secret, or other proprietary intellectual property rights of any third party.</li>
            <li>Distributes unsolicited commercial communications, phishing pages, or credential-harvesting tools.</li>
            <li>Interferes with, disrupts, or floods DropCode's staging infrastructure through distributed denial-of-service (DDoS) attacks or automated abuse.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            3. Automatic Deletion & No Data Persistence
          </h2>
          <p>
            You explicitly acknowledge and agree that:
          </p>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Important Notice: Ephemeral Storage Only</span>
            </p>
            <p>
              Staged files are permanently expunged upon download confirmation or expiration of the 5-minute code timer. We do not maintain backups, disaster recovery snapshots, or archives of transferred files. Under no circumstances will DropCode be liable for lost files. Always retain your original files locally.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            4. User Responsibility for Transfer Codes
          </h2>
          <p>
            The 8-digit transfer code generated during an upload grants access to download the staged files during the valid timer window. You are solely responsible for sharing this code only with your intended recipient through trusted communication channels. DropCode will not be liable for unauthorized access resulting from user disclosure of the code.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            5. Intellectual Property & Takedown
          </h2>
          <p>
            You retain full copyright and ownership of the files you transmit. DropCode claims zero ownership, license, or distribution rights over your content. If you believe your copyrighted work or trademark has been transmitted unlawfully via DropCode, please file an immediate takedown report via our <Link to="/report-abuse" className="text-[#0071E3] dark:text-[#0A84FF] underline">Report Abuse</Link> tool.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            6. Limitation of Liability & Warranty Disclaimer
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D]">
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING FITNESS FOR A PARTICULAR PURPOSE OR FREEDOM FROM INTERRUPTIONS. IN NO EVENT SHALL DROPCODE, ITS OPERATORS, OR CONTRIBUTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            7. Contact & Notice
          </h2>
          <p>
            For legal inquiries, copyright claims, or questions regarding these Terms, contact our legal desk at <a href="mailto:legal@dropcode.app" className="text-[#0071E3] dark:text-[#0A84FF] hover:underline font-mono text-xs">legal@dropcode.app</a> or via our <Link to="/support" className="text-[#0071E3] dark:text-[#0A84FF] hover:underline">Support Portal</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};
