interface CostLineProps {
  label: string;
  value: string;
  isBold?: boolean;
}

function CostLine({ label, value, isBold }: CostLineProps) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className={isBold ? 'font-medium text-foreground' : 'text-muted-foreground'}>
        {label}
      </span>
      <span className={isBold ? 'font-semibold text-foreground' : 'text-foreground'}>{value}</span>
    </div>
  );
}

export function CostBreakdown() {
  return (
    <div className="space-y-1.5">
      <CostLine label="Reward pool deposit" value="5.0 SOL" />
      <CostLine label="Platform fee (2%)" value="0.1 SOL" />
      <CostLine label="On-chain storage rent (est.)" value="~0.005 SOL" />
      <div className="my-2 border-t border-border" />
      <CostLine label="Total to deploy" value="5.105 SOL" isBold />
    </div>
  );
}
