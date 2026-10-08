import { useState, useEffect, useCallback } from "react";
import { ConfigResponse, Preferences, ApiKeys } from "../types";

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

  const hasAnyKey = Boolean(
    config?.hasKey.gemini || config?.hasKey.anthropic || config?.hasKey.openai
  );

  return {
    config,
    hasKey: config?.hasKey || { gemini: false, anthropic: false, openai: false },
    hasAnyKey,
    loading,
    error,
    refreshConfig: fetchConfig,
    saveConfig,
  };
}
