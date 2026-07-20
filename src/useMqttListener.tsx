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
const TOPIC = "Tags";
// const TOPIC = "machine/data"
/**
 * Topic de base auquel on ajoute l'identifiant de la machine
 */
// const BASE_TOPIC = "Tags"
// let TOPIC = "";

/**
 * Lance l'écoute du mqtt pour récupérer les données de la machine dont l'id est passé en paramètre
 * @param machineIdentifier Identifiant de la machine
 * @returns données des enregistrements reçus par le broker
 */
export function useMqttListener(machineIdentifier: number) {
  const [state, setState] = useState<MqttState>({
    records: [],
    timestamp: null,
    isConnected: false,
  });
  // Ajout de l'identifiant de la machine pour créer le topic complet  
  // TOPIC = BASE_TOPIC + machineIdentifier;
  // TOPIC = BASE_TOPIC;
  
  // Keep latest records accessible without re-subscribing
  const recordsRef = useRef<MqttRecord[]>([]);

  useEffect(() => {
    // Ne pas se connecter si le mode actif est "bridge"
    if (ProjectConstants.CONNECTION_MODE !== "mqtt") return;
    console.log(`BROKER_URL : ${BROKER_URL}`)
    const client = mqtt.connect(BROKER_URL, { 
      username: 'Edern',
      password: 'guFVmVlVm4V4oQ',
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
        // Test pour savoir si les données reçues correspondent à la machine en cours
        if (canUseCurrentMqttDatas(records, machineIdentifier)){
          recordsRef.current = records;
          setState((prev) => ({
            ...prev,
            records,
            timestamp: new Date().toISOString(),
          }));
        }
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

/**
 * Récupère la valeur du Tag N_SERIE pour détecter si les données correspondent à l'identifiant machine utilisé
 * @param records Les données reçues du broker
 * @param machineIdentifier Identifiant de la machine actuel
 * @returns True si on peut utiliser les données, False si non
 */
function canUseCurrentMqttDatas(records: MqttRecord[], machineIdentifier: number) : boolean {
  const serialTags = records.find(r => r.TagName === ProjectConstants.MQTT_ID_TAGNAME);
  if (serialTags && serialTags.Value == machineIdentifier){
    return true;
  }
  else {
    return false;
  }
  return true;
}