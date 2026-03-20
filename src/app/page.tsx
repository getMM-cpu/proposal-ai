"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import UrlInputForm from "@/components/proposal/UrlInputForm";
import ProposalResult from "@/components/proposal/ProposalResult";
import HistoryPanel from "@/components/proposal/HistoryPanel";
import { useProposalGeneration } from "@/hooks/useProposalGeneration";
import { useHistory } from "@/hooks/useHistory";
import { GenerationStatus } from "@/types";
import type { Proposal } from "@/lib/supabase";

export default function Home() {
  const { proposals, loading, refresh, remove, star } = useHistory();
  const { generate, status, proposal, error, sourceUrl } = useProposalGeneration(refresh);

  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const displayContent = selectedProposal ? selectedProposal.content : proposal;
  const displayUrl = selectedProposal ? selectedProposal.url : sourceUrl;
  const displayStatus: GenerationStatus = selectedProposal ? "done" : status;

  const handleGenerate = (url: string) => {
    setSelectedProposal(null);
    generate(url);
  };

  const handleSelectHistory = (p: Proposal) => {
    setSelectedProposal(p);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-6 pb-10 max-w-7xl mx-auto w-full">
        {/* 히어로 */}
        <div className="mb-8 pt-4">
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
            AI 제안서 생성기
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            URL을 입력하면 웹사이트를 분석하여 비즈니스 제안서를 자동으로 작성합니다.
          </p>
        </div>

        {/* URL 입력 */}
        <div className="mb-5">
          <UrlInputForm onSubmit={handleGenerate} status={status} />
        </div>

        {/* 에러 */}
        {error && (
          <div
            className="mb-5 px-4 py-3 rounded-xl text-sm animate-fade-in"
            style={{
              background: "rgba(255,60,60,0.08)",
              border: "1px solid rgba(255,60,60,0.2)",
              color: "rgba(255,120,120,0.9)",
            }}
          >
            {error}
          </div>
        )}

        {/* 3단 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_240px_1fr] gap-5">

          {/* 히스토리 패널 */}
          <div className="glass-card p-5 flex flex-col" style={{ maxHeight: 600 }}>
            <HistoryPanel
              proposals={proposals}
              loading={loading}
              onSelect={handleSelectHistory}
              onDelete={remove}
              onStar={star}
              selectedId={selectedProposal?.id}
            />
          </div>

          {/* 상태 + 안내 패널 */}
          <div className="flex flex-col gap-4">
            <div className="glass-card p-5">
              <p
                className="text-xs font-medium uppercase tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                상태
              </p>
              <StatusIndicator status={displayStatus} />
            </div>

            <div className="glass-card p-5">
              <p
                className="text-xs font-medium uppercase tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                사용 방법
              </p>
              <ol className="space-y-3">
                {[
                  "분석할 웹사이트 URL 입력",
                  "제안서 생성 버튼 클릭",
                  "AI가 내용 분석 및 작성",
                  "결과 확인 및 복사",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="glass-card p-5">
              <p
                className="text-xs font-medium uppercase tracking-widest mb-3"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                AI 모델
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.4)" }}
                />
                <span className="text-sm text-white">Claude Opus 4.5</span>
              </div>
              <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                via OpenRouter
              </p>
            </div>
          </div>

          {/* 제안서 결과 */}
          <ProposalResult
            content={displayContent}
            status={displayStatus}
            sourceUrl={displayUrl}
          />
        </div>
      </main>
    </div>
  );
}

function StatusIndicator({ status }: { status: GenerationStatus }) {
  const items = [
    { key: "crawling", label: "URL 분석", icon: "🔍" },
    { key: "generating", label: "AI 생성", icon: "✦" },
    { key: "done", label: "완료", icon: "✓" },
  ];

  const activeIndex = items.findIndex((item) => item.key === status);

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        const isDone = activeIndex > i || status === "done";

        return (
          <div key={item.key} className="flex items-center gap-3">
            <span
              className="w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0"
              style={{
                background: isActive
                  ? "rgba(255,255,255,0.15)"
                  : isDone
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  isActive
                    ? "rgba(255,255,255,0.25)"
                    : isDone
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.06)"
                }`,
              }}
            >
              {isActive ? (
                <span className="animate-pulse-glass">{item.icon}</span>
              ) : (
                <span style={{ opacity: isDone ? 0.6 : 0.2 }}>{item.icon}</span>
              )}
            </span>
            <span
              className="text-xs"
              style={{
                color: isActive
                  ? "rgba(255,255,255,0.9)"
                  : isDone
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,0.2)",
              }}
            >
              {item.label}
            </span>
            {isActive && (
              <span
                className="ml-auto text-xs animate-pulse-glass"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                진행 중
              </span>
            )}
          </div>
        );
      })}

      {status === "idle" && (
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          URL을 입력하면 시작됩니다
        </p>
      )}
      {status === "error" && (
        <p className="text-xs" style={{ color: "rgba(255,100,100,0.7)" }}>
          오류 발생
        </p>
      )}
    </div>
  );
}
