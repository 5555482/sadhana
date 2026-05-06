export function PageHeader({ title }: { title: string }) {
  return (
    <header className="page-header">
      <p>{title}</p>
    </header>
  );
}
