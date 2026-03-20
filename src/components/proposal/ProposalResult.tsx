"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GenerationStatus } from "@/types";

interface ProposalResultProps {
  content: string;
  status: GenerationStatus;
  sourceUrl?: string;
}

export default function ProposalResult({ content, status, sourceUrl }: ProposalResultProps) {
  const isEmpty = !content && status === "idle";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  if (status === "crawling" || (status === "generating" && !content)) {
    return (
      <div
        className="glass-card p-8 flex flex-col items-center justify-center text-center"
        style={{ minHeight: 320 }}
      >
        <div
          className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center animate-pulse-glass"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <span className="text-xl">
            {status === "crawling" ? "🔍" : "✦"}
          </span>
        </div>
        <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
          {status === "crawling" ? "URL 분석 중..." : "제안서 생성 중..."}
        </p>
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
          {status === "crawling" ? "웹사이트 내용을 가져오는 중입니다" : "AI가 제안서를 작성하고 있습니다"}
        </p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        className="glass-card p-8 flex flex-col items-center justify-center text-center"
        style={{ minHeight: 320 }}
      >
        <div
          className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12h6M9 16h4M7 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2M9 4h6a1 1 0 010 2H9a1 1 0 010-2z"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
          제안서가 여기에 표시됩니다
        </p>
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          URL을 입력하고 제안서 생성 버튼을 눌러주세요
        </p>
      </div>
    );
  }

  if (status === "error" && !content) {
    return (
      <div
        className="glass-card p-8 flex flex-col items-center justify-center text-center"
        style={{ minHeight: 320 }}
      >
        <div
          className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center"
          style={{ background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="rgba(255,100,100,0.6)" strokeWidth="1.5" />
            <path d="M12 8v4M12 16h.01" stroke="rgba(255,100,100,0.6)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: "rgba(255,100,100,0.8)" }}>
          오류가 발생했습니다
        </p>
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          URL을 확인하고 다시 시도해주세요
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col" style={{ minHeight: 320 }}>
      {/* 헤더 */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
            {status === "generating" ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse-glass">생성 중</span>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>— AI 작성 중...</span>
              </span>
            ) : status === "done" || content ? (
              "제안서"
            ) : null}
          </span>
        </div>

        {content && status !== "generating" && (
          <div className="flex items-center gap-2">
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 glass-btn-ghost"
                style={{ fontSize: "0.7rem" }}
              >
                원본 보기
              </a>
            )}
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 glass-btn-ghost"
              style={{ fontSize: "0.7rem" }}
            >
              복사
            </button>
          </div>
        )}
      </div>

      {/* 내용 */}
      <div
        className="flex-1 p-6 overflow-y-auto scrollbar-glass"
        style={{ maxHeight: "calc(100vh - 320px)" }}
      >
        <div className="prose-glass animate-fade-in">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
