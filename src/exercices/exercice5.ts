// ─── Exercice (stable, défini hors composant) ─────────────────────────────────
import { ENTITY_TAG_LIST } from "../entityTagList";
import type { Exercise } from "./exercice";

const myExercise: Exercise = {
  id: "ex-005",
  name: "Influence du taux de reflux",
  description: "Etudier l’influence du taux de reflux sur la qualité ",
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
      onCompleteAnimation: [
        { animationName: "bidon_20L_flexible_out", entityId: "fec3c1f9-5ad9-4bb4-b3e2-7744c7d242dc" },
        { animationName: "bidon_20L_in", entityId: "6e1710fe-8116-4209-989b-fa4315a94056" }
      ],
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
      onActionAnimation: [{ animationName: "v16_in", entityId: "2708134b-9fc3-4354-aca2-2900f5c8443b" }]
    },
    {
      id: "step-5", number: 5, name: "Réglage du débit d'eau",
      description: "Entrez la valeur de débit sur 200 l/H",
      action: { type: "inputChange", expectedFields:[{key: "FIC02_SP", value: "200"}],
      label: "Entrez 200 dans le champ de débit" },
      onCompleteAnimation: [{ animationName: "complete_water_flow", entityId: "9b67bb27-1672-488a-a851-1549bbfb174a" }]
    },
    {
      id: "step-6", number: 6, name: "Régler le pourcentage de course du piston",
      description: "Entrer la valeur de course du piston à 20%",
      action: { type: "inputChange", expectedFields:[{key: "P1_SP_REEL", value: 20}],
      label: "Entrez 20 dans le champ de débit" },
    },
    {
      id: "step-137", number: 7, name: "Ouvrir vanne V4",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V4, label: "Cliquez sur la vanne V4 dans la scène 3D" },
      onActionAnimation: [{ animationName: "v4_in", entityId: "6786201f-a452-43f8-951a-be102de62210" }],
    },
    
    {
      id: "step-1338", number: 8, name: "Démarrer la pompe",
      description: "Démarrer la pompe en appuyant sur le bouton P1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "P1", value: true}],
      label: "Entrez 200 dans le champ de débit" },
      onActionAnimation: [{ animationName: "complete_fill_from_V4", entityId: "4b8d6998-d98c-4f75-8c63-0e6066e0bec4" }],
    },
    {
      id: "step-159", number: 9, name: "Mettre la température de préchauffe à 80°c",
      description: "Ouvrir l'IHM et ouvrir la fenêtre TTC06_SP et entrer la valeur 80 dans le champ SP.",
      action: { type: "inputChange", expectedFields:[{key: "TTC06_SP", value: 80}],
      label: "Entrez 80 dans le champ SP" },
    },


    {
      id: "step-1605", number: 10, name: "Démarrer la préchauffe",
      description: "Ouvrir l'IHM et ouvrir la fenêtre H1 et cliquer sur le bouton ON.",
      action: { type: "inputChange", expectedFields:[{key: "H1", value: true}],
      label: "" },
    },
    {
      id: "step-1761", number:11, name: "Fixer la puissance de chauffe à 80%",
      description: "Ouvrir l'IHM et ouvrir la fenêtre DPIC01 et mettre la valeur de OP_MAN à 80.",
      action: { type: "inputChange", expectedFields:[{key: "DPIC01_OP_MAN", value: 80}],
      label: "" },
    },
    {
      id: "step-187", number:12, name: "Démarrer la chauffe",
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
      id: "step-1325345334", number: 13, name: "Ouvrir vanne V3",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V3, label: "Cliquez sur la vanne V3 dans la scène 3D" },
      onActionAnimation: [{ animationName: "v3_in", entityId: "a2664f3b-c99a-46cd-b4d6-9ce77d5f6cbd" },
        { animationName: "tuyau_prechauffage_plateau_2_1", entityId: "09918f80-4efb-4cff-b0f5-7043103b60cf" },
        { animationName: "tuyau_prechauffage_plateau_2", entityId: "d66baaf2-1fb4-4541-a455-e3881b417217" }
      ],
    },
    {
      id: "step-132456456", number: 14, name: "Fermer vanne V4",
      description: "Cliquez sur la vanne pour la fermer.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V4, label: "Cliquez sur la vanne V4 dans la scène 3D" },
      onActionAnimation: [{ animationName: "v4_out", entityId: "10ec4acc-9df7-4a88-8ff6-0c39288e0c7e" },
        { animationName: "vidage_tuyau_post_prechauffage_3", entityId: "bb6d754d-6332-4f8d-96fc-627e061c9750" },
        { animationName: "vidage_tuyau_prechauffage_plateau_1", entityId: "265ed146-5a04-44ae-a407-b672c9e6b9e3" }
      ],
    },
    {
      id: "step-1325345348", number: 15, name: "Ouvrir vanne V8",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V8, label: "Cliquez sur la vanne V8 dans la scène 3D" },
      onActionAnimation: [{ animationName: "v8_in", entityId: "d62102a3-9a75-46f1-ae67-a8e70f6509a6" },
        { animationName: "tuyau_inf_bouilleur_V8", entityId: "a47e5f0d-7742-4ec0-b858-f842b4272c5f" },
        { animationName: "tuyau_inf_V8_bidon_V12", entityId: "f22bd9ed-9103-45a0-b127-524ee1f8de7f" }
      ],
    },
    {
      id: "step-19168", number: 16, name: "Fixer l'OUTPUT de TI5 sur 66.6%",
      description: "Ouvrir l'IHM et ouvrir la fenêtre EV01 et mettre la valeur de Reflux à 66.6 .",
      action: { type: "inputChange", expectedFields:[{key: "EV_VALUE", value: 66.6}],
      label: "" },
    },
    {
      id: "step-20917", number: 17, name: "Mettre le Reflux en mode Cycle",
      description: "Ouvrir l'IHM et ouvrir la fenêtre EV01 et cliquer sur Cycle .",
      action: { type: "inputChange", expectedFields:[{key: "EV_MODE", value: 1}],
      label: "" },
      onActionAnimation: [
        { animationName: "soutirage_cycle", entityId: "cae5c9eb-5985-4c6b-b576-484092fba126"}
      ]
    },
    {
      id: "step-21183", number: 18, name: "Fermer la vanne de vidange de la recette distillat",
      description: "Cliquer sur la vanne V15.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V15, label: "Cliquez sur la vanne V15 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "v15_out", entityId: "a7c4ab57-8777-4905-b48a-136d321d438a" },
        { animationName: "fill_bidon_1L_V15", entityId: "c8470577-4e01-4bf0-94f7-ba91adaab138" }
      ],
    },
    {
      id: "step-wait2219",
      number: 19,
      name: "Attendre 5 min",
      description: "Temps d'attente acceléré.",
      action: { type: "wait", realDuration: 10, displayDuration: 300 },
    },
    {
      id: "step-24320", number: 20, name: "Ouvrir la vanne de vidange du distillat",
      description: "Cliquer sur la vanne V15.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V15, label: "Cliquez sur la vanne V15 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "v15_in", entityId: "0d756bb1-2280-4cd9-9dc0-599759a0205a" },
        { animationName: "empty_bidon_1L_V15", entityId: "3d87a251-88a8-49eb-bb72-2f954a6cb25e" },
        { animationName: "fill_bidon_10L_V15", entityId: "82e192d7-266e-4b5c-9cb4-aa377eda4f2d" }
      ],
    },
    {
      id: "step-26235", number: 23, name: "Calculez D à partir de la quantité de distillat arrondi au centième",
      description: "Formule : D = M x 12 = .... Kg/h",
      action: { type: "inputChange", expectedFields:[{key: "answer", value: "1.34"}],
      isDirectAnswer: true,
      label: "Entrez 1.34 dans le champ", modalTitle: "Calculez D à partir de la quantité de distillat arrondi au centième" },
      informationsToShow: ["Quantité du distillat : ", "M = 0,1117 Kg"],
    },
    {
      id: "step-198249", number: 24, name: "Fixer l'OUTPUT de TI5 sur 50%",
      description: "Ouvrir l'IHM et ouvrir la fenêtre EV01 et mettre la valeur de Reflux à 50 .",
      action: { type: "inputChange", expectedFields:[{key: "EV_VALUE", value: 50}],
      label: "" },
    },
    
    {
      id: "step-213555", number: 25, name: "Fermer la vanne de vidange de la recette distillat",
      description: "Cliquer sur la vanne V15.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V15, label: "Cliquez sur la vanne V15 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "v15_out", entityId: "a7c4ab57-8777-4905-b48a-136d321d438a" },
        { animationName: "fill_bidon_1L_V15", entityId: "c8470577-4e01-4bf0-94f7-ba91adaab138" }
      ],
    },
    {
      id: "step-wait225333",
      number: 23,
      name: "Attendre 5 min",
      description: "Temps d'attente acceléré.",
      action: { type: "wait", realDuration: 10, displayDuration: 300 },
    },
    {
      id: "step-27", number: 27, name: "Ouvrir la vanne de vidange du distillat",
      description: "Cliquer sur la vanne V15.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V15, label: "Cliquez sur la vanne V15 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "v15_in", entityId: "0d756bb1-2280-4cd9-9dc0-599759a0205a" },
        { animationName: "empty_bidon_1L_V15", entityId: "3d87a251-88a8-49eb-bb72-2f954a6cb25e" },
        { animationName: "fill_bidon_10L_V15", entityId: "82e192d7-266e-4b5c-9cb4-aa377eda4f2d" }
      ],
    },
    {
      id: "step-2658", number: 28, name: "Calculez D à partir de la quantité de distillat arrondi à l'unité",
      description: "Formule : D = M x 12 = .... Kg/h",
      action: { type: "inputChange", expectedFields:[{key: "answer", value: "2"}],
      isDirectAnswer: true,
      label: "Entrez 2 dans le champ", modalTitle: "Calculez D à partir de la quantité de distillat arrondi à l'unité" },
      informationsToShow: ["Quantité du distillat : ", "M = 0.1667Kg"],
    },


    {
      id: "step-19298", number: 29, name: "Fixer l'OUTPUT de TI5 sur 33.3%",
      description: "Ouvrir l'IHM et ouvrir la fenêtre EV01 et mettre la valeur de Reflux à 33.3 .",
      action: { type: "inputChange", expectedFields:[{key: "EV_VALUE", value: 33.3}],
      label: "" },
    },
    
    {
      id: "step-21330", number: 30, name: "Fermer la vanne de vidange de la recette distillat",
      description: "Cliquer sur la vanne V15.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V15, label: "Cliquez sur la vanne V15 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "v15_out", entityId: "a7c4ab57-8777-4905-b48a-136d321d438a" },
        { animationName: "fill_bidon_1L_V15", entityId: "c8470577-4e01-4bf0-94f7-ba91adaab138" }
      ],
    },
    {
      id: "step-wait22531",
      number: 31,
      name: "Attendre 5 min",
      description: "Temps d'attente acceléré.",
      action: { type: "wait", realDuration: 10, displayDuration: 300 },
    },
    {
      id: "step-24323", number: 32, name: "Ouvrir la vanne de vidange du distillat",
      description: "Cliquer sur la vanne V15.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V15, label: "Cliquez sur la vanne V15 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "v15_in", entityId: "0d756bb1-2280-4cd9-9dc0-599759a0205a" },
        { animationName: "empty_bidon_1L_V15", entityId: "3d87a251-88a8-49eb-bb72-2f954a6cb25e" },
        { animationName: "fill_bidon_10L_V15", entityId: "82e192d7-266e-4b5c-9cb4-aa377eda4f2d" }
      ],
    },
    {
      id: "step-26533", number: 33, name: "Calculez D à partir de la quantité de distillat arrondi au centième",
      description: "Formule : D = M x 12 = .... Kg/h",
      action: { type: "inputChange", expectedFields:[{key: "answer", value: "2.68"}],
      isDirectAnswer: true,
      label: "Entrez 2.68 dans le champ", modalTitle: "Calculez D à partir de la quantité de distillat arrondi au centième" },
      informationsToShow: ["Quantité du distillat : ", "M = 0,2234Kg"],
    },
    {
      id: "step-263345", number: 34, name: "Conclusion",
      description: "",
      action: { type: "quiz", question: "Quelle est la bonne affirmation ?",
      choices: [
      { id: "a", label: "En augmentant R le taux de reflux, nous soutirons moins de produit (D diminue) mais nous enrichissons le distillat en éthanol (ωD augmente)" },
      { id: "b", label: "En augmentant R le taux de reflux, nous soutirons plus de produit (D augmente) mais nous enrichissons le distillat en éthanol (ωD augmente)" },
      { id: "c", label: "En augmentant R le taux de reflux, nous soutirons moins de produit (D diminue) mais nous appauvrissons le distillat en éthanol (ωD diminue)" },
      ],
      correctIds: ["a"]},
      tableToShow: {
        headers: ["R","D (kg/h)","ωD"],
        rows: [["2","1.34","91.7%"],
               ["1","2","90%"],
               ["0.5","2.68","88%"]]
      }
    },




  ],
  onCompleteAnimation: { animationName: "engine_complete"},
};

export default function getExercise5(){
    return myExercise;
}