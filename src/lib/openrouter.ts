export const DEFAULT_SYSTEM_PROMPT = `당신은 전문 비즈니스 컨설턴트입니다.
주어진 웹사이트 내용을 분석하여 다음 구조의 제안서를 한국어로 작성하세요.

## 서비스/제품 개요
## 핵심 가치 제안
## 타겟 고객 분석
## 경쟁 우위 요소
## 협업/파트너십 제안
## 기대 효과 및 ROI
## 다음 단계 제안

마크다운 형식으로 작성하며, 각 섹션마다 구체적인 내용을 포함하세요.
근거 없는 내용보다 웹사이트에서 파악된 실제 정보를 바탕으로 작성하세요.`;

export async function generateProposalStream(
  crawledContent: string,
  customPrompt?: string,
  signal?: AbortSignal
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY가 설정되지 않았습니다.");

  const systemPrompt = customPrompt ?? DEFAULT_SYSTEM_PROMPT;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "ProposalAI",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-opus-4-5",
      stream: true,
      max_tokens: 1500,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `다음 웹사이트 내용을 분석하여 제안서를 작성해주세요:\n\n${crawledContent}`,
        },
      ],
    }),
    signal: signal ?? AbortSignal.timeout(55000),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`AI 생성 실패 (${response.status}): ${errText.slice(0, 200)}`);
  }

  if (!response.body) throw new Error("스트림 응답을 받지 못했습니다.");

  return response.body;
}
