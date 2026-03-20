import { supabase, type Proposal } from "./supabase";

export async function saveProposal(data: {
  session_id: string;
  url: string;
  url_title?: string;
  content: string;
  prompt_used?: string;
}): Promise<Proposal | null> {
  const { data: row, error } = await supabase
    .from("proposals")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("제안서 저장 실패:", error.message);
    return null;
  }
  return row;
}

export async function getProposals(session_id: string): Promise<Proposal[]> {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("session_id", session_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("히스토리 조회 실패:", error.message);
    return [];
  }
  return data ?? [];
}

export async function deleteProposal(id: string): Promise<boolean> {
  const { error } = await supabase.from("proposals").delete().eq("id", id);
  if (error) {
    console.error("제안서 삭제 실패:", error.message);
    return false;
  }
  return true;
}

export async function toggleStar(id: string, is_starred: boolean): Promise<boolean> {
  const { error } = await supabase
    .from("proposals")
    .update({ is_starred })
    .eq("id", id);
  if (error) {
    console.error("즐겨찾기 변경 실패:", error.message);
    return false;
  }
  return true;
}
