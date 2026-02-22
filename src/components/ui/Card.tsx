import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Card component for grouping related content
 * - Clean visual separation
 * - Optional header and footer
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  headerAction,
  footer,
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {(title || headerAction) && (
        <div className="px-4 py-4 sm:px-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {headerAction && (
            <div className="flex-shrink-0">{headerAction}</div>
          )}
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
      {footer && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};
