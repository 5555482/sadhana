export function PageHeader({ title }: { title: string }) {
  return (
    <header className="page-header">
      <div className="page-header-row" aria-hidden="true">
        <span />
        <span />
      </div>
      <img className="logo" src="/images/logo.png" alt={title} />
    </header>
  );
}
