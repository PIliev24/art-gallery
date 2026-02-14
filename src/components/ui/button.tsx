import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium tracking-wide uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-500)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-gallery-900)] text-[var(--color-gallery-100)] hover:bg-[var(--color-gallery-800)] border border-[var(--color-gallery-700)]',
        gold:
          'bg-[var(--color-gold-500)] text-[var(--color-gallery-950)] hover:bg-[var(--color-gold-400)] font-semibold',
        outline:
          'border border-[var(--color-gallery-300)] text-[var(--color-gallery-700)] hover:bg-[var(--color-gallery-100)] hover:border-[var(--color-gallery-400)]',
        'outline-light':
          'border border-[var(--color-gallery-500)] text-[var(--color-gallery-200)] hover:bg-white/10 hover:border-[var(--color-gallery-300)]',
        ghost:
          'text-[var(--color-gallery-600)] hover:text-[var(--color-gallery-900)] hover:bg-[var(--color-gallery-100)]',
        link:
          'text-[var(--color-gold-500)] underline-offset-4 hover:underline tracking-normal normal-case',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-10 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
