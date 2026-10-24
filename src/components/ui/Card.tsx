import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'surface' | 'glass' | 'elevated';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'glass', children, className = '', ...props }, ref) => {
    const variantStyles = {
      glass:
        'backdrop-blur-[24px] saturate-[180%] bg-white/80 dark:bg-[#1C1C1E]/80 border border-black/[0.08] dark:border-white/[0.12] shadow-apple-card dark:shadow-apple-dark',
      surface:
        'bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.12] shadow-apple-card dark:shadow-apple-dark',
      elevated:
        'bg-[#F2F2F7] dark:bg-[#2C2C2E] border border-black/[0.06] dark:border-white/[0.1] shadow-apple-floating',
    }[variant];

    return (
      <motion.div
        ref={ref}
        className={`rounded-[24px] p-6 sm:p-8 transition-colors ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
