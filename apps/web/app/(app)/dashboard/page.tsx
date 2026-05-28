export default function DashboardPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Your dashboard</h1>
      <p className="text-muted-foreground">
        {/* TODO(MVP-5): list created surveys + participated surveys with status */}
        Connect your wallet to see your activity.
      </p>
    </section>
  );
}
