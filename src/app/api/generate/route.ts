import { crawlUrl } from "@/lib/jina";
import { generateProposalStream } from "@/lib/openrouter";

export const maxDuration = 60;

export async function POST(request: Request) {
  let url: string;
  let customPrompt: string | undefined;

  try {
    const body = await request.json();
    url = body.url;
    customPrompt = body.customPrompt;
  } catch {
    return new Response("요청 형식이 올바르지 않습니다.", { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return new Response("유효하지 않은 URL 형식입니다.", { status: 400 });
  }

  const encoder = new TextEncoder();
  const abortController = new AbortController();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        send({ type: "status", status: "crawling", message: "URL 분석 중..." });
        const content = await crawlUrl(url, abortController.signal);

        send({ type: "status", status: "generating", message: "제안서 생성 중..." });
        const aiStream = await generateProposalStream(content, customPrompt, abortController.signal);

        const reader = aiStream.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const raw = trimmed.slice(5).trim();
              if (raw === "[DONE]") continue;

              try {
                const parsed = JSON.parse(raw);
                const chunk = parsed.choices?.[0]?.delta?.content;
                if (chunk) send({ type: "chunk", content: chunk });
              } catch {
                // 파싱 실패한 청크는 건너뜀
              }
            }
          }
        } finally {
          reader.cancel().catch(() => {});
        }

        send({ type: "done" });
      } catch (error) {
        if (!abortController.signal.aborted) {
          send({ type: "error", message: (error as Error).message });
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      abortController.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
