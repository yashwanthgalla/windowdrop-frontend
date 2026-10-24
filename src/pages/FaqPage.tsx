import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ChevronDown,
  Search,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface FaqItem {
  id: string;
  category: 'general' | 'limits' | 'security' | 'troubleshooting';
  question: string;
  answer: string;
}

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<string[]>(['what-is-windowsdrop', 'code-lifetime']);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const faqs: FaqItem[] = [
    {
      id: 'what-is-windowsdrop',
      category: 'general',
      question: 'What is WindowsDrop and how is it different from Google Drive or Dropbox?',
      answer:
        'WindowsDrop is an ephemeral peer-to-peer file transfer engine, not a permanent cloud drive. Traditional cloud storage keeps your files indefinitely until you manually delete them. WindowsDrop stores your files in a temporary encrypted buffer only long enough for your recipient to receive them. Once downloaded or once the countdown expires, files are automatically shredded and permanently deleted.',
    },
    {
      id: 'file-size-limits',
      category: 'limits',
      question: 'What are the transfer size limits?',
      answer:
        'You can send single files, multiple files, or entire directory trees up to 500 MB per transfer for free. There is no file count limit within the 500 MB budget.',
    },
    {
      id: 'code-lifetime',
      category: 'general',
      question: 'How long does the 8-digit transfer code remain valid?',
      answer:
        'Transfer codes expire in 5 minutes if unclaimed. Once a receiver verifies the code and begins claiming, a 15-minute download window is granted to stream and retrieve the files before the staging session is closed and purged.',
    },
    {
      id: 'file-security',
      category: 'security',
      question: 'Are my files encrypted during transfer?',
      answer:
        'Yes. All data in transit is protected using TLS 1.3 / HTTPS encryption. While buffered on the staging server, files are protected with AES-256-GCM. We never index your file contents or store file data in our relational database.',
    },
    {
      id: 'brute-force',
      category: 'security',
      question: 'Can someone randomly guess my 8-digit transfer code?',
      answer:
        'No. Codes are composed of 8 cryptographically random alphanumeric characters from a high-entropy keyspace (over 2.8 trillion combinations). WindowsDrop enforces strict rate limiting: if a visitor fails 5 verification attempts, that transfer session is automatically locked and access is denied.',
    },
    {
      id: 'folder-support',
      category: 'general',
      question: 'Can I transfer nested folders and directory structures?',
      answer:
        'Yes! You can drag and drop folders or click "Add Folder". WindowsDrop preserves the exact relative paths of all subdirectories. When your receiver downloads the transfer, they can download individual files or a single structured ZIP archive with the complete folder hierarchy intact.',
    },
    {
      id: 'account-required',
      category: 'general',
      question: 'Do I need to sign up or create an account to use WindowsDrop?',
      answer:
        'No! WindowsDrop is designed to be frictionless. Anyone can send and receive files as a guest immediately. If you choose to sign in with Google or email, you gain access to your transfer history and recipient logs.',
    },
    {
      id: 'executable-guardrails',
      category: 'security',
      question: 'Why are certain executable file extensions restricted?',
      answer:
        'To prevent malware distribution and drive-by virus execution, extensions such as .exe, .bat, .cmd, .msi, and .ps1 are subject to safety checks and require verified accounts. Standard documents, images, video, archives, and code files are always allowed.',
    },
    {
      id: 'post-download-retention',
      category: 'security',
      question: 'Can I download a transfer multiple times?',
      answer:
        'WindowsDrop is single-use by design. Once the receiver confirms that all items are downloaded, the transfer moves to the "delivered" state and the server initiates immediate physical file deletion from disk. If you need to share files again, simply create a new transfer.',
    },
    {
      id: 'transfer-cancelled',
      category: 'troubleshooting',
      question: 'What happens if my internet disconnects during upload?',
      answer:
        'Our client uses parallel chunked uploads with a live heartbeat. If an upload fails due to network interruption, you will receive an error notice and can retry immediately without losing your selected files list.',
    },
    {
      id: 'device-compatibility',
      category: 'troubleshooting',
      question: 'Which devices and browsers are supported?',
      answer:
        'WindowsDrop works on all modern web browsers supporting ES6 and standard Fetch/XHR APIs, including Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, and mobile browsers on iOS and Android.',
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === 'all' || faq.category === activeCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [faqs, activeCategory, searchQuery]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 space-y-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0071E3]/10 dark:bg-[#0A84FF]/15 text-[#0071E3] dark:text-[#0A84FF] text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          Frequently Asked Questions
        </h1>
        <p className="text-base sm:text-lg text-[#6E6E73] dark:text-[#98989D] max-w-xl mx-auto leading-relaxed">
          Everything you need to know about DropCode transfers, cryptographic codes, security, and storage lifecycles.
        </p>

        {/* Search input */}
        <div className="max-w-md mx-auto relative pt-2">
          <Search className="w-4 h-4 text-[#6E6E73] dark:text-[#98989D] absolute left-3.5 top-5" />
          <input
            type="text"
            placeholder="Search questions (e.g., limits, encryption, folders)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-[#1C1C1E]/80 border border-black/[0.08] dark:border-white/[0.1] text-sm text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#98989D] focus:outline-none focus:ring-2 focus:ring-[#0071E3] shadow-apple-subtle transition-all"
          />
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'general', label: 'General & How-To' },
            { id: 'limits', label: 'File Limits' },
            { id: 'security', label: 'Security & Privacy' },
            { id: 'troubleshooting', label: 'Troubleshooting' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#0071E3] text-white shadow-sm'
                  : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#6E6E73] dark:text-[#98989D] hover:bg-black/[0.08] dark:hover:bg-white/[0.1]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Accordion FAQ list */}
      <section className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 p-8 rounded-2xl bg-white/50 dark:bg-[#1C1C1E]/50 border border-black/[0.06] dark:border-white/[0.08]">
            <p className="text-sm text-[#6E6E73] dark:text-[#98989D]">
              No questions matched your search query "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-3 text-xs font-semibold text-[#0071E3] dark:text-[#0A84FF] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-white/70 dark:bg-[#1C1C1E]/70 border border-black/[0.06] dark:border-white/[0.08] shadow-apple-subtle backdrop-blur-md overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-semibold text-sm sm:text-base text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6E6E73] dark:text-[#98989D] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#0071E3] dark:text-[#0A84FF]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed border-t border-black/[0.03] dark:border-white/[0.04]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Still need help CTA */}
      <section className="p-8 rounded-[24px] bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Still have questions or need assistance?
          </h3>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
            Our support desk is available to assist with transfer diagnostics or bug reports.
          </p>
        </div>
        <Link to="/support">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Contact Support
          </Button>
        </Link>
      </section>
    </div>
  );
};
