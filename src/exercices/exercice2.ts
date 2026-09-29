// ─── Exercice (stable, défini hors composant) ─────────────────────────────────
import { ENTITY_TAG_LIST } from "../entityTagList";
import type { Exercise } from "./exercice";

const TI1Value = 91;
const TI2Value = 83.4;
const TI3Value = 80;
const TI4Value = 77.4;
const TI5Value = 77.2;
const TI6Value = 80;
const TI7Value = 20;
const TI8Value = 22;

const myExercise: Exercise = {
  id: "ex-002",
  name: "Relevé des températures en mode Continu",
  description: "Etudier l’évolution de la température dans la distillation en mode batch",
  steps: [
      {
      id: "step-0",  name: "Placer le bac de rétention",
      description: "Cliquez sur le bac pour le placer.",
      action: { type: "click3D", entityTag:  ENTITY_TAG_LIST.BAC_RETENTION, label: "Cliquez sur le bac de retention dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "bac_de_retention_in", entityId: "d6d376eb-3686-4483-926e-82c901e04f21" },
      ],
      startTemperatureOnComplete: false
    },
    {
      id: "step-1",  name: "Placer le bidon contenant la solution",
      description: "Cliquez sur le bidon pour le placer.",
      action: { type: "click3D", entityTag:  ENTITY_TAG_LIST.BIDON_20_L, label: "Cliquez sur le bouchon dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "bidon_20L_in", entityId: "6e1710fe-8116-4209-989b-fa4315a94056" }],
      startTemperatureOnComplete: false
    },
    {
      id: "step-2",  name: "Placer le flexible dans le bidon",
      description: "Cliquez sur le flexible pour le placer.",
      action: { type: "click3D", entityTag:  ENTITY_TAG_LIST.FLEXIBLE_POMPE, label: "Cliquez sur le flexible dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "bidon_20L_flexible_in", entityId: "e5a14273-73da-4287-a306-33497e62390c" }],
      startTemperatureOnComplete: false
    },
    {
      id: "step-3",  name: "Ouvrir vanne V16",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V16, label: "Cliquez sur la vanne dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "v16_in", entityId: "2708134b-9fc3-4354-aca2-2900f5c8443b", vanneKey:"V16", newVanneStatus:true }],
      //informationsToShow: ["Volume relevé : 5L"]
    },
    {
      id: "step-4",  name: "Réglage du débit d'eau",
      description: "Entrez la valeur de débit sur 200 l/H",
      action: { type: "inputChange", expectedFields:[{key: "FIC02_SP", value: "200"}],
      label: "Entrez 200 dans le champ de débit" },
      onCompleteAnimation: [{ animationName: "complete_water_flow", entityId: "9b67bb27-1672-488a-a851-1549bbfb174a" }],
      startTemperatureOnComplete: true,
      targetTemperatures: [
      { key: "FIC02_PV", value: 200, time: 5 },
    ]
    },
    {
      id: "step-6",  name: "Régler le pourcentage de course du piston",
      description: "Entrer la valeur de course du piston à 20%",
      action: { type: "inputChange", expectedFields:[{key: "P1_SP_REEL", value: 20}],
      label: "Entrez 20 dans le champ de débit" },
    },
    {
      id: "step-7",  name: "Ouvrir vanne V4",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V4, label: "Cliquez sur la vanne V4 dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "v4_in", entityId: "6786201f-a452-43f8-951a-be102de62210", vanneKey:"V4", newVanneStatus:true }],
    },
    {
      id: "step-8",  name: "Démarrer la pompe",
      description: "Démarrer la pompe en appuyant sur le bouton P1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "P1", value: true}],
      label: "Entrez 200 dans le champ de débit" },
      onCompleteAnimation: [{ animationName: "complete_fill_from_tubes_to_V4", entityId: "4980de47-8ac0-41b7-9edf-8e63a4331411" }
      ],
    },
    {
      id: "step-9",  name: "Mettre la température de préchauffe à 80°c",
      description: "Ouvrir l'IHM et ouvrir la fenêtre TTC06_SP et entrer la valeur 80 dans le champ SP.",
      action: { type: "inputChange", expectedFields:[{key: "TTC06_SP", value: 80}],
      label: "Entrez 80 dans le champ SP" },
    },
    {
      id: "step-10",  name: "Démarrer la préchauffe",
      description: "Démarrer la préchauffe en appuyant sur le bouton H1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "H1", value: true}],
      label: "Cocher la case de H1" },
      startTemperatureOnComplete: true,
       targetTemperatures: [
      { key: "TT06", value: TI6Value, time: 10 },
    ]
    },

    {
      id: "step-176",  name: "Fixer la puissance de chauffe à 80%",
      description: "Ouvrir l'IHM et ouvrir la fenêtre DPIC01 et mettre la valeur de OP_MAN à 80.",
      action: { type: "inputChange", expectedFields:[{key: "DPIC01_OP_MAN", value: 80}],
      label: "" },
    },
    {
      id: "step-813",  name: "Démarrer la chauffe",
      description: "Démarrer la chauffe en appuyant sur le bouton H2 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "H2", value: true }],
      label: "Cocher la case de H2" },
      onCompleteAnimation: [{ animationName: "boiler_bell_reflux_anim", entityId: "8073c152-3372-42aa-8f4d-d06e243a9277" }],
      startTemperatureOnComplete: true,
      targetTemperatures: [
      { key: "TT01", value: TI1Value, time: 30 },
      { key: "TT02", value: TI2Value, time: 30 }, 
      { key: "TT03", value: TI3Value, time: 30 },
      { key: "TT04", value: TI4Value, time: 30 }, 
      { key: "TT05", value: TI5Value, time: 30 }, 
      { key: "TT07", value: TI7Value, time: 30 }, 
      { key: "TT08", value: TI8Value, time: 30 }, 
    ]
    },
    {
      id: "step-132534534",  name: "Ouvrir vanne V3",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V3, label: "Cliquez sur la vanne V3 dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "v3_in", entityId: "a2664f3b-c99a-46cd-b4d6-9ce77d5f6cbd", vanneKey:"V3", newVanneStatus:true },
        { animationName: "tuyau_prechauffage_plateau_2_1", entityId: "09918f80-4efb-4cff-b0f5-7043103b60cf" },
        { animationName: "tuyau_prechauffage_plateau_2", entityId: "d66baaf2-1fb4-4541-a455-e3881b417217" }
      ],
    },
    {
      id: "step-132456456",  name: "Fermer vanne V4",
      description: "Cliquez sur la vanne pour la fermer.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V4, label: "Cliquez sur la vanne V4 dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "v4_out", entityId: "10ec4acc-9df7-4a88-8ff6-0c39288e0c7e", vanneKey:"V4", newVanneStatus:false },
        { animationName: "vidage_tuyau_post_prechauffage_3", entityId: "bb6d754d-6332-4f8d-96fc-627e061c9750" },
        { animationName: "vidage_tuyau_prechauffage_plateau_1", entityId: "265ed146-5a04-44ae-a407-b672c9e6b9e3" }
      ],
    },
    {
      id: "step-1325345348",  name: "Ouvrir vanne V8",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V8, label: "Cliquez sur la vanne V8 dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "v8_in", entityId: "d62102a3-9a75-46f1-ae67-a8e70f6509a6", vanneKey:"V8", newVanneStatus:true },
        { animationName: "tuyau_inf_bouilleur_V8", entityId: "a47e5f0d-7742-4ec0-b858-f842b4272c5f" },
        { animationName: "tuyau_inf_V8_bidon_V12", entityId: "f22bd9ed-9103-45a0-b127-524ee1f8de7f" }
      ],
    },
    {
      id: "step-198",  name: "Fixer l'OUTPUT de TI5 sur 66.6%",
      description: "Ouvrir l'IHM et ouvrir la fenêtre EV01 et mettre la valeur de Reflux à 66.6 .",
      action: { type: "inputChange", expectedFields:[{key: "EV_VALUE", value: 66.6}],
      label: "" },
    },
    {
      id: "step-209",  name: "Mettre le Reflux en mode Cycle",
      description: "Ouvrir l'IHM et ouvrir la fenêtre EV01 et cliquer sur Cycle .",
      action: { type: "inputChange", expectedFields:[{key: "EV_MODE", value: 1}],
      label: "" },
      onCompleteAnimation: [
        { animationName: "soutirage_cycle", entityId: "cae5c9eb-5985-4c6b-b576-484092fba126"}
      ]
    },
    {
      id: "step-916",  name: "Relevé de température TT01",
      description: "Indiquer la valeur de température du bouilleur",
      action: { type: "inputChange", expectedFields:[{key: "", value: TI1Value}],
      isDirectAnswer: true,
      label: "Entrez "+TI1Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT01" },
    },
    {
      id: "step-117",  name: "Relevé de température TT02",
      description: "Indiquer la valeur de température du pied de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT02", value: TI2Value}],
      isDirectAnswer: true,
        label: "Entrez "+TI2Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT02" },
      informationsToShow: ["TI1 = "+TI1Value + " °C"],
    },
    {
      id: "step-118",  name: "Relevé de température TT03",
      description: "Indiquer la valeur de température du milieu de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT03", value: TI3Value}],
      isDirectAnswer: true,
        label: "Entrez "+TI3Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT03" },
      informationsToShow: ["TI1 = "+TI1Value + " °C", "TI2 = "+TI2Value + " °C"],
    },
    {
      id: "step-119",  name: "Relevé de température TT04",
      description: "Indiquer la valeur de température en haut de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT04", value: TI4Value}],
      isDirectAnswer: true,
        label: "Entrez "+TI4Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT04" },
      informationsToShow: ["TI1 = "+TI1Value + " °C", "TI2 = "+TI2Value + " °C", "TI3 = "+TI3Value + " °C"],
    },
    {
      id: "step-132",  name: "Relevé de température TT05",
      description: "Indiquer la valeur de température en haut de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT05", value: TI5Value}],
        isDirectAnswer: true,
        label: "Entrez "+TI5Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT05" },
      informationsToShow: ["TI1 = "+TI1Value + " °C", "TI2 = "+TI2Value + " °C", "TI3 = "+TI3Value + " °C", "TI4 = "+TI4Value + " °C"],
    },
    {
      id: "step-156987",  name: "Ordonner les températures par ordre décroissant",
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
      id: "step-14",  name: "Relevé de température TT07",
      description: "Indiquer la valeur de température TT07 sur la dalle tactile",
      action: { type: "inputChange",  expectedFields:[{key: "TT07", value: TI7Value}],
      isDirectAnswer: true,
        label: "Entrez "+TI7Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT07" },
    },
    {
      id: "step-15",  name: "Relevé de température TT08",
      description: "Indiquer la valeur de température TT08 sur la dalle tactile",
      action: { type: "inputChange",  expectedFields:[{key: "TT08", value: TI8Value}],
      isDirectAnswer: true, 
        label: "Entrez "+TI8Value+" dans le champ de débit", modalTitle: "Indiquer la valeur de TT08" },
      informationsToShow: ["TI7 = "+TI7Value + " °C"],
    },
    {
      id: "step-159555",  name: "Ordonner les températures par ordre décroissant",
      description: "",
      action: {
        type: "sort",
        expectedOrder: ["b","a"],
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