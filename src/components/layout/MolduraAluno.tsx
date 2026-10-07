export function MolduraAluno({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto h-dvh w-full max-w-[440px] overflow-hidden bg-bg text-ink">
      {children}
    </div>
  );
}
