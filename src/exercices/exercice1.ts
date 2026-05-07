// ─── Exercice (stable, défini hors composant) ─────────────────────────────────
import type { Exercise } from "./exercice";

const myExercise: Exercise = {
  id: "ex-001",
  name: "Remplissage du bouilleur",
  description: "Suivez les étapes pour remplir correctement le bouilleur.",
  steps: [
    // {
    //   id: "step-1", number: 1, name: "Placer le bac de retention",
    //   description: "Cliquez sur le bac de retention pour le placer.",
    //   action: { type: "click3D", entityName: "retentionBox", label: "Cliquez sur le bac de retention dans la scène 3D" },
    //   onCompleteAnimation: { animationName: "bac_de_retention_in", entityId: "d6d376eb-3686-4483-926e-82c901e04f21" },
    // },
    // {
    //   id: "step-2", number: 2, name: "Régler la pression",
    //   description: "Entrez la valeur de pression correcte (12 bar) dans le champ ci-dessous.",
    //   action: { type: "inputChange", fieldId: "pressure-input", expectedValue: "12", label: "Entrez 12 dans le champ de pression" },
    //   onCompleteAnimation: { animationName: "pressure_set",},
    // },
    {
      id: "step-1", number: 1, name: "Retirer le bouchon",
      description: "Cliquez sur le bouchon pour l'ouvrir.",
      action: { type: "click3D", entityTag: "boilerCap", label: "Cliquez sur le bouchon dans la scène 3D" },
      onCompleteAnimation: { animationName: "bouchon_out", entityId: "04f499fa-8dbe-4682-9d8d-e39aad9eee2d" },
    },
    {
      id: "step-2", number: 2, name: "Remplir le bouilleur",
      description: "Cliquez sur le bouilleur pour le remplir",
      action: { type: "click3D", entityTag:"boiler", label: "Entrez 12 dans le champ de pression" },
      onCompleteAnimation: { animationName: "boilerFillDiscontinu", entityId: "cfa61690-aad6-4cac-8f4a-ee4b6cc9ee78 "},
    },
    {
      id: "step-3", number: 3, name: "Remettre le bouchon",
      description: "Cliquez sur le bouchon pour fermer.",
      action: { type: "click3D", entityTag: "boilerCap", label: "Cliquez sur le bouchon dans la scène 3D" },
      onCompleteAnimation: { animationName: "bouchon_in", entityId: "11756f00-e502-4a77-9d24-b6c81399bd5b" },
    },
    {
      id: "step-4", number: 4, name: "Ouvrir vanne V16",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: "V16", label: "Cliquez sur la vanne dans la scène 3D" },
      onActionAnimation: { animationName: "v16_in", entityId: "2708134b-9fc3-4354-aca2-2900f5c8443b" },
      onCompleteAnimation: { animationName: "complete_water_flow", entityId: "9b67bb27-1672-488a-a851-1549bbfb174a" },
    },
    {
      id: "step-5", number: 5, name: "Réglage du débit d'eau",
      description: "Entrez la valeur de débit sur 200 l/H",
      action: { type: "inputChange", fieldId: "pressure-input", expectedValue: "200", label: "Entrez 200 dans le champ de débit" },
      onCompleteAnimation: { animationName: "pressure_set",},
    },
  ],
  onCompleteAnimation: { animationName: "engine_complete"},
};

export default function getExercise1(){
    return myExercise;
}