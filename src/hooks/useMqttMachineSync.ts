import { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useMqttConnection } from "../useMqttConnection";
import { mapMqttRecordsToUpdates, MQTT_TAG_MAPPING, VANNE_MQTT_TAGS } from "../mqttTagMapping";
import type { MachineParameter } from "../models/machineParameter";

export interface VanneUpdate {
  /** Clé de la vanne, ex: "V2", "V3", ... */
  key: string;
  /** true = ouverte, false = fermée */
  isOpen: boolean;
}

/**
 * Bridge entre useMqttListener et le state machineParams d'App.tsx.
 *
 * À chaque nouveau message MQTT, ce hook :
 *  1. Mappe les TagNames MQTT vers les clés MachineParameter (via mqttTagMapping)
 *  2. Met à jour uniquement les paramètres concernés via setMachineParams
 *  3. Retourne vanneUpdates : la liste des vannes dont l'état a changé
 *     → App.tsx écoute ce tableau pour déclencher les animations 3D
 */
export function useMqttMachineSync(
  setMachineParams: Dispatch<SetStateAction<MachineParameter[]>>,
) {
  const { records, isConnected, timestamp } = useMqttConnection();
  const [vanneUpdates, setVanneUpdates] = useState<VanneUpdate[]>([]);
  // Mémorise le dernier état connu de chaque vanne pour éviter de rejouer
  // une animation si la valeur n'a pas changé entre deux messages MQTT.
  const vanneStateRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (records.length === 0) return;

    const updates = mapMqttRecordsToUpdates(records);
    if (updates.length === 0) return;

    // Met à jour les machineParams
    const updateMap = Object.fromEntries(updates.map((u) => [u.key, u.value]));
    setMachineParams((prev) =>
      prev.map((param) =>
        param.key in updateMap
          ? { ...param, value: updateMap[param.key] }
          : param,
      ),
    );

    // N'émet que les vannes dont l'état a réellement changé
    const changedVannes: VanneUpdate[] = [];
    for (const record of records) {
      if (!VANNE_MQTT_TAGS.has(record.TagName)) continue;
      const key = MQTT_TAG_MAPPING[record.TagName];
      const isOpen = Boolean(record.Value);
      if (vanneStateRef.current[key] !== isOpen) {
        vanneStateRef.current[key] = isOpen;
        changedVannes.push({ key, isOpen });
      }
    }

    if (changedVannes.length > 0) {
      setVanneUpdates(changedVannes);
    }
  }, [records, setMachineParams]);

  return { isConnected, timestamp, vanneUpdates };
}
