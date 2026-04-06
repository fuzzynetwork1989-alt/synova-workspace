import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const glassButtonVariants = cva(
  "glass-button inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "glass-button bg-primary/20 text-primary-foreground hover:bg-primary/30",
        destructive: "glass-button bg-destructive/20 text-destructive-foreground hover:bg-destructive/30",
        outline: "glass-button border-2 bg-transparent hover:bg-accent/20",
        secondary: "glass-button bg-secondary/20 text-secondary-foreground hover:bg-secondary/30",
        ghost: "glass-button bg-transparent hover:bg-accent/20",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "synova-gradient text-primary-foreground hover:opacity-90",
        glowing: "glass-button pulse-glow bg-primary/30 text-primary-foreground",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-4 text-lg",
        xl: "px-10 py-5 text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }
