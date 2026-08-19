import type { TempTarget } from './../temperatureRandomizer/temperatureSimulator';
// ─── Action Types ────────────────────────────────────────────────────────────

export type ActionType = "click3D" | "inputChange" | "WaitAction" | "sort" | "trueFalse" | "quiz";

/**
 * Clic sur un objet 3D dans la scène 3DVerse.
 * `entityTag` : nom de l'entité ciblée dans le scenegraph.
 */
export interface Click3DAction {
  type: "click3D";
  entityTag: string; // nom de l'entité 3DVerse à cliquer
  label?: string;     // description affichée à l'utilisateur
}

/**
 * Modification d'un champ input dans l'UI.
 * `fieldId`      : id HTML du champ.
 * `expectedValue`: valeur attendue pour valider l'étape (optionnel).
 */
export interface InputChangeAction {
  type: "inputChange";
  modalTitle?: string
  expectedFields: SavedField[];
  label?: string;
  isDirectAnswer?: boolean;
}
/**
 * Étape d'attente
 */
export interface WaitAction {
  type: "wait";
  /** Durée réelle en secondes avant validation automatique */
  realDuration: number;
  /** Valeur affichée au départ sur le chrono (en secondes) ex: 600 pour 10:00 */
  displayDuration: number;
}

export interface SortAction {
  type: "sort";
  /** Items dans un ordre aléatoire affiché à l'élève */
  items: { id: string; label: string }[];
  /** Ordre attendu : tableau des id dans le bon ordre */
  expectedOrder: string[];
}

export interface TrueFalseAction {
  type: "trueFalse";
  modalTitle?: string
  expectedAnswer: boolean;
  label?: string;
  isDirectAnswer?: boolean;
}

export interface QuizAction {
  type: "quiz";
  question: string;
  choices: { id: string; label: string }[];
  /** Ids des réponses correctes (une ou plusieurs) */
  correctIds: string[];
  /** Si false, l'ordre n'importe pas (défaut) */
  multiple?: boolean;
}

export interface TableDatas {
  headers: string[];
  rows: string[][];
}

export interface SavedField {
  key: string;
  value: string | number | boolean;
}

export type StepAction = Click3DAction | InputChangeAction | WaitAction | SortAction | TrueFalseAction | QuizAction;

// ─── Animation ───────────────────────────────────────────────────────────────

export interface AnimationTrigger {
  /** Nom de l'animation 3DVerse à jouer permet de s'y retrouver plus facilement dans le json */
  animationName: string;
  /** Sur quelle id d'entité jouer l'animation */
  entityId?: string;
}

// ─── Step ────────────────────────────────────────────────────────────────────

export interface ExerciseStep {
  id: string;
  number: number;
  name: string;
  description: string;
  action: StepAction;
  /** Animation déclenchée quand l'étape est validée */
  onCompleteAnimation?: AnimationTrigger[];
  /** Animation déclenchée quand l'action est détectée (avant validation) */
  onActionAnimation?: AnimationTrigger[];
  /** Lancement de la simulation de temperature */
  startTemperatureOnComplete?: boolean | undefined;
  /** Temperatures à atteindre lors de la simulation */
  targetTemperatures?: TempTarget[];
  /** Texte à afficher si besoin pour donner des infos sur l'exercice en cours (ex: des valeurs de mesures) */
  informationsToShow?: string[];
  tableToShow? : TableDatas;
}

// ─── Exercise ─────────────────────────────────────────────────────────────────

export interface Exercise {
  id: string;
  name: string;
  description: string;
  steps: ExerciseStep[];
  /** Animation jouée à la fin de tout l'exercice */
  onCompleteAnimation?: AnimationTrigger;
}

// ─── State ───────────────────────────────────────────────────────────────────

export type StepStatus = "pending" | "active" | "completed";

export interface ExerciseState {
  exercise: Exercise;
  currentStepIndex: number;
  stepStatuses: Record<string, StepStatus>;
  isCompleted: boolean;
}