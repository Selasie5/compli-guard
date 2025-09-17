import { cn } from "@/lib/utils"

interface LoadingDotsProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingDots({ className, size = "md" }: LoadingDotsProps) {
  const sizeClasses = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3"
  }

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <div 
        className={cn(
          "bg-current rounded-full animate-bounce",
          sizeClasses[size]
        )}
        style={{ animationDelay: "-0.32s" }}
      />
      <div 
        className={cn(
          "bg-current rounded-full animate-bounce",
          sizeClasses[size]
        )}
        style={{ animationDelay: "-0.16s" }}
      />
      <div 
        className={cn(
          "bg-current rounded-full animate-bounce",
          sizeClasses[size]
        )}
      />
    </div>
  )
}