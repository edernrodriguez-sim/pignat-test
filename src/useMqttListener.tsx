import mqtt from "mqtt";
import { useEffect, useRef, useState } from "react";
import { ProjectConstants } from "./projectConstants";

export interface MqttRecord {
  TagName: string;
  Value: string | number | boolean;
}

interface MqttState {
  records: MqttRecord[];
  timestamp: string | null;
  isConnected: boolean;
}

const BROKER_URL = ProjectConstants.BROKER_WS_URL;
const TOPIC = "machine/data";

export function useMqttListener() {
  const [state, setState] = useState<MqttState>({
    records: [],
    timestamp: null,
    isConnected: false,
  });

  // Keep latest records accessible without re-subscribing
  const recordsRef = useRef<MqttRecord[]>([]);

  useEffect(() => {
    // Ne pas se connecter si le mode actif est "bridge"
    if (ProjectConstants.CONNECTION_MODE !== "mqtt") return;

    const client = mqtt.connect(BROKER_URL, {
      clientId: `react_${Math.random().toString(16).slice(2)}`,
      clean: true,
      reconnectPeriod: 1000,
    });

    client.on("connect", () => {
      console.log("✅ MQTT connecté");
      setState((prev) => ({ ...prev, isConnected: true }));
      client.subscribe(TOPIC, (err) => {
        if (err) console.error("❌ Échec abonnement:", err.message);
        else console.log(`📡 Abonné à "${TOPIC}"`);
      });
    });

    client.on("message", (_topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());
        const records: MqttRecord[] = data.Records ?? [];
        recordsRef.current = records;
        setState((prev) => ({
          ...prev,
          records,
          timestamp: new Date().toISOString(),
        }));
        // console.log("📩 MQTT recieved : ", data);
      } catch (err) {
        console.error("❌ Payload invalide:", err);
      }
    });

    client.on("close", () =>
      setState((prev) => ({ ...prev, isConnected: false })),
    );
    client.on("offline", () =>
      setState((prev) => ({ ...prev, isConnected: false })),
    );
    client.on("disconnect", () =>
      setState((prev) => ({ ...prev, isConnected: false })),
    );
    client.on("error", (err) => console.error("❌ Erreur MQTT:", err.message));

    return () => {
      client.end();
    };
  }, []);

  /** Retourne la valeur d'un tag par son TagName (ex: "TT01"), ou undefined si absent */
  function getTagValue(tagName: string): string | number | boolean | undefined {
    return recordsRef.current.find((r) => r.TagName === tagName)?.Value;
  }

  return {
    records: state.records, // tableau complet des tags reçus
    timestamp: state.timestamp, // horodatage ISO de la dernière réception
    isConnected: state.isConnected,
    getTagValue, // accès direct à un tag par TagName
  };
}
