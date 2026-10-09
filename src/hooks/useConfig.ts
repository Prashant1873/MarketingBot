import { useState, useEffect, useCallback } from "react";
import { ConfigResponse, Preferences, ApiKeys } from "../types";

const STORAGE_KEY = "marcutie_persistent_keys";

function getLocalKeys(): ApiKeys {
  if (typeof window === "undefined") return { gemini: "", anthropic: "", openai: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { gemini: "", anthropic: "", openai: "" };
  } catch {
    return { gemini: "", anthropic: "", openai: "" };
  }
}

function setLocalKeys(keys: Partial<ApiKeys>) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalKeys();
    const updated = { ...existing };
    if (keys.gemini && !keys.gemini.startsWith("•") && keys.gemini !== "configured") updated.gemini = keys.gemini;
    if (keys.anthropic && !keys.anthropic.startsWith("•") && keys.anthropic !== "configured") updated.anthropic = keys.anthropic;
    if (keys.openai && !keys.openai.startsWith("•") && keys.openai !== "configured") updated.openai = keys.openai;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
}

export function useConfig() {
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/config");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);

        // Auto-heal / Auto-sync: If server has lost keys but client localStorage has them, restore to server
        const local = getLocalKeys();
        const needsSync: Partial<ApiKeys> = {};
        if (local.gemini && !data.config.hasKey.gemini) needsSync.gemini = local.gemini;
        if (local.anthropic && !data.config.hasKey.anthropic) needsSync.anthropic = local.anthropic;
        if (local.openai && !data.config.hasKey.openai) needsSync.openai = local.openai;

        if (Object.keys(needsSync).length > 0) {
          fetch("/api/config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKeys: needsSync }),
          })
            .then((r) => r.json())
            .then((synced) => {
              if (synced.success) {
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        hasKey: synced.hasKey || prev.hasKey,
                      }
                    : prev
                );
              }
            })
            .catch(() => {});
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load config";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const saveConfig = async (
    apiKeys?: ApiKeys,
    preferences?: Partial<Preferences>
  ): Promise<boolean> => {
    try {
      if (apiKeys) {
        setLocalKeys(apiKeys);
      }

      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKeys, preferences }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        await fetchConfig();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save config";
      setError(msg);
      return false;
    }
  };

  const localKeys = getLocalKeys();
  const hasAnyKey = Boolean(
    config?.hasKey.gemini ||
      config?.hasKey.anthropic ||
      config?.hasKey.openai ||
      localKeys.gemini ||
      localKeys.anthropic ||
      localKeys.openai
  );

  return {
    config,
    hasKey: config?.hasKey || {
      gemini: Boolean(localKeys.gemini),
      anthropic: Boolean(localKeys.anthropic),
      openai: Boolean(localKeys.openai),
    },
    localKeys,
    hasAnyKey,
    loading,
    error,
    refreshConfig: fetchConfig,
    saveConfig,
  };
}
