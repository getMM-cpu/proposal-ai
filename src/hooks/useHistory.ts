"use client";

import { useCallback, useEffect, useState } from "react";
import { getSessionId } from "@/lib/session";
import { deleteProposal, getProposals, toggleStar } from "@/lib/proposals";
import type { Proposal } from "@/lib/supabase";

export function useHistory() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const sessionId = getSessionId();
    if (!sessionId) return;
    const data = await getProposals(sessionId);
    setProposals(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = async (id: string) => {
    const ok = await deleteProposal(id);
    if (ok) setProposals((prev) => prev.filter((p) => p.id !== id));
  };

  const star = async (id: string, current: boolean) => {
    const ok = await toggleStar(id, !current);
    if (ok) {
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_starred: !current } : p))
      );
    }
  };

  return { proposals, loading, refresh, remove, star };
}
