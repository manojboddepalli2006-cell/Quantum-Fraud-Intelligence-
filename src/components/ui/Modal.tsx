/**
 * Premium Biscuit/Warm Cream Modal Dialog Component
 * Smooth rounded-3xl edges, backdrop blur, accessible ARIA roles and keyboard ESC handler.
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[maxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2E1E18]/40 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        className={`relative w-full ${maxWidthClass} bg-[#FFFDF9] border border-[#DCC09B] rounded-3xl shadow-[0_20px_60px_rgba(46,30,24,0.18)] z-10 overflow-hidden transform transition-all duration-200 animate-in fade-in zoom-in-95`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 sm:p-7 border-b border-[#E8D2B5]">
          <div>
            <h2 id="modal-title" className="text-xl font-semibold text-[#2E1E18]">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-xs text-[#8B6245]">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-[#8B6245] hover:text-[#2E1E18] hover:bg-[#F6EBDD] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#F6EBDD]/60 border-t border-[#E8D2B5]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
