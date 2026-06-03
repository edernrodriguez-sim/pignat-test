// ─── Exercice (stable, défini hors composant) ─────────────────────────────────
import { ENTITY_TAG_LIST } from "../entityTagList";
import type { Exercise } from "./exercice";

const myExercise: Exercise = {
  id: "ex-002",
  name: "Relevé des températures en mode Continu",
  description: "Etudier l’évolution de la température dans la distillation en mode batch",
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
      id: "step-3", number: 3, name: "Ouvrir vanne V16",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V16, label: "Cliquez sur la vanne dans la scène 3D" },
      onActionAnimation: [{ animationName: "v16_in", entityId: "2708134b-9fc3-4354-aca2-2900f5c8443b" }],
      informationsToShow: ["Volume relevé : 5L"]
    },
    {
      id: "step-4", number: 4, name: "Régler le pourcentage de course du piston",
      description: "Entrer la valeur de course du piston à 20%",
      action: { type: "inputChange", expectedFields:[{key: "P1_SP_REEL", value: 20}],
      label: "Entrez 20 dans le champ de débit" },
    },
    {
      id: "step-5", number: 5, name: "Ouvrir vanne V4",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V4, label: "Cliquez sur la vanne V4 dans la scène 3D" },
      onActionAnimation: [{ animationName: "v4_in", entityId: "6786201f-a452-43f8-951a-be102de62210" }],
    },
    {
      id: "step-6", number: 6, name: "Démarrer la pompe",
      description: "Démarrer la pompe en appuyant sur le bouton P1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "P1", value: true}],
      label: "Entrez 200 dans le champ de débit" },
      onCompleteAnimation: [{ animationName: "complete_fill_from_V4", entityId: "4b8d6998-d98c-4f75-8c63-0e6066e0bec4" }],
    },
    {
      id: "step-7", number: 7, name: "Démarrer la préchauffe",
      description: "Démarrer la préchauffe en appuyant sur le bouton H1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "H1", value: true}],
      label: "Cocher la case de H1" },
    },
    {
      id: "step-8", number: 8, name: "Démarrer la chauffe",
      description: "Démarrer la chauffe en appuyant sur le bouton H2 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "H2", value: true }],
      label: "Cocher la case de H2" },
      onCompleteAnimation: [{ animationName: "boiler_bell_reflux_anim", entityId: "8073c152-3372-42aa-8f4d-d06e243a9277" }],
      startTemperatureOnComplete: true,
      targetTemperatures: [
      { key: "TT01", value: 90, time: 30 },
      { key: "TT02", value: 85, time: 30 }, 
      { key: "TT03", value: 80, time: 30 },
      { key: "TT04", value: 75, time: 30 }, 
      { key: "TT05", value: 70, time: 30 }, 
      { key: "TT06", value: 60, time: 30 },
      { key: "TT07", value: 20, time: 30 },
      { key: "TT08", value: 35, time: 30 },
    ]
    },
    
    {
      id: "step-9", number: 9, name: "Relevé de température TT01",
      description: "Indiquer la valeur de température du bouilleur",
      action: { type: "inputChange", expectedFields:[{key: "TT01", value: "90"}],
      isDirectAnswer: true,
      label: "Entrez 90 dans le champ de débit", modalTitle: "Indiquer la valeur de TT01" },
    },
    {
      id: "step-10", number: 10, name: "Relevé de température TT02",
      description: "Indiquer la valeur de température du pied de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT02", value: "85"}],
      isDirectAnswer: true,
        label: "Entrez 85 dans le champ de débit", modalTitle: "Indiquer la valeur de TT02" },
    },
    {
      id: "step-11", number: 11, name: "Relevé de température TT03",
      description: "Indiquer la valeur de température du milieu de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT03", value: "80"}],
      isDirectAnswer: true,
        label: "Entrez 80 dans le champ de débit", modalTitle: "Indiquer la valeur de TT03" },
    },
    {
      id: "step-12", number: 12, name: "Relevé de température TT04",
      description: "Indiquer la valeur de température en haut de colonne",
      action: { type: "inputChange", expectedFields:[{key: "TT04", value: "75"}],
      isDirectAnswer: true,
        label: "Entrez 75 dans le champ de débit", modalTitle: "Indiquer la valeur de TT04" },
    },
    {
      id: "step-13", number: 13, name: "Relevé de température TT07",
      description: "Indiquer la valeur de température TT07 sur la dalle tactile",
      action: { type: "inputChange",  expectedFields:[{key: "TT07", value: "20"}],
      isDirectAnswer: true,
        label: "Entrez 20 dans le champ de débit", modalTitle: "Indiquer la valeur de TT07" },
    },
    {
      id: "step-14", number: 14, name: "Relevé de température TT08",
      description: "Indiquer la valeur de température TT08 sur la dalle tactile",
      action: { type: "inputChange",  expectedFields:[{key: "TT08", value: "35"}],
      isDirectAnswer: true, 
        label: "Entrez 35 dans le champ de débit", modalTitle: "Indiquer la valeur de TT08" },
    },
  ],
  onCompleteAnimation: { animationName: "engine_complete"},
};

export default function getExercise2(){
    return myExercise;
}