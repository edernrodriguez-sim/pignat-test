// ─── Exercice (stable, défini hors composant) ─────────────────────────────────
import { ENTITY_TAG_LIST } from "../entityTagList";
import type { Exercise } from "./exercice";

const TI1Value = 84;
const TI2Value = 82.6;
const TI3Value = 78.5;
const TI4Value = 77.7;
const TI5Value = 77.4;
const TI7Value = 24;
const TI8Value = 26;

const myExercise: Exercise = {
  id: "ex-001",
  name: "Relevé des températures en mode Batch",
  description: "Etudier l’évolution de la température dans la distillation en mode batch",
  steps: [
      {
      id: "step-0", number: 1, name: "Placer le bac de rétention",
      description: "Cliquez sur le bac pour le placer.",
      action: { type: "click3D", entityTag:  ENTITY_TAG_LIST.BAC_RETENTION, label: "Cliquez sur le bac de retention dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "bac_de_retention_in", entityId: "d6d376eb-3686-4483-926e-82c901e04f21" },
      ],
      startTemperatureOnComplete: false
    },
    {
      id: "step-1", number: 2, name: "Retirer le bouchon",
      description: "Cliquez sur le bouchon pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.BOUCHON_BOUILLEUR, label: "Cliquez sur le bouchon dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "bouchon_out", entityId: "04f499fa-8dbe-4682-9d8d-e39aad9eee2d" }],
      startTemperatureOnComplete: false
    },
    {
      id: "step-2", number: 3, name: "Remplir le bouilleur",
      description: "Cliquez sur le bouilleur pour le remplir",
      action: { type: "click3D", entityTag:ENTITY_TAG_LIST.BOUILLEUR, label: "Cliquez sur le bouilleur dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "boilerFillDiscontinu", entityId: "cfa61690-aad6-4cac-8f4a-ee4b6cc9ee78 "}],
    },
    {
      id: "step-3", number: 4, name: "Remettre le bouchon",
      description: "Cliquez sur le bouchon pour fermer.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.BOUCHON_BOUILLEUR, label: "Cliquez sur le bouchon dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "bouchon_in", entityId: "11756f00-e502-4a77-9d24-b6c81399bd5b" }],
    },
    {
      id: "step-4", number: 5, name: "Ouvrir vanne V16",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V16, label: "Cliquez sur la vanne dans la scène 3D" },
      onActionAnimation: [{ animationName: "v16_in", entityId: "2708134b-9fc3-4354-aca2-2900f5c8443b" }],
  
    },
    {
      id: "step-5", number: 6, name: "Réglage du débit d'eau",
      description: "Entrez la valeur de débit sur 200 l/H",
      action: { type: "inputChange", expectedFields:[{key: "FIC02_SP", value: "200"}],
      label: "Entrez 200 dans le champ de débit" },
      onCompleteAnimation: [{ animationName: "complete_water_flow", entityId: "9b67bb27-1672-488a-a851-1549bbfb174a" }]
    },
    {
      id: "step-6", number: 7, name: "Démarrer la chauffe",
      description: "Démarrer la chauffe en appuyant sur le bouton H2 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "H2", value: true}], 
      label: "Cocher la case de H2" },
      onCompleteAnimation: [{ animationName: "boiler_bell_reflux_anim", entityId: "8073c152-3372-42aa-8f4d-d06e243a9277" }],
      startTemperatureOnComplete: true,
      targetTemperatures: [
      { key: "TT01", value: TI1Value, time: 30 },
      { key: "TT02", value: TI2Value, time: 30 }, 
      { key: "TT03", value: TI3Value, time: 30 },
      { key: "TT04", value: TI4Value, time: 30 }, 
      { key: "TT05", value: TI5Value, time: 30 }, 
      { key: "TT06", value: 77.1, time: 30 }, 
      { key: "TT07", value: TI7Value, time: 30 }, 
      { key: "TT08", value: TI8Value, time: 30 }, 
    ]
    },
    {
      id: "step-7", number: 8, name: "Relevé de température TT01",
      description: "Indiquer la valeur de température du bouilleur",
      action: { type: "inputChange", expectedFields:[{key: "TT01", value: TI1Value}],
      isDirectAnswer: true,
      label: "Entrez "+TI1Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT01" },
    },
    {
      id: "step-8", number: 9, name: "Relevé de température TT02",
      description: "Indiquer la valeur de température du pied de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT02", value: TI2Value}],
      isDirectAnswer: true, 
      label: "Entrez "+TI2Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT02" },
      informationsToShow: ["TI1 : "+TI1Value],
    },
    {
      id: "step-9", number: 10, name: "Relevé de température TT03",
      description: "Indiquer la valeur de température du milieu de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT03", value: TI3Value}],
      isDirectAnswer: true,
      label: "Entrez "+TI3Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT03" },
      informationsToShow: ["TI1 : "+TI1Value,"TI2 : "+TI2Value],
    },
    {
      id: "step-10", number: 11, name: "Relevé de température TT04",
      description: "Indiquer la valeur de température en haut de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT04", value: TI4Value}],
      isDirectAnswer: true,
      label: "Entrez "+TI4Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT04" },
      informationsToShow: ["TI1 : "+TI1Value,"TI2 : "+TI2Value,"TI3 : "+TI3Value],
    },
    {
      id: "step-11", number: 12, name: "Relevé de température TT05",
      description: "Indiquer la valeur de température en haut de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT05", value: TI5Value}],
      isDirectAnswer: true,
      label: "Entrez "+TI5Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT05" },
      informationsToShow: ["TI1 : "+TI1Value,"TI2 : "+TI2Value,"TI3 : "+TI3Value,"TI4 : "+TI4Value],
    },
    {
      id: "step-13", number: 13, name: "Relevé de température TT07",
      description: "Indiquer la valeur de température en haut de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT07", value: TI7Value}],
      isDirectAnswer: true,
      label: "Entrez "+TI7Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT07" },
      informationsToShow: ["TI1 : "+TI1Value,"TI2 : "+TI2Value,"TI3 : "+TI3Value,"TI4 : "+TI4Value,"TI5 : "+TI5Value],
    },
    {
      id: "step-14", number: 14, name: "Relevé de température TT08",
      description: "Indiquer la valeur de température en haut de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT08", value: TI8Value}],
      isDirectAnswer: true,
      label: "Entrez "+TI8Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT08" },
      informationsToShow: ["TI1 : "+TI1Value,"TI2 : "+TI2Value,"TI3 : "+TI3Value,"TI4 : "+TI4Value,"TI5 : "+TI5Value,
        "TI7 : "+TI7Value
      ],
    }
  ],
  onCompleteAnimation: { animationName: "engine_complete"},
};

export default function getExercise1(){
    return myExercise;
}