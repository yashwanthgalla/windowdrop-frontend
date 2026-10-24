import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16">
      <div className="w-16 h-16 rounded-[20px] bg-black/[0.04] dark:bg-white/[0.08] text-[#0071E3] dark:text-[#0A84FF] flex items-center justify-center mb-6 shadow-sm">
        <Compass className="w-8 h-8 stroke-[1.8]" />
      </div>

      <span className="font-mono text-sm font-semibold text-[#0071E3] dark:text-[#0A84FF] mb-2 uppercase tracking-wider">
        404 Error
      </span>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mb-3">
        Page Not Found
      </h1>
      <p className="text-base text-[#6E6E73] dark:text-[#98989D] max-w-md mb-8">
        The link you followed may be expired or the transfer code address does not exist.
      </p>

      <Link to="/">
        <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to WindowsDrop
        </Button>
      </Link>
    </div>
  );
};
