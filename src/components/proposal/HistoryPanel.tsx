"use client";

import type { Proposal } from "@/lib/supabase";

interface HistoryPanelProps {
  proposals: Proposal[];
  loading: boolean;
  onSelect: (proposal: Proposal) => void;
  onDelete: (id: string) => void;
  onStar: (id: string, current: boolean) => void;
  selectedId?: string;
}

export default function HistoryPanel({
  proposals,
  loading,
  onSelect,
  onDelete,
  onStar,
  selectedId,
}: HistoryPanelProps) {
  const starred = proposals.filter((p) => p.is_starred);
  const recent = proposals.filter((p) => !p.is_starred);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <p
        className="text-xs font-medium uppercase tracking-widest mb-4 shrink-0"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        히스토리
        {proposals.length > 0 && (
          <span
            className="ml-2 px-1.5 py-0.5 rounded-md text-xs font-normal"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
          >
            {proposals.length}
          </span>
        )}
      </p>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 rounded-xl animate-pulse-glass"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          생성된 제안서가 없습니다
        </p>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-glass space-y-1 -mr-1 pr-1">
          {starred.length > 0 && (
            <>
              <p className="text-xs mb-1 mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                즐겨찾기
              </p>
              {starred.map((p) => (
                <HistoryItem
                  key={p.id}
                  proposal={p}
                  isSelected={p.id === selectedId}
                  onSelect={onSelect}
                  onDelete={onDelete}
                  onStar={onStar}
                />
              ))}
              {recent.length > 0 && (
                <p className="text-xs mb-1 mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>
                  최근
                </p>
              )}
            </>
          )}
          {recent.map((p) => (
            <HistoryItem
              key={p.id}
              proposal={p}
              isSelected={p.id === selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
              onStar={onStar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryItem({
  proposal,
  isSelected,
  onSelect,
  onDelete,
  onStar,
}: {
  proposal: Proposal;
  isSelected: boolean;
  onSelect: (p: Proposal) => void;
  onDelete: (id: string) => void;
  onStar: (id: string, current: boolean) => void;
}) {
  const hostname = (() => {
    try {
      return new URL(proposal.url).hostname.replace("www.", "");
    } catch {
      return proposal.url;
    }
  })();

  const date = new Date(proposal.created_at).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="group flex items-start gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
      style={{
        background: isSelected ? "rgba(255,255,255,0.1)" : "transparent",
        border: `1px solid ${isSelected ? "rgba(255,255,255,0.15)" : "transparent"}`,
      }}
      onClick={() => onSelect(proposal)}
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }
      }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-medium truncate"
          style={{ color: isSelected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)" }}
        >
          {hostname}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
          {date}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStar(proposal.id, proposal.is_starred);
          }}
          className="p-1 rounded-lg transition-colors"
          style={{ color: proposal.is_starred ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)" }}
          title={proposal.is_starred ? "즐겨찾기 해제" : "즐겨찾기"}
        >
          {proposal.is_starred ? "★" : "☆"}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("이 제안서를 삭제할까요?")) onDelete(proposal.id);
          }}
          className="p-1 rounded-lg transition-colors"
          style={{ color: "rgba(255,80,80,0.5)" }}
          title="삭제"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 3h8M5 3V2h2v1M4.5 3v6M7.5 3v6M3 3l.5 7h5l.5-7"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
