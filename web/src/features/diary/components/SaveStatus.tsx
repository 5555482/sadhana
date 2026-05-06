type SaveStatusProps = {
  dirty: boolean;
  completed: number;
  total: number;
};

export function SaveStatus({ dirty, completed, total }: SaveStatusProps) {
  const label = dirty ? "Unsaved changes" : "All changes saved";

  return (
    <div className="save-status" aria-live="polite">
      <span>{label}</span>
      <strong>
        {completed}/{total}
      </strong>
    </div>
  );
}
