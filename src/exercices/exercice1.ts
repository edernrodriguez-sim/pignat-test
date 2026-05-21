// ─── Exercice (stable, défini hors composant) ─────────────────────────────────
import { ENTITY_TAG_LIST } from "../entityTagList";
import type { Exercise } from "./exercice";

const myExercise: Exercise = {
  id: "ex-001",
  name: "Relevé des températures en mode Batch",
  description: "Etudier l’évolution de la température dans la distillation en mode batch",
  steps: [
    {
      id: "step-1", number: 1, name: "Retirer le bouchon",
      description: "Cliquez sur le bouchon pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.BOUCHON_BOUILLEUR, label: "Cliquez sur le bouchon dans la scène 3D" },
      onCompleteAnimation: { animationName: "bouchon_out", entityId: "04f499fa-8dbe-4682-9d8d-e39aad9eee2d" },
      startTemperatureOnComplete: false
    },
    {
      id: "step-2", number: 2, name: "Remplir le bouilleur",
      description: "Cliquez sur le bouilleur pour le remplir",
      action: { type: "click3D", entityTag:ENTITY_TAG_LIST.BOUILLEUR, label: "Cliquez sur le bouilleur dans la scène 3D" },
      onCompleteAnimation: { animationName: "boilerFillDiscontinu", entityId: "cfa61690-aad6-4cac-8f4a-ee4b6cc9ee78 "},
    },
    {
      id: "step-3", number: 3, name: "Remettre le bouchon",
      description: "Cliquez sur le bouchon pour fermer.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.BOUCHON_BOUILLEUR, label: "Cliquez sur le bouchon dans la scène 3D" },
      onCompleteAnimation: { animationName: "bouchon_in", entityId: "11756f00-e502-4a77-9d24-b6c81399bd5b" },
    },
    {
      id: "step-4", number: 4, name: "Ouvrir vanne V16",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V16, label: "Cliquez sur la vanne dans la scène 3D" },
      onActionAnimation: { animationName: "v16_in", entityId: "2708134b-9fc3-4354-aca2-2900f5c8443b" },
  
    },
    {
      id: "step-5", number: 5, name: "Réglage du débit d'eau",
      description: "Entrez la valeur de débit sur 200 l/H",
      action: { type: "inputChange", fieldId: "FIC02_SP", expectedValue: "200", 
      label: "Entrez 200 dans le champ de débit" },
      onCompleteAnimation: { animationName: "complete_water_flow", entityId: "9b67bb27-1672-488a-a851-1549bbfb174a" }
    },
    {
      id: "step-6", number: 6, name: "Démarrer la chauffe",
      description: "Démarrer la chauffe en appuyant sur le bouton H2 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", fieldId: "H2", expectedValue: true, 
      label: "Cocher la case de H2" },
      onCompleteAnimation: { animationName: "boiler_bell_reflux_anim", entityId: "8073c152-3372-42aa-8f4d-d06e243a9277" },
      startTemperatureOnComplete: true,
      targetTemperatures: [
      { key: "TT01", value: 90, time: 30 },
      { key: "TT02", value: 85, time: 30 }, 
      { key: "TT03", value: 80, time: 30 },
      { key: "TT04", value: 75, time: 30 }, 
      { key: "TT05", value: 70, time: 30 }, 
    ]
    },
    {
      id: "step-7", number: 7, name: "Relevé de température TT01",
      description: "Indiquer la valeur de température du bouilleur",
      action: { type: "inputChange", fieldId: "TT01", isDirectAnswer: true, expectedValue: "90", 
        label: "Entrez 90 dans le champ de débit", modalTitle: "Indiquer la valeur de TT01" },
    },
    {
      id: "step-8", number: 8, name: "Relevé de température TT02",
      description: "Indiquer la valeur de température du pied de colonne",
      action: { type: "inputChange", fieldId: "TT02", isDirectAnswer: true, expectedValue: "85", 
        label: "Entrez 85 dans le champ de débit", modalTitle: "Indiquer la valeur de TT02" },
    },
    {
      id: "step-9", number: 9, name: "Relevé de température TT03",
      description: "Indiquer la valeur de température du milieu de colonne",
      action: { type: "inputChange", fieldId: "TT03", isDirectAnswer: true, expectedValue: "80", 
        label: "Entrez 80 dans le champ de débit", modalTitle: "Indiquer la valeur de TT03" },
    },
    {
      id: "step-10", number: 10, name: "Relevé de température TT04",
      description: "Indiquer la valeur de température en haut de colonne",
      action: { type: "inputChange", fieldId: "TT04", isDirectAnswer: true, expectedValue: "75", 
        label: "Entrez 75 dans le champ de débit", modalTitle: "Indiquer la valeur de TT04" },
    },
  ],
  onCompleteAnimation: { animationName: "engine_complete"},
};

export default function getExercise1(){
    return myExercise;
}