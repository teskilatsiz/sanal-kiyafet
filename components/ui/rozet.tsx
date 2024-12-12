import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const rozetDegiskenleri = cva(
 "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
 {
   variants: {
     varyant: {
       varsayilan:
         "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
       ikincil:
         "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
       yikici:
         "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
       anahat: "text-foreground",
     },
   },
   defaultVariants: {
     varyant: "varsayilan",
   },
 }
)

export interface RozetOzellikleri
 extends React.HTMLAttributes<HTMLDivElement>,
   VariantProps<typeof rozetDegiskenleri> {}

function Rozet({ className, varyant, ...props }: RozetOzellikleri) {
 return (
   <div className={cn(rozetDegiskenleri({ varyant }), className)} {...props} />
 )
}

export { Rozet, rozetDegiskenleri }

