import { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useMqttConnection } from "../useMqttConnection";
import { mapMqttRecordsToUpdates, MQTT_TAG_MAPPING } from "../mqttTagMapping";
import type { MachineParameter } from "../models/machineParameter";

export interface VanneUpdate {
  /** Clé de la vanne, ex: "V2", "V3", ... */
  key: string;
  /** true = ouverte, false = fermée */
  isOpen: boolean;
}

export interface MachineUpdate {
  /** Clé du capteur, ex: "V2", "TT01", ... */
  key: string;
  /** true = ouverte, false = fermée */
  newValue: string | number | boolean;
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
  canStartMqtt: boolean,
  machineIdentifier: number
) {
  
  const { records, isConnected, timestamp } = useMqttConnection(machineIdentifier);
  const [vanneUpdates] = useState<VanneUpdate[]>([]);
  const [machineUpdates, setMachineUpdates] = useState<MachineUpdate[]>([]);
  // Mémorise le dernier état connu de chaque vanne pour éviter de rejouer
  // une animation si la valeur n'a pas changé entre deux messages MQTT.
  
  const machineStateRef = useRef<Record<string, string | number | boolean>>({});

  useEffect(() => {
    if (records.length === 0 || !canStartMqtt) return;

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
    const changedElements: MachineUpdate[] = [];
    for (const record of records) {
      // Si clé non trouvé on passe au suivant
      if (MQTT_TAG_MAPPING[record.TagName] == null)
      {
        console.log("tag non trouvé : " + record.TagName);
        continue;
      }
      // On récupère la valeur selon la clé
      const key = MQTT_TAG_MAPPING[record.TagName];

      // On check les valeurs de référence
      if (machineStateRef.current[key] !== record.Value) {
        machineStateRef.current[key] = record.Value;
        changedElements.push({ key,  newValue: record.Value });
      }
    }

    //if (changedElements.length > 0){
      setMachineUpdates(changedElements);
    //}
    
  }, [records, setMachineParams]);

  return { isConnected, timestamp, vanneUpdates, machineUpdates };
}
