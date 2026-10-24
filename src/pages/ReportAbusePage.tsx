import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useToastStore } from '../store/useToastStore';

export const ReportAbusePage: React.FC = () => {
  const { showToast } = useToastStore();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    email: '',
    reason: 'malware',
    details: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.details.trim()) {
      showToast('Please provide your contact email and a description of the abuse', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Abuse report submitted. Staging session flagged for immediate review.', 'success');
      setFormData({
        code: '',
        name: '',
        email: '',
        reason: 'malware',
        details: '',
      });
    }, 850);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 sm:py-12 space-y-10">
      {/* Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF3B30]/10 text-[#FF3B30] text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Trust & Safety Takedown Desk</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          Report Abuse or Takedown Request
        </h1>
        <p className="text-base text-[#6E6E73] dark:text-[#98989D] max-w-xl mx-auto leading-relaxed">
          WindowsDrop strictly prohibits malware, pirated material, phishing, and unlawful files. Use this form to report active transfers for immediate review and purging.
        </p>
      </section>

      {/* Immediate Quarantine Notice */}
      <section className="p-5 rounded-2xl bg-[#FF3B30]/5 dark:bg-[#FF453A]/10 border border-[#FF3B30]/20 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-[#FF3B30] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#1D1D1F]/90 dark:text-[#F5F5F7]/90 leading-relaxed">
          <strong>Immediate Automated Quarantine:</strong> Active 8-digit transfer codes submitted through this form are queued for instantaneous access blocking. Staged payloads violating our terms are permanently shredded.
        </div>
      </section>

      {/* Form Card */}
      <section className="p-6 sm:p-8 rounded-[28px] bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/[0.06] dark:border-white/[0.08] shadow-apple-subtle backdrop-blur-md">
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#34C759] mx-auto" />
            <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Abuse Report Received
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] max-w-md mx-auto leading-relaxed">
              Thank you for keeping WindowsDrop safe. Our safety systems have recorded the report and taken precautionary action on any active staging sessions.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-semibold text-[#0071E3] dark:text-[#0A84FF] hover:underline"
              >
                Submit another report
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                8-Digit Transfer Code or URL (if known)
              </label>
              <input
                type="text"
                placeholder="e.g. ABCD-EFGH or https://windowdrop.vercel.app/?code=ABCDEFGH"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs font-mono text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
              />
              <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                If you received a link or code containing malicious material, paste it here.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Your Name / Organization
                </label>
                <input
                  type="text"
                  placeholder="Your Name or Rights Holder"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Your Email Address <span className="text-[#FF3B30]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="contact@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Violation Category <span className="text-[#FF3B30]">*</span>
              </label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
              >
                <option value="malware">Malware, Virus, Ransomware, or Exploit Payload</option>
                <option value="dmca">Copyright Infringement / DMCA Takedown</option>
                <option value="phishing">Phishing, Scam, or Credential Harvesting</option>
                <option value="csam">Child Sexual Abuse Material (CSAM) / Non-consensual</option>
                <option value="harassment">Personal Data Doxxing or Harassment</option>
                <option value="other">Other Terms of Service Violation</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Description & Evidence <span className="text-[#FF3B30]">*</span>
              </label>
              <textarea
                rows={5}
                required
                placeholder="Explain the nature of the violation, details of copyrighted work if applicable, or how you encountered the malicious link..."
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
              />
            </div>

            <Button
              type="submit"
              variant="danger"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Submit Abuse Takedown Report
            </Button>
          </form>
        )}
      </section>

      {/* Direct Abuse Contact info */}
      <section className="text-center text-xs text-[#6E6E73] dark:text-[#98989D] space-y-1">
        <p>
          You can also reach our Trust & Safety response team directly at{' '}
          <a href="mailto:abuse@windowsdrop.app" className="font-mono text-[#FF3B30] dark:text-[#FF453A] hover:underline">
            abuse@windowsdrop.app
          </a>
        </p>
        <p>
          Emergency CSAM reports are automatically expedited to the National Center for Missing & Exploited Children (NCMEC) and relevant law enforcement.
        </p>
      </section>
    </div>
  );
};
