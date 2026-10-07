/**
 * Premium Biscuit/Warm Cream Button Component
 * Enforces smooth rounded edges, micro-interaction feedback (<=200ms),
 * single-line text, and accessible focus outlines.
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Spatial math: horizontal padding ~2x vertical padding
    const sizeClasses = {
      sm: 'text-xs py-1.5 px-3.5 rounded-xl gap-1.5 min-h-[34px]',
      md: 'text-sm py-2 px-4.5 rounded-2xl gap-2 min-h-[42px]',
      lg: 'text-base py-2.5 px-6 rounded-2xl gap-2.5 min-h-[48px]',
    }[size];

    const variantClasses = {
      // Primary: Rich Dark Chocolate with soft warm-gold border
      primary:
        'bg-[#2E1E18] text-[#FFF9F0] hover:bg-[#4A3024] active:bg-[#1F130E] border border-[#4A3024] shadow-[0_2px_8px_rgba(46,30,24,0.12)] hover:shadow-[0_4px_12px_rgba(46,30,24,0.18)]',
      // Secondary: Warm Biscuit surface with caramel border
      secondary:
        'bg-[#F6EBDD] text-[#2E1E18] hover:bg-[#E8D2B5] active:bg-[#DCC09B] border border-[#E8D2B5] shadow-sm',
      // Outline: Cream background with refined biscuit border
      outline:
        'bg-[#FFFDF9]/80 backdrop-blur-sm text-[#4A3024] hover:bg-[#F6EBDD] border border-[#DCC09B] hover:border-[#B98252]',
      // Ghost: Subtle hover tint
      ghost:
        'bg-transparent text-[#4A3024] hover:bg-[#F6EBDD]/70 active:bg-[#E8D2B5]',
      // Gold: Luxury warm gold accent for primary quantum actions
      gold:
        'bg-[#C5A46D] text-[#2E1E18] font-semibold hover:bg-[#DFB878] active:bg-[#B98252] border border-[#B98252]/40 shadow-[0_2px_10px_rgba(197,164,109,0.25)]',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-medium whitespace-nowrap transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[#B98252] focus-visible:outline-offset-2 ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
            <span>{children}</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span className="truncate">{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
