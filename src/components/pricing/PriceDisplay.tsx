import { cn } from "@/lib/utils";

type PriceDisplayProps = {
  amount: number;
  className?: string;
};

/** Price with a slightly smaller dollar sign. */
export function PriceDisplay({ amount, className = "font-serif text-4xl" }: PriceDisplayProps) {
  return (
    <span className={cn(className)}>
      <span className="mr-0.5 text-[0.62em] font-normal leading-none align-[0.32em]">
        $
      </span>
      {amount}
    </span>
  );
}
