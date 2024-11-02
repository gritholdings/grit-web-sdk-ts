import * as React from "react"
 
import { cn } from "./utils/utils.ts"
 
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg bg-card text-neutral-100 bg-neutral-800",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export {
    Card
};