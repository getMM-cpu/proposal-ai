"use client";

import { useRef, useState } from "react";
import { GenerationStatus, SSEEvent } from "@/types";
import { getSessionId } from "@/lib/session";
import { saveProposal } from "@/lib/proposals";

export function useProposalGeneration(onSaved?: () => void) {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [proposal, setProposal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  const generate = async (url: string, customPrompt?: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("crawling");
    setProposal("");
    setError(null);
    setSourceUrl(url);

    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    let finalContent = "";

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, customPrompt }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`요청 실패 (${response.status})`);
      }

      reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          try {
            const event: SSEEvent = JSON.parse(trimmed.slice(5).trim());

            if (event.type === "status" && event.status) {
              setStatus(event.status);
            } else if (event.type === "chunk") {
              const chunk = event.content ?? "";
              finalContent += chunk;
              setProposal((prev) => prev + chunk);
            } else if (event.type === "done") {
              setStatus("done");
              // 완료 후 Supabase에 저장
              const sessionId = getSessionId();
              if (sessionId && finalContent) {
                saveProposal({
                  session_id: sessionId,
                  url,
                  content: finalContent,
                  prompt_used: customPrompt,
                }).then((saved) => {
                  if (saved) onSaved?.();
                });
              }
            } else if (event.type === "error") {
              setError(event.message ?? "알 수 없는 오류");
              setStatus("error");
            }
          } catch {
            // 파싱 실패 무시
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message);
        setStatus("error");
      }
    } finally {
      reader?.cancel().catch(() => {});
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setStatus("idle");
    setProposal("");
    setError(null);
    setSourceUrl(undefined);
  };

  return { generate, reset, status, proposal, error, sourceUrl };
}
