/**
 * Premium Biscuit/Warm Cream Input Component
 * Smooth rounded edges, accessible focus indicators, tabular numeral alignment.
 */

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftAddon,
      rightAddon,
      id,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#4A3024]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#8B6245]">
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full bg-[#FFFDF9] border text-[#2E1E18] text-sm rounded-xl py-2.5 transition-all duration-150 placeholder:text-[#8B6245]/50 focus:outline-none focus:ring-2 focus:ring-[#B98252] focus:border-[#B98252] disabled:opacity-50 disabled:bg-[#F6EBDD]/50 shadow-[0_1px_3px_rgba(74,48,36,0.03)] font-mono tabular-nums ${
              leftAddon ? 'pl-10' : 'pl-3.5'
            } ${rightAddon ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-[#B83A2E] focus:ring-[#B83A2E] focus:border-[#B83A2E]'
                : 'border-[#DCC09B] hover:border-[#B98252]'
            } ${className}`}
            {...props}
          />

          {rightAddon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-[#8B6245]">
              {rightAddon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-[#B83A2E] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#8B6245]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
