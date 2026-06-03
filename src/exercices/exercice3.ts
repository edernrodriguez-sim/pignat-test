// ─── Exercice (stable, défini hors composant) ─────────────────────────────────
import { ENTITY_TAG_LIST } from "../entityTagList";
import type { Exercise } from "./exercice";

const myExercise: Exercise = {
  id: "ex-003",
  name: "Bilans de matière en mode continu",
  description: "Etudier les différents bilans de matière mis en jeu lors de la distillation",
  steps: [
    {
      id: "step-1", number: 1, name: "Placer le bidon contenant la solution",
      description: "Cliquez sur le bidon pour le placer.",
      action: { type: "click3D", entityTag:  ENTITY_TAG_LIST.BIDON_20_L, label: "Cliquez sur le bouchon dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "bidon_20L_in", entityId: "6e1710fe-8116-4209-989b-fa4315a94056" }],
      startTemperatureOnComplete: false
    },
    {
      id: "step-2", number: 2, name: "Placer le flexible dans le bidon",
      description: "Cliquez sur le flexible pour le placer.",
      action: { type: "click3D", entityTag:  ENTITY_TAG_LIST.FLEXIBLE_POMPE, label: "Cliquez sur le flexible dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "bidon_20L_flexible_in", entityId: "e5a14273-73da-4287-a306-33497e62390c" }],
      startTemperatureOnComplete: false
    },
    {
      id: "step-3", number: 3, name: "Régler le pourcentage de course du piston",
      description: "Entrer la valeur de course du piston à 20%",
      action: { type: "inputChange", expectedFields:[{key: "P1_SP_REEL", value: 20}],
      label: "Entrez 20 dans le champ de débit" },
    },
    {
      id: "step-4", number: 4, name: "Démarrer la pompe",
      description: "Démarrer la pompe en appuyant sur le bouton P1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "P1", value: true}],
      label: "Entrez 200 dans le champ de débit" },
    },
    {
      id: "step-wait",
      number: 5,
      name: "Attendre 10 min",
      description: "Temps d'attente acceléré.",
      action: { type: "wait", realDuration: 10, displayDuration: 600 },
    },
    {
      id: "step-6", number: 6, name: "Couper la pompe",
      description: "Démarrer la pompe en appuyant sur le bouton P1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "P1", value: false}],
      label: "Entrez 200 dans le champ de débit" },
    },
    {
      id: "step-7", number: 7, name: "Indiquez le débit d'alimention",
      description: "Formule : A = Vcal x 6 = .... L/h",
      action: { type: "inputChange", expectedFields:[{key: "answer", value: "24"}],
      isDirectAnswer: true,
      label: "Entrez 24 dans le champ", modalTitle: "Indiquez le débit d'alimention" },
      informationsToShow: ["Volume d'eau aspiré par la pompe : ", "Vcal = 4L"],
      onCompleteAnimation: [{ animationName: "bidon_20L_out", entityId: "3a019097-bda9-4d6c-87bc-a73f78fd6306" }],
    },



    {
      id: "step-8", number: 8, name: "Placer le bidon contenant la solution",
      description: "Cliquez sur le bidon pour le placer.",
      action: { type: "click3D", entityTag:  ENTITY_TAG_LIST.BIDON_20_L, label: "Cliquez sur le bouchon dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "bidon_20L_flexible_out", entityId: "fec3c1f9-5ad9-4bb4-b3e2-7744c7d242dc" },
        { animationName: "bidon_20L_in", entityId: "6e1710fe-8116-4209-989b-fa4315a94056" }
      ],
      startTemperatureOnComplete: false
    },
    {
      id: "step-9", number: 9, name: "Placer le flexible dans le bidon",
      description: "Cliquez sur le flexible pour le placer.",
      action: { type: "click3D", entityTag:  ENTITY_TAG_LIST.FLEXIBLE_POMPE, label: "Cliquez sur le flexible dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "bidon_20L_flexible_in", entityId: "e5a14273-73da-4287-a306-33497e62390c" }],
      startTemperatureOnComplete: false
    },
    {
      id: "step-10", number: 10, name: "Ouvrir vanne V16",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V16, label: "Cliquez sur la vanne dans la scène 3D" },
      onActionAnimation: [{ animationName: "v16_in", entityId: "2708134b-9fc3-4354-aca2-2900f5c8443b" }],
      informationsToShow: ["Volume relevé : 5L"]
    },
    {
      id: "step-11", number: 11, name: "Réglage du débit d'eau",
      description: "Entrez la valeur de débit sur 200 l/H",
      action: { type: "inputChange", expectedFields:[{key: "FIC02_SP", value: "200"}],
      label: "Entrez 200 dans le champ de débit" },
      onCompleteAnimation: [{ animationName: "complete_water_flow", entityId: "9b67bb27-1672-488a-a851-1549bbfb174a" }]
    },
    {
      id: "step-11", number: 11, name: "Ouvrir vanne V4",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V4, label: "Cliquez sur la vanne V4 dans la scène 3D" },
      onActionAnimation: [{ animationName: "v4_in", entityId: "6786201f-a452-43f8-951a-be102de62210" }],
    },
    
    {
      id: "step-12", number: 12, name: "Démarrer la pompe",
      description: "Démarrer la pompe en appuyant sur le bouton P1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "P1", value: true}],
      label: "Entrez 200 dans le champ de débit" },
    },
    {
      id: "step-14", number: 14, name: "Mettre la température de préchauffe à 80°c",
      description: "Ouvrir l'IHM et ouvrir la fenêtre TTC06_SP et entrer la valeur 80 dans le champ SP.",
      action: { type: "inputChange", expectedFields:[{key: "TTC06_SP", value: 80}],
      label: "Entrez 80 dans le champ SP" },
    },
    {
      id: "step-17", number: 17, name: "Démarrer la préchauffe",
      description: "Ouvrir l'IHM et ouvrir la fenêtre H1 et cliquer sur le bouton ON.",
      action: { type: "inputChange", expectedFields:[{key: "H1", value: true}],
      label: "" },
    },
    {
      id: "step-18", number:18, name: "Fixer la puissance de chauffe à 80%",
      description: "Ouvrir l'IHM et ouvrir la fenêtre DPIC01 et mettre la valeur de OP_MAN à 80.",
      action: { type: "inputChange", expectedFields:[{key: "DPIC01_OP_MAN", value: 80}],
      label: "" },
    },
    {
      id: "step-19", number:19, name: "Démarrer la chauffe",
      description: "Démarrer la chauffe en appuyant sur le bouton H2 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "H2", value: true }],
      label: "Cocher la case de H2" },
      onCompleteAnimation: [{ animationName: "boiler_bell_reflux_anim", entityId: "8073c152-3372-42aa-8f4d-d06e243a9277" }],
      startTemperatureOnComplete: true,
      targetTemperatures: [
      { key: "TT01", value: 90, time: 10 },
      { key: "TT02", value: 85, time: 10 }, 
      { key: "TT03", value: 80, time: 10 },
      { key: "TT04", value: 75, time: 10 }, 
      { key: "TT05", value: 70, time: 10 }, 
      { key: "TT06", value: 60, time: 10 },
      { key: "TT07", value: 20, time: 10 },
      { key: "TT08", value: 35, time: 10 },
    ]
    },
    {
      id: "step-20", number: 20, name: "Fixer le cycle de relux sur 66.6%",
      description: "Ouvrir l'IHM et ouvrir la fenêtre EV01 et mettre la valeur de Reflux à 66.6 .",
      action: { type: "inputChange", expectedFields:[{key: "EV_VALUE", value: 66.6}],
      label: "" },
    },
    {
      id: "step-21", number: 21, name: "Mettre le Reflux en mode Cycle",
      description: "Ouvrir l'IHM et ouvrir la fenêtre EV01 et cliquer sur Cycle .",
      action: { type: "inputChange", expectedFields:[{key: "EV_MODE", value: 2}],
      label: "" },
    },
    {
      id: "step-22", number: 22, name: "Fermer la vanne de vidange de la recette distillat",
      description: "Cliquer sur la vanne V15.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V15, label: "Cliquez sur la vanne V15 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "v15_out", entityId: "a7c4ab57-8777-4905-b48a-136d321d438a" },
        { animationName: "fill_bidon_1L_V15", entityId: "c8470577-4e01-4bf0-94f7-ba91adaab138" }
      ],
    },
    {
      id: "step-23", number: 23, name: "Fermer la vanne de vidange de la recette résidu",
      description: "Cliquer sur la vanne V12.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V12, label: "Cliquez sur la vanne V12 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "v12_out", entityId: "a2e5f8b1-c191-4e5d-9fd6-6e0635664e11" },
        { animationName: "fill_bidon_1L_V12", entityId: "b1c9b15f-cb14-4e4e-828c-dbe997a6b816" }
      ]
    },
    {
      id: "step-wait2",
      number: 24,
      name: "Attendre 5 min",
      description: "Temps d'attente acceléré.",
      action: { type: "wait", realDuration: 10, displayDuration: 300 },
    },
    {
      id: "step-25", number: 25, name: "Ouvrir la vanne de vidange du distillat",
      description: "Cliquer sur la vanne V15.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V15, label: "Cliquez sur la vanne V15 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "v15_in", entityId: "0d756bb1-2280-4cd9-9dc0-599759a0205a" },
        { animationName: "empty_bidon_1L_V15", entityId: "3d87a251-88a8-49eb-bb72-2f954a6cb25e" },
        { animationName: "fill_bidon_10L_V15", entityId: "82e192d7-266e-4b5c-9cb4-aa377eda4f2d" }
      ],
    },
    {
      id: "step-256", number: 26, name: "Ouvrir la vanne de vidange du résidu",
      description: "Cliquer sur la vanne V12.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V12, label: "Cliquez sur la vanne V12 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "empty_bidon_1L_V12", entityId: "16e1555e-18be-4788-a48e-132d6ade31ff" },
        { animationName: "v12_in", entityId: "c54b634a-0375-43d6-89a6-e799af1d308d" },
        { animationName: "fill_bidon_10L_V12", entityId: "c1207705-77b2-446c-836b-eb7bdeddbc87" }
      ],
    },
    {
      id: "step-267", number: 27, name: "Calculez D à partir du volume du distillat",
      description: "Formule : D = V x 12 = .... L/h",
      action: { type: "inputChange", expectedFields:[{key: "answer", value: "12"}],
      isDirectAnswer: true,
      label: "Entrez 12 dans le champ", modalTitle: "Calculez D à partir du volume du distillat" },
      informationsToShow: ["Volume du distillat : ", "V = 1L"],
    },
    {
      id: "step-28", number: 28, name: "Calculez R à partir du volume du résidu",
      description: "Formule : R = V x 12 = .... L/h",
      action: { type: "inputChange", expectedFields:[{key: "answer", value: "12"}],
      isDirectAnswer: true,
      label: "Entrez 12 dans le champ", modalTitle: "Calculez D à partir du volume du résidu" },
      informationsToShow: ["Volume du résidu : ", "V = 1L"],
    },
    {
      id: "step-289", number: 29, name: "Vérifiez que A = D + R",
      description: "Indiquez le résultat de D + R",
      action: { type: "inputChange", expectedFields:[{key: "answer", value: "24"}],
      isDirectAnswer: true,
      label: "Entrez 24 dans le champ", modalTitle: "Indiquez le résultat de D + R" },
      informationsToShow: ["A = 24 ", "D = 12", "R = 12"],
    },
  ],
  onCompleteAnimation: { animationName: "engine_complete"},
};

export default function getExercise3(){
    return myExercise;
}