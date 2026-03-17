import { useEffect, useRef, useState } from "react";
import type { MqttRecord } from "./useMqttListener";
import { ProjectConstants } from "./projectConstants";

interface BridgeState {
  records: MqttRecord[];
  timestamp: string | null;
  isConnected: boolean;
}

export function useBridgeWs() {
  const [state, setState] = useState<BridgeState>({
    records: [],
    timestamp: null,
    isConnected: false,
  });

  const recordsRef = useRef<MqttRecord[]>([]);

  useEffect(() => {
    // Ne pas se connecter si le mode actif est "mqtt"
    if (ProjectConstants.CONNECTION_MODE !== "bridge") return;

    const ws = new WebSocket(ProjectConstants.BRIDGE_WS_URL);

    ws.onopen = () => {
      console.log("✅ Bridge WS connecté");
      setState((prev) => ({ ...prev, isConnected: true }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string);
        const records: MqttRecord[] = data.Records ?? [];
        recordsRef.current = records;
        setState((prev) => ({
          ...prev,
          records,
          timestamp: new Date().toISOString(),
        }));
      } catch (err) {
        console.error("❌ Payload Bridge WS invalide:", err);
      }
    };

    ws.onclose = () => setState((prev) => ({ ...prev, isConnected: false }));
    ws.onerror = (err) => console.error("❌ Erreur Bridge WS:", err);

    return () => ws.close();
  }, []);

  function getTagValue(tagName: string): string | number | boolean | undefined {
    return recordsRef.current.find((r) => r.TagName === tagName)?.Value;
  }

  return {
    records: state.records,
    timestamp: state.timestamp,
    isConnected: state.isConnected,
    getTagValue,
  };
}
