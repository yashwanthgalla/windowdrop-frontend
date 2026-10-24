import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, CheckCircle2, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { PlanDto, EntitlementDto } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { startCheckout } from '../features/billing/startCheckout';
import { Button } from '../components/ui/Button';

export const PlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<PlanDto[]>([]);
  const [entitlement, setEntitlement] = useState<EntitlementDto | null>(null);
  const [payingCode, setPayingCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const plansRes = await apiClient.getPlans();
        setPlans(plansRes.plans);

        if (user) {
          const ent = await apiClient.getEntitlement().catch(() => null);
          setEntitlement(ent);
        }
      } catch (err) {
        console.error('Failed to load plan data:', err);
      }
    }
    loadData();
  }, [user]);

  const handlePay = async (code: string) => {
    if (!user) {
      navigate('/auth?mode=signin&next=/plan');
      return;
    }
    setPayingCode(code);
    try {
      await startCheckout(code);
    } finally {
      setPayingCode(null);
    }
  };

  const standardPlan = plans.find((p) => p.code === 'standard') || {
    code: 'standard',
    name: 'Standard Plan',
    pricePaise: 4900,
    maxBytes: 5368709120,
    validDays: 365,
  };

  const largePlan = plans.find((p) => p.code === 'large') || {
    code: 'large',
    name: 'Large Plan',
    pricePaise: 7900,
    maxBytes: 21474836480,
    validDays: 365,
  };

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-8">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-sm text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Transfers
      </button>

      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] dark:text-[#0A84FF] text-xs font-semibold mb-4"
        >
          <Crown className="w-3.5 h-3.5" />
          DropCode Subscription Plans
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mb-3">
          Share bigger. Transfer faster.
        </h1>
        <p className="text-lg text-[#6E6E73] dark:text-[#98989D] max-w-xl mx-auto">
          One annual pass covers unlimited transfers for an entire year. Staging files remain end-to-end encrypted.
        </p>
      </div>

      {entitlement && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-2xl bg-[#34C759]/10 border border-[#34C759]/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
            <div>
              <p className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Active Plan: {entitlement.planName || entitlement.planCode}
              </p>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                Valid until {new Date(entitlement.expiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#34C759] text-white">
            Active
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Standard Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">
                Standard
              </span>
              <Zap className="w-5 h-5 text-[#0071E3] dark:text-[#0A84FF]" />
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                ₹{standardPlan.pricePaise / 100}
              </span>
              <span className="text-sm text-[#6E6E73] dark:text-[#98989D]">/ 1 year</span>
            </div>
            <p className="text-sm text-[#6E6E73] dark:text-[#98989D] mb-6">
              Ideal for medium-size files, archives, and work directories.
            </p>

            <ul className="space-y-3 mb-8 text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                Up to 5 GB per transfer
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                Full folder & directory sharing
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                Executable files (.exe, .msi, etc.) supported
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                Valid for 365 days
              </li>
            </ul>
          </div>

          <Button
            variant="primary"
            onClick={() => handlePay('standard')}
            isLoading={payingCode === 'standard'}
            className="w-full"
          >
            {entitlement?.planCode === 'standard' ? 'Renew ₹49' : 'Get Standard (₹49)'}
          </Button>
        </motion.div>

        {/* Large Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl border-2 border-[#0071E3] dark:border-[#0A84FF] shadow-2xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 bg-[#0071E3] dark:bg-[#0A84FF] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Popular
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3] dark:text-[#0A84FF]">
                Large
              </span>
              <Crown className="w-5 h-5 text-[#0071E3] dark:text-[#0A84FF]" />
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                ₹{largePlan.pricePaise / 100}
              </span>
              <span className="text-sm text-[#6E6E73] dark:text-[#98989D]">/ 1 year</span>
            </div>
            <p className="text-sm text-[#6E6E73] dark:text-[#98989D] mb-6">
              Maximum speed and capacity for massive transfers up to 20 GB.
            </p>

            <ul className="space-y-3 mb-8 text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                Up to 20 GB per transfer
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                Full folder & nested directory trees
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                Executable files (.exe, .msi, etc.) supported
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                Valid for 365 days
              </li>
            </ul>
          </div>

          <Button
            variant="primary"
            onClick={() => handlePay('large')}
            isLoading={payingCode === 'large'}
            className="w-full bg-[#0071E3] hover:bg-[#0077ED]"
          >
            {entitlement?.planCode === 'large' ? 'Renew ₹79' : 'Get Large (₹79)'}
          </Button>
        </motion.div>
      </div>

      <div className="text-center p-6 rounded-2xl bg-white/40 dark:bg-[#1C1C1E]/40 border border-black/5 dark:border-white/5">
        <p className="text-xs text-[#6E6E73] dark:text-[#98989D] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0071E3]" />
          Executable files (.exe, .msi, etc.) require an active paid plan. Zero permanent file retention.
        </p>
      </div>
    </div>
  );
};
