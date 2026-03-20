export default function Header() {
  return (
    <header className="w-full px-6 py-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4h12M2 8h8M2 12h10"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="text-white font-semibold tracking-tight text-lg">
          ProposalAI
        </span>
      </div>

      <nav className="flex items-center gap-1">
        <span
          className="text-xs px-3 py-1.5 rounded-lg"
          style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}
        >
          히스토리
        </span>
        <span
          className="text-xs px-3 py-1.5 rounded-lg"
          style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}
        >
          프롬프트
        </span>
      </nav>
    </header>
  );
}
