import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const glassCardVariants = cva(
  "glass rounded-2xl p-6 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "glass-card",
        elevated: "glass-card shadow-2xl",
        compact: "glass p-4 rounded-xl",
        floating: "glass-card float-animation",
        glowing: "glass-card pulse-glow",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        xl: "p-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(glassCardVariants({ variant, size, className }))}
      {...props}
    />
  )
)
GlassCard.displayName = "GlassCard"

export { GlassCard, glassCardVariants }
