import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] dark:focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black disabled:opacity-45 disabled:pointer-events-none select-none';

    const sizeStyles = {
      sm: 'h-9 px-3.5 text-xs tracking-tight gap-1.5',
      md: 'h-11 px-5 text-sm tracking-tight gap-2',
      lg: 'h-13 px-6 text-base tracking-tight gap-2.5',
    }[size];

    const variantStyles = {
      primary:
        'bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-sm shadow-[#0071E3]/20 dark:bg-[#0A84FF] dark:hover:bg-[#0071E3]',
      secondary:
        'bg-[#E5E5EA]/70 hover:bg-[#E5E5EA] text-[#1D1D1F] dark:bg-[#2C2C2E] dark:hover:bg-[#3A3A3C] dark:text-[#F5F5F7] border border-black/[0.06] dark:border-white/[0.08]',
      ghost:
        'bg-transparent hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-[#1D1D1F] dark:text-[#F5F5F7]',
      danger:
        'bg-[#FF3B30] hover:bg-[#E0352B] text-white shadow-sm shadow-[#FF3B30]/20',
    }[variant];

    return (
      <motion.button
        ref={ref}
        whileTap={disabled || isLoading ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
