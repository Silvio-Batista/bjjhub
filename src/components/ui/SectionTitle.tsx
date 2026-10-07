export function SectionTitle({
  children,
  acao,
}: {
  children: React.ReactNode;
  acao?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 className="text-[12px] font-semibold tracking-[0.08em] text-muted uppercase">
        {children}
      </h2>
      {acao}
    </div>
  );
}
