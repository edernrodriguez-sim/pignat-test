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
  TT01: "TT01",
  TT02: "TT02",
  TT03: "TT03",
  TT04: "TT04",
  TT05: "TT05",
  TT06: "TT06",
  TT07: "TT07",
  TT08: "TT08",

  // ── Débits ───────────────────────────────────────────────────────────
  FIT02: "FIC2Rate",
  FIC02_SP: "FIC02_SP",

  // ── Niveaux / switchs ────────────────────────────────────────────────
  FSL01: "FSL1",
  LSL01: "LSL01",
  LSL02: "LSL02",
  LSL03: "LSL03",
  LSL04: "LSL04",
  // LSL01 / LSL02 / LSL03 / LSL04 : pas de clé directe dans machineState.json
  // LSH01 / LSH02 : idem
  LSH01: "LSH01",
  LSH02: "LSH02",

  // ── Vannes (ZS = retour capteur position vanne) ───────────────────────
  ZS01: "ZS01",
  ZS02: "V2",
  ZS03: "V3",
  ZS04: "V4",
  ZS05: "V5",
  ZS06: "V6",
  ZS07: "V7",
  ZS08: "V8",
  ZS09: "V9",
  ZS11: "V11",
  ZS12: "V12",
  ZS14: "V14",
  ZS15: "V15",
  ZS16: "V16",

  // ── Auxiliaires ───────────────────────────────────────────────────────
  H1: "H1",
  H2: "H2",
  P1: "P1",
  EV01: "EV01",
  DPIC01_OP: "DPIC01_OP",
  DPIC01_SP: "DPIC01_SP",
  // VR01, TH01, DPT01 :
  //   pas de clé MachineParameter directe — à ajouter si nécessaire
  ARU: "ARU",
  N_SERIE: "N_SERIE"
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
