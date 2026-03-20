export async function crawlUrl(url: string, signal?: AbortSignal): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`;

  const response = await fetch(jinaUrl, {
    headers: {
      Accept: "text/plain",
      "X-Return-Format": "markdown",
    },
    signal: signal ?? AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`URL 접근 실패 (${response.status}): 해당 페이지에 접근할 수 없습니다.`);
  }

  const text = await response.text();
  if (!text.trim()) {
    throw new Error("페이지에서 내용을 읽을 수 없습니다.");
  }

  // 최대 8000자로 트리밍 (토큰 절약)
  return text.slice(0, 8000);
}
