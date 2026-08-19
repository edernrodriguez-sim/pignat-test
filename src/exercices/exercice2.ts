// ─── Exercice (stable, défini hors composant) ─────────────────────────────────
import { ENTITY_TAG_LIST } from "../entityTagList";
import type { Exercise } from "./exercice";

const TI1Value = 91;
const TI2Value = 83.4;
const TI3Value = 80;
const TI4Value = 77.5;
const TI5Value = 77.2;
const TI7Value = 24;
const TI8Value = 26;

const myExercise: Exercise = {
  id: "ex-002",
  name: "Relevé des températures en mode Continu",
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
      id: "step-1", number: 2, name: "Placer le bidon contenant la solution",
      description: "Cliquez sur le bidon pour le placer.",
      action: { type: "click3D", entityTag:  ENTITY_TAG_LIST.BIDON_20_L, label: "Cliquez sur le bouchon dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "bidon_20L_in", entityId: "6e1710fe-8116-4209-989b-fa4315a94056" }],
      startTemperatureOnComplete: false
    },
    {
      id: "step-2", number: 3, name: "Placer le flexible dans le bidon",
      description: "Cliquez sur le flexible pour le placer.",
      action: { type: "click3D", entityTag:  ENTITY_TAG_LIST.FLEXIBLE_POMPE, label: "Cliquez sur le flexible dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "bidon_20L_flexible_in", entityId: "e5a14273-73da-4287-a306-33497e62390c" }],
      startTemperatureOnComplete: false
    },
    {
      id: "step-3", number: 4, name: "Ouvrir vanne V16",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V16, label: "Cliquez sur la vanne dans la scène 3D" },
      onActionAnimation: [{ animationName: "v16_in", entityId: "2708134b-9fc3-4354-aca2-2900f5c8443b" }],
      informationsToShow: ["Volume relevé : 5L"]
    },
    {
      id: "step-5", number: 5, name: "Réglage du débit d'eau",
      description: "Entrez la valeur de débit sur 200 l/H",
      action: { type: "inputChange", expectedFields:[{key: "FIC02_SP", value: "200"}],
      label: "Entrez 200 dans le champ de débit" },
      onCompleteAnimation: [{ animationName: "complete_water_flow", entityId: "9b67bb27-1672-488a-a851-1549bbfb174a" }]
    },
    {
      id: "step-4", number: 6, name: "Régler le pourcentage de course du piston",
      description: "Entrer la valeur de course du piston à 20%",
      action: { type: "inputChange", expectedFields:[{key: "P1_SP_REEL", value: 20}],
      label: "Entrez 20 dans le champ de débit" },
    },
    {
      id: "step-5", number: 7, name: "Ouvrir vanne V4",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V4, label: "Cliquez sur la vanne V4 dans la scène 3D" },
      onActionAnimation: [{ animationName: "v4_in", entityId: "6786201f-a452-43f8-951a-be102de62210" }],
    },
    {
      id: "step-6", number: 8, name: "Démarrer la pompe",
      description: "Démarrer la pompe en appuyant sur le bouton P1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "P1", value: true}],
      label: "Entrez 200 dans le champ de débit" },
      onCompleteAnimation: [{ animationName: "complete_fill_from_V4", entityId: "4b8d6998-d98c-4f75-8c63-0e6066e0bec4" }],
    },
    {
      id: "step-7", number: 9, name: "Démarrer la préchauffe",
      description: "Démarrer la préchauffe en appuyant sur le bouton H1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "H1", value: true}],
      label: "Cocher la case de H1" },
    },
    {
      id: "step-7", number: 10, name: "Modifier le SET POINT (SP) de TTC06",
      description: "Sur l’écran de régulation, cliquer sur le SET POINT de TTC06 afin de fixer la température de la préchauffe à 80°C",
      action: { type: "inputChange", expectedFields:[{key: "TTC06_SP", value: "80"}],
      label: "label" },
    },
    {
      id: "step-7", number: 11, name: "Démarrer la préchauffe",
      description: "Démarrer la préchauffe en appuyant sur le bouton H1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "H1", value: true}],
      label: "Cocher la case de H1" },
    },
    {
      id: "step-176", number:12, name: "Fixer la puissance de chauffe à 80%",
      description: "Ouvrir l'IHM et ouvrir la fenêtre DPIC01 et mettre la valeur de OP_MAN à 80.",
      action: { type: "inputChange", expectedFields:[{key: "DPIC01_OP_MAN", value: 80}],
      label: "" },
    },
    {
      id: "step-8", number: 13, name: "Démarrer la chauffe",
      description: "Démarrer la chauffe en appuyant sur le bouton H2 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "H2", value: true }],
      label: "Cocher la case de H2" },
      onCompleteAnimation: [{ animationName: "boiler_bell_reflux_anim", entityId: "8073c152-3372-42aa-8f4d-d06e243a9277" }],
      startTemperatureOnComplete: true,
      targetTemperatures: [
      { key: "TT01", value: 84.2, time: 30 },
      { key: "TT02", value: 81.3, time: 30 }, 
      { key: "TT03", value: 78, time: 30 },
      { key: "TT04", value: 77.4, time: 30 }, 
      { key: "TT05", value: 77.2, time: 30 }, 
      { key: "TT06", value: 77.1, time: 30 }, 
      { key: "TT07", value: 23.9, time: 30 }, 
      { key: "TT08", value: 26, time: 30 }, 
    ]
    },
    {
      id: "step-198", number: 14, name: "Fixer l'OUTPUT de TI5 sur 66.6%",
      description: "Ouvrir l'IHM et ouvrir la fenêtre EV01 et mettre la valeur de Reflux à 66.6 .",
      action: { type: "inputChange", expectedFields:[{key: "EV_VALUE", value: 66.6}],
      label: "" },
    },
    {
      id: "step-209", number: 15, name: "Mettre le Reflux en mode Cycle",
      description: "Ouvrir l'IHM et ouvrir la fenêtre EV01 et cliquer sur Cycle .",
      action: { type: "inputChange", expectedFields:[{key: "EV_MODE", value: 1}],
      label: "" },
    },




    
    {
      id: "step-9", number: 16, name: "Relevé de température TT01",
      description: "Indiquer la valeur de température du bouilleur",
      action: { type: "inputChange", expectedFields:[{key: "", value: TI1Value}],
      isDirectAnswer: true,
      label: "Entrez "+TI1Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT01" },
    },
    {
      id: "step-10", number: 17, name: "Relevé de température TT02",
      description: "Indiquer la valeur de température du pied de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT02", value: TI2Value}],
      isDirectAnswer: true,
        label: "Entrez "+TI2Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT02" },
      informationsToShow: ["TI1 = "+TI1Value + " °C"],
    },
    {
      id: "step-11", number: 18, name: "Relevé de température TT03",
      description: "Indiquer la valeur de température du milieu de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT03", value: TI3Value}],
      isDirectAnswer: true,
        label: "Entrez "+TI3Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT03" },
      informationsToShow: ["TI1 = "+TI1Value + " °C", "TI2 = "+TI2Value + " °C"],
    },
    {
      id: "step-12", number: 19, name: "Relevé de température TT04",
      description: "Indiquer la valeur de température en haut de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT04", value: TI4Value}],
      isDirectAnswer: true,
        label: "Entrez "+TI4Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT04" },
      informationsToShow: ["TI1 = "+TI1Value + " °C", "TI2 = "+TI2Value + " °C", "TI3 = "+TI3Value + " °C"],
    },
    {
      id: "step-13", number: 20, name: "Relevé de température TT05",
      description: "Indiquer la valeur de température en haut de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT05", value: TI5Value}],
        isDirectAnswer: true,
        label: "Entrez "+TI5Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT05" },
      informationsToShow: ["TI1 = "+TI1Value + " °C", "TI2 = "+TI2Value + " °C", "TI3 = "+TI3Value + " °C", "TI4 = "+TI4Value + " °C"],
    },
    {
      id: "step-156987", number: 21, name: "Ordonner les températures par ordre décroissant",
      description: "",
      action: {
        type: "sort",
        expectedOrder: ["a","b","c","d","e"],
        items: [
          {id: "d", label: "TI4"},
          {id: "b", label: "TI2"},
          {id: "a", label: "TI1"},
          {id: "e", label: "TI5"},
          {id: "c", label: "TI3"},
          
        ],
      },
      startTemperatureOnComplete: false,
      informationsToShow: ["TI1 = "+TI1Value + " °C", "TI2 = "+TI2Value + " °C", "TI3 = "+TI3Value + " °C", "TI4 = "+TI4Value + " °C", "TI5 = "+TI5Value + " °C"],
    },

    {
      id: "step-14", number: 22, name: "Relevé de température TT07",
      description: "Indiquer la valeur de température TT07 sur la dalle tactile",
      action: { type: "inputChange",  expectedFields:[{key: "TT07", value: TI7Value}],
      isDirectAnswer: true,
        label: "Entrez "+TI7Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT07" },
    },
    {
      id: "step-15", number: 23, name: "Relevé de température TT08",
      description: "Indiquer la valeur de température TT08 sur la dalle tactile",
      action: { type: "inputChange",  expectedFields:[{key: "TT08", value: TI8Value}],
      isDirectAnswer: true, 
        label: "Entrez "+TI8Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT08" },
      informationsToShow: ["TI7 = "+TI7Value + " °C"],
    },
    {
      id: "step-159555", number: 24, name: "Ordonner les températures par ordre décroissant",
      description: "",
      action: {
        type: "sort",
        expectedOrder: ["a","b"],
        items: [
          {id: "b", label: "TI8"},
          {id: "a", label: "TI7"},
          
        ],
      },
      startTemperatureOnComplete: false,
      informationsToShow: ["TI7 = "+TI7Value + " °C", "TI8 = "+TI8Value + " °C"],
    },
  ],
  onCompleteAnimation: { animationName: "engine_complete"},
};

export default function getExercise2(){
    return myExercise;
}