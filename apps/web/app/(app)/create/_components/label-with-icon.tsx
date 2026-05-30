import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { Label } from '@survey/ui/components/label';
import type { ReactNode } from 'react';

interface LabelWithIconProps {
  htmlFor: string;
  icon: IconSvgElement;
  children: ReactNode;
}

export function LabelWithIcon({ htmlFor, icon, children }: LabelWithIconProps) {
  return (
    <Label htmlFor={htmlFor}>
      <div className="flex items-center gap-1.5">
        <HugeiconsIcon icon={icon} size={12} strokeWidth={1.5} aria-hidden="true" />
        {children}
      </div>
    </Label>
  );
}
