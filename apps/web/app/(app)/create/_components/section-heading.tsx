import type { ReactNode } from 'react';

interface SectionHeadingProps {
  step: number;
  id: string;
  children: ReactNode;
}

export function SectionHeading({ step, id, children }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold shrink-0 ring-2 ring-primary/30">
        {step}
      </span>
      <h2 id={id} className="text-base font-semibold text-foreground">
        {children}
      </h2>
    </div>
  );
}
