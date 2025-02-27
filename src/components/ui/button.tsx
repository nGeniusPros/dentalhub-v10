import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-navy text-white shadow hover:bg-navy-light",
        secondary:
          "border border-gray-light text-gray-darker hover:bg-gray-lighter",
        destructive:
          "bg-purple text-white shadow-sm hover:bg-purple/90",
        outline:
          "border border-gray-light bg-white shadow-sm hover:bg-gray-lighter hover:text-navy",
        gold:
          "bg-gold text-white shadow-sm hover:bg-gold-light",
        turquoise:
          "bg-turquoise text-white shadow-sm hover:bg-turquoise-light",
        ghost: "hover:bg-gray-lighter hover:text-navy dark:hover:text-white dark:hover:bg-navy/20",
        link: "text-navy underline-offset-4 hover:underline dark:text-turquoise",
        "gradient-ocean": 
          "bg-gradient-ocean text-white shadow-sm hover:shadow-md transition-shadow",
        "gradient-gold": 
          "bg-gradient-gold text-navy shadow-sm hover:shadow-md transition-shadow",
        "gradient-tropical": 
          "bg-gradient-tropical text-navy shadow-sm hover:shadow-md transition-shadow",
        "gradient-royal": 
          "bg-gradient-royal text-white shadow-sm hover:shadow-md transition-shadow",
        "gradient-nature": 
          "bg-gradient-nature text-navy shadow-sm hover:shadow-md transition-shadow",
        "gradient-corporate": 
          "bg-gradient-corporate text-white shadow-sm hover:shadow-md transition-shadow",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
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
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };