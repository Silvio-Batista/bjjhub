export function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="64" height="64" rx="16" fill="#111318" />
      <rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="#444850" />
      <path fill="#E31B2B" d="M15 12h10v40H15z" />
      <path fill="#E31B2B" d="M25 12h20v9H25z" />
      <path fill="#E31B2B" d="M39 21h10v9H39z" />
      <path fill="#C41725" d="M25 29h16v8H25z" />
      <path fill="#E31B2B" d="M39 37h10v9H39z" />
      <path fill="#E31B2B" d="M25 43h20v9H25z" />
      <path fill="#A44850" d="M25 12h10L25 22z" />
    </svg>
  );
}

export function LogoHorizontal() {
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={44} />
      <div>
        <p className="text-[20px] leading-none font-semibold tracking-tight">BJJHub</p>
        <p className="mt-1 text-[12px] text-muted">Sua academia em evolução</p>
      </div>
    </div>
  );
}
