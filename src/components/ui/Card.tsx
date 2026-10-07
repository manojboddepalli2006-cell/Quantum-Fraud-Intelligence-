/**
 * Premium Biscuit/Warm Cream Card Component
 * Enforces smooth rounded edges, subtle depth, hairline biscuit border,
 * and single-elevation architecture.
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'elevated' | 'glass' | 'subtle';
  rounded?: 'xl' | '2xl' | '3xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'surface',
      rounded = '2xl',
      padding = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const roundedClasses = {
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
    }[rounded];

    const paddingClasses = {
      none: '',
      sm: 'p-4 sm:p-5',
      md: 'p-6 sm:p-7',
      lg: 'p-8 sm:p-10',
    }[padding];

    const variantClasses = {
      // Clean luxury biscuit surface with subtle hairline border
      surface:
        'bg-[#FFFDF9]/95 border border-[#E8D2B5] shadow-[0_4px_20px_rgba(74,48,36,0.04)]',
      // Elevated container with warmer biscuit tone and soft shadow
      elevated:
        'bg-[#FFFDF9] border border-[#DCC09B] shadow-[0_8px_30px_rgba(74,48,36,0.07)]',
      // Translucent frosted glass card over 3D quantum background
      glass:
        'bg-[#FFFDF9]/85 backdrop-blur-md border border-[#E8D2B5]/90 shadow-[0_4px_24px_rgba(74,48,36,0.05)]',
      // Subtle background container for secondary zones
      subtle:
        'bg-[#F6EBDD]/60 border border-[#E8D2B5]/80',
    }[variant];

    return (
      <div
        ref={ref}
        className={`transition-all duration-200 ${roundedClasses} ${variantClasses} ${paddingClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
