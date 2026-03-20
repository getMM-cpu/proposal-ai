"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { GenerationStatus } from "@/types";

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  status: GenerationStatus;
}

export default function UrlInputForm({ onSubmit, status }: UrlInputFormProps) {
  const [url, setUrl] = useState("");
  const isLoading = status === "crawling" || status === "generating";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    const withProtocol = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    onSubmit(withProtocol);
  };

  const statusLabel: Partial<Record<GenerationStatus, string>> = {
    crawling: "URL 분석 중...",
    generating: "제안서 생성 중...",
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: isLoading ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)" }}
        />
        <span
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          URL 입력
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          className="glass-input flex-1 px-4 py-3 text-sm"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
          spellCheck={false}
          autoComplete="off"
        />
        <Button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="px-6 py-3 text-sm flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size={14} />
              <span>{statusLabel[status]}</span>
            </>
          ) : (
            "제안서 생성"
          )}
        </Button>
      </form>

      <p className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
        웹사이트 URL을 입력하면 AI가 자동으로 내용을 분석하여 제안서를 작성합니다.
      </p>
    </div>
  );
}
