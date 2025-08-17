import React, { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "strong"
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-white/20 shadow-xl transition-all duration-300",
        {
          "bg-white/10 backdrop-blur-md": variant === "default",
          "bg-white/5 backdrop-blur-sm": variant === "subtle",
          "bg-white/20 backdrop-blur-lg": variant === "strong",
        },
        className,
      )}
      {...props}
    />
  )
})
GlassCard.displayName = "GlassCard"

export { GlassCard }
