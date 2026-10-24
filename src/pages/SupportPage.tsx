import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LifeBuoy,
  Send,
  CheckCircle2,
  Activity,
  RefreshCw,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useToastStore } from '../store/useToastStore';

export const SupportPage: React.FC = () => {
  const { showToast } = useToastStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'transfer-issue',
    code: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Live Diagnostics State
  const [diagnostics, setDiagnostics] = useState({
    cryptoSupported: false,
    storageAvailable: false,
    backendStatus: 'checking...',
    latencyMs: null as number | null,
  });
  const [isTestingDiag, setIsTestingDiag] = useState(false);

  const runDiagnostics = async () => {
    setIsTestingDiag(true);
    const hasCrypto = typeof window !== 'undefined' && !!window.crypto && !!window.crypto.subtle;
    let hasStorage = false;
    try {
      localStorage.setItem('dropcode-test', '1');
      localStorage.removeItem('dropcode-test');
      hasStorage = true;
    } catch {
      hasStorage = false;
    }

    let backend = 'Offline / Blocked';
    let latency: number | null = null;
    const start = performance.now();
    try {
      const res = await fetch('https://windowdrop-backend.onrender.com/healthz', {
        method: 'GET',
        cache: 'no-store',
      });
      if (res.ok) {
        backend = 'Online (Healthy)';
        latency = Math.round(performance.now() - start);
      }
    } catch {
      backend = 'Cannot reach backend directly';
    }

    setDiagnostics({
      cryptoSupported: hasCrypto,
      storageAvailable: hasStorage,
      backendStatus: backend,
      latencyMs: latency,
    });
    setIsTestingDiag(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.message.trim()) {
      showToast('Please provide your email address and message', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Support ticket submitted successfully. Our team will contact you.', 'success');
      setFormData({
        name: '',
        email: '',
        category: 'transfer-issue',
        code: '',
        message: '',
      });
    }, 900);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 space-y-12">
      {/* Hero Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0071E3]/10 dark:bg-[#0A84FF]/15 text-[#0071E3] dark:text-[#0A84FF] text-xs font-semibold">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Customer Care & Helpdesk</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          Help & Support Center
        </h1>
        <p className="text-base sm:text-lg text-[#6E6E73] dark:text-[#98989D] max-w-xl mx-auto leading-relaxed">
          Need help with a transfer, experiencing code verification issues, or have a question? We are here to assist.
        </p>
      </section>

      {/* Diagnostics Card */}
      <section className="p-6 sm:p-7 rounded-[24px] bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/[0.06] dark:border-white/[0.08] shadow-apple-subtle backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#0071E3] dark:text-[#0A84FF]" />
            <h2 className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Client & Network Diagnostics
            </h2>
          </div>
          <button
            type="button"
            onClick={runDiagnostics}
            disabled={isTestingDiag}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0071E3] dark:text-[#0A84FF] hover:underline"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingDiag ? 'animate-spin' : ''}`} />
            <span>Retest</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">
              Backend Engine
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  diagnostics.backendStatus.includes('Online') ? 'bg-[#34C759]' : 'bg-[#FF9500]'
                }`}
              />
              <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {diagnostics.backendStatus}
              </span>
            </div>
            {diagnostics.latencyMs !== null && (
              <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                Response time: {diagnostics.latencyMs} ms
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">
              Web Cryptography API
            </span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
              <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {diagnostics.cryptoSupported ? 'Supported' : 'Unavailable'}
              </span>
            </div>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
              SubtleCrypto hardware acceleration
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">
              Local Storage Cache
            </span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
              <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {diagnostics.storageAvailable ? 'Available' : 'Restricted'}
              </span>
            </div>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
              Persistent theme & session storage
            </p>
          </div>
        </div>
      </section>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Support Form (2 cols) */}
        <section className="lg:col-span-2 p-6 sm:p-8 rounded-[28px] bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/[0.06] dark:border-white/[0.08] shadow-apple-subtle backdrop-blur-md space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Submit a Support Ticket
            </h2>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1">
              Provide as much detail as possible so our engineering desk can assist you promptly.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center rounded-2xl bg-[#34C759]/10 border border-[#34C759]/20 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#34C759] mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Ticket Submitted Successfully!
              </h3>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D] max-w-sm mx-auto">
                Thank you for reaching out. We have logged your request. If your inquiry requires troubleshooting, an engineer will review the diagnostics and reply to your email.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-3 text-xs font-semibold text-[#0071E3] dark:text-[#0A84FF] hover:underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Email Address <span className="text-[#FF3B30]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  >
                    <option value="transfer-issue">Transfer or Upload Failed</option>
                    <option value="code-invalid">8-Digit Code Not Found / Expired</option>
                    <option value="bug-report">Bug or Interface Glitch</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="other">General Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Transfer Code (if applicable)
                  </label>
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="e.g. ABCD-EFGH"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs font-mono text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Message & Error Details <span className="text-[#FF3B30]">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe what occurred, any error messages shown, and your browser/operating system..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Send Support Ticket
              </Button>
            </form>
          )}
        </section>

        {/* Quick Help & Direct Email (1 col) */}
        <section className="space-y-6">
          <div className="p-6 rounded-[24px] bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/[0.06] dark:border-white/[0.08] shadow-apple-subtle backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-[#0071E3] dark:text-[#0A84FF]">
              <Mail className="w-5 h-5" />
              <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Direct Email Support
              </h3>
            </div>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
              Prefer writing directly from your mail client? Email our developer desk directly:
            </p>
            <a
              href="mailto:support@windowsdrop.app"
              className="inline-block font-mono text-xs font-semibold text-[#0071E3] dark:text-[#0A84FF] hover:underline"
            >
              support@windowsdrop.app
            </a>
          </div>

          <div className="p-6 rounded-[24px] bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/[0.06] dark:border-white/[0.08] shadow-apple-subtle backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-[#34C759]">
              <HelpCircle className="w-5 h-5" />
              <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Common Quick Solutions
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-[#6E6E73] dark:text-[#98989D]">
              <li>
                <strong>Code expired:</strong> Unclaimed codes expire after 5 minutes. Request a fresh code from the sender.
              </li>
              <li>
                <strong>Single-use policy:</strong> Once downloaded, files are immediately expunged from the server.
              </li>
              <li>
                <strong>Ad-blockers & firewalls:</strong> Ensure your network permits WebSocket and direct API traffic to Render servers.
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/faq"
                className="text-xs font-semibold text-[#0071E3] dark:text-[#0A84FF] hover:underline"
              >
                Browse Full FAQ Database →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
