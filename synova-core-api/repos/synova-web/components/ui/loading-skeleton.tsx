import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "text" | "rectangular"
}

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "rounded-lg",
      circular: "rounded-full",
      text: "h-4 rounded",
      rectangular: "rounded-none",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "loading-skeleton animate-pulse bg-muted",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)
LoadingSkeleton.displayName = "LoadingSkeleton"

export { LoadingSkeleton }
