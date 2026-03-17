import type { MqttRecord } from "./useMqttListener";

/**
 * Ensemble des TagNames MQTT qui correspondent à des vannes.
 * Utilisé pour déclencher les animations d'ouverture/fermeture.
 */
export const VANNE_MQTT_TAGS = new Set([
  "ZS01", "ZS02", "ZS03", "ZS04", "ZS05",
  "ZS06", "ZS07", "ZS08", "ZS09", "ZS11", "ZS14",
]);

/**
 * Table de correspondance : TagName MQTT → clé MachineParameter
 *
 * Compléter/corriger selon la nomenclature réelle du PLC.
 * Les entrées commentées sont incertaines ou sans équivalent direct
 * dans machineState.json — à confirmer avec le constructeur.
 */
export const MQTT_TAG_MAPPING: Record<string, string> = {
  // ── Températures ─────────────────────────────────────────────────────
  TT01: "BoilerTemp",
  TT02: "TT2",
  TT03: "TT3",
  TT04: "TT4",
  TT05: "TT5",
  TTC06_OP: "TTC6",

  // ── Débits ───────────────────────────────────────────────────────────
  FIT02: "FIC2Rate",
  FIC02_SP: "FIC2",

  // ── Niveaux / switchs ────────────────────────────────────────────────
  FSL01: "FSL1",
  // LSL01 / LSL02 / LSL03 / LSL04 : pas de clé directe dans machineState.json
  // LSH01 / LSH02 : idem

  // ── Vannes (ZS = retour capteur position vanne) ───────────────────────
  ZS01: "V1",   // V1 absent de machineState.json — à confirmer
  ZS02: "V2",
  ZS03: "V3",
  ZS04: "V4",
  ZS05: "V5",
  ZS06: "V6",
  ZS07: "V7",
  ZS08: "V8",
  ZS09: "V9",
  ZS11: "V11",
  ZS14: "V14",
  // ZS12 / ZS15 / ZS16 : à confirmer si correspondance V12/V15/V16

  // ── Auxiliaires ───────────────────────────────────────────────────────
  H1: "H1",
  // H2, P1, VR01, EV01, TH01, DPIC01_OP, DPT01 :
  //   pas de clé MachineParameter directe — à ajouter si nécessaire
};

/** Résultat du mapping : clé MachineParameter + nouvelle valeur */
export interface MachineParamUpdate {
  key: string;
  value: string | number | boolean;
}

/**
 * Transforme les records MQTT en liste de mises à jour MachineParameter.
 * Les TagNames sans correspondance dans MQTT_TAG_MAPPING sont ignorés.
 */
export function mapMqttRecordsToUpdates(
  records: MqttRecord[],
): MachineParamUpdate[] {
  const updates: MachineParamUpdate[] = [];
  for (const record of records) {
    const key = MQTT_TAG_MAPPING[record.TagName];
    if (key !== undefined) {
      updates.push({ key, value: record.Value });
    }
  }
  return updates;
}
