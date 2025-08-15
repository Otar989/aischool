import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { forwardRef } from "react"

export interface GradientButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "glass"
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95",
          {
            "bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-lg hover:shadow-xl":
              variant === "primary",
            "bg-gradient-to-r from-secondary to-gray-300 text-secondary-foreground": variant === "secondary",
            "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20":
              variant === "glass",
          },
          className,
        )}
        {...props}
      />
    )
  },
)
GradientButton.displayName = "GradientButton"

export { GradientButton }
