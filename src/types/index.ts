export type GenerationStatus = "idle" | "crawling" | "generating" | "done" | "error";

export interface SSEEvent {
  type: "status" | "chunk" | "done" | "error";
  status?: GenerationStatus;
  message?: string;
  content?: string;
}
