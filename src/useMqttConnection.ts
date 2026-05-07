import { useMqttListener } from "./useMqttListener";
import { useBridgeWs } from "./useBridgeWs";
import { ProjectConstants } from "./projectConstants";

/**
 * Hook unifié de connexion aux données MQTT.
 * Sélectionne automatiquement la source selon ProjectConstants.CONNECTION_MODE :
 *  - "mqtt"   → connexion WebSocket directe au broker
 *  - "bridge" → connexion via le backend Express (ws://localhost:3001/ws)
 *
 * Les deux hooks sont toujours instanciés (règles de React),
 * mais seul celui du mode actif établit réellement une connexion.
 */
export function useMqttConnection(machineIdentifier: string) {
  const mqtt = useMqttListener(machineIdentifier);
  const bridge = useBridgeWs();

  return ProjectConstants.CONNECTION_MODE === "bridge" ? bridge : mqtt;
}
