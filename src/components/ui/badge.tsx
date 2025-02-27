import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-gray-lighter text-gray-darker",
        primary: "bg-navy bg-opacity-10 text-navy",
        secondary: "bg-gold bg-opacity-10 text-gold",
        success: "bg-green bg-opacity-10 text-green",
        warning: "bg-gold bg-opacity-10 text-gold",
        error: "bg-purple bg-opacity-10 text-purple",
        info: "bg-blue bg-opacity-10 text-blue",
        outline: "border border-gray-light text-gray-darker",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
