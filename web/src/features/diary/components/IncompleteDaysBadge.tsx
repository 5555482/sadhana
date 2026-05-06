export function IncompleteDaysBadge({ count }: { count: number }) {
  return (
    <div className="incomplete-badge" aria-label={`${count} incomplete days`}>
      <strong>{count}</strong>
      <span>open</span>
    </div>
  );
}
