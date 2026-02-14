import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full border-b border-[var(--color-gallery-300)] bg-transparent px-0 py-2 font-[var(--font-body)] text-sm text-[var(--color-gallery-900)] placeholder:text-[var(--color-gallery-400)] focus:border-[var(--color-gold-500)] focus:outline-none transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
