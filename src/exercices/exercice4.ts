// ─── Exercice (stable, défini hors composant) ─────────────────────────────────
import { ENTITY_TAG_LIST } from "../entityTagList";
import type { Exercise } from "./exercice";

const myExercise: Exercise = {
  id: "ex-004",
  name: "Bilans matière sur éthanol en mode continu",
  description: "Etudier les différents bilans thermiques mis en jeu lors de la distillation",
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
      onCompleteAnimation: [
        { animationName: "bidon_20L_flexible_out", entityId: "fec3c1f9-5ad9-4bb4-b3e2-7744c7d242dc" },
        { animationName: "bidon_20L_in", entityId: "6e1710fe-8116-4209-989b-fa4315a94056" }
      ],
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
      id: "step-3",  name: "Régler le pourcentage de course du piston",
      description: "Entrer la valeur de course du piston à 20%",
      action: { type: "inputChange", expectedFields:[{key: "P1_SP_REEL", value: 20}],
      label: "Entrez 20 dans le champ de débit" },
    },
    {
      id: "step-4",  name: "Ouvrir le bypass et démarrer la pompe",
      description: "Démarrer la pompe en appuyant sur le bouton P1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "P1", value: true}],
      label: "Entrez 200 dans le champ de débit" },
    },
    {
      id: "step-wait",
      
      name: "Attendre 10 min",
      description: "Temps d'attente acceléré.",
      action: { type: "wait", realDuration: 10, displayDuration: 400 },
    },
    {
      id: "step-6",  name: "Couper la pompe et fermer le bypass",
      description: "Démarrer la pompe en appuyant sur le bouton P1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "P1", value: false}],
      label: "Entrez 200 dans le champ de débit" },
    },
    {
      id: "step-7",  name: "Indiquez le débit d'alimention arrondie au dixième",
      description: "Formule : A = Mcal x 6 = .... Kg/h",
      action: { type: "inputChange", expectedFields:[{key: "answer", value: "4.6"}],
      isDirectAnswer: true,
      label: "Entrez 4.6 dans le champ", modalTitle: "Indiquez le débit d'alimention (arrondi au dixième)" },
      tableToShow: {
        headers: ["","Débit (kg/h)","Fraction massique d'éthanol ω"],
        rows: [["A","","33%"],
              ["D","","%"],
              ["R","","%"],]
      },
      informationsToShow: ["Volume d'eau aspiré par la pompe : ", "Mcal = 0.77 Kg"],
      onCompleteAnimation: [{ animationName: "bidon_20L_out", entityId: "3a019097-bda9-4d6c-87bc-a73f78fd6306" }],
    },
    {
      id: "step-8",  name: "Placer le bidon contenant la solution",
      description: "Cliquez sur le bidon pour le placer.",
      action: { type: "click3D", entityTag:  ENTITY_TAG_LIST.BIDON_20_L, label: "Cliquez sur le bouchon dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "bidon_20L_flexible_out", entityId: "fec3c1f9-5ad9-4bb4-b3e2-7744c7d242dc" },
        { animationName: "bidon_20L_in", entityId: "6e1710fe-8116-4209-989b-fa4315a94056" }
      ],      
      tableToShow: {
        headers: ["","Débit (kg/h)","Fraction massique d'éthanol ω"],
        rows: [["A","4.6","33%"],
              ["D","","%"],
              ["R","","%"],]
      },
      startTemperatureOnComplete: false,
    },
    {
      id: "step-9",  name: "Placer le flexible dans le bidon",
      description: "Cliquez sur le flexible pour le placer.",
      action: { type: "click3D", entityTag:  ENTITY_TAG_LIST.FLEXIBLE_POMPE, label: "Cliquez sur le flexible dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "bidon_20L_flexible_in", entityId: "e5a14273-73da-4287-a306-33497e62390c" }],

      startTemperatureOnComplete: false
    },
    {
      id: "step-10",  name: "Ouvrir vanne V16",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V16, label: "Cliquez sur la vanne dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "v16_in", entityId: "2708134b-9fc3-4354-aca2-2900f5c8443b", vanneKey:"V16", newVanneStatus:true }],

    },
    {
      id: "step-11",  name: "Réglage du débit d'eau",
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
      id: "step-132",  name: "Ouvrir vanne V4",
      description: "Cliquez sur la vanne pour l'ouvrir.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V4, label: "Cliquez sur la vanne V4 dans la scène 3D" },
      onCompleteAnimation: [{ animationName: "v4_in", entityId: "6786201f-a452-43f8-951a-be102de62210", vanneKey:"V4", newVanneStatus:true }],
    },
    {
      id: "step-133",  name: "Démarrer la pompe",
      description: "Démarrer la pompe en appuyant sur le bouton P1 sur la dalle tactile et enclencher le bouton.",
      action: { type: "inputChange", expectedFields:[{key: "P1", value: true}],
      label: "Entrez 200 dans le champ de débit" },
      onCompleteAnimation: [{ animationName: "complete_fill_from_tubes_to_V4", entityId: "4980de47-8ac0-41b7-9edf-8e63a4331411" }],
    },
    {
      id: "step-154",  name: "Mettre la température de préchauffe à 80°c",
      description: "Ouvrir l'IHM et ouvrir la fenêtre TTC06_SP et entrer la valeur 80 dans le champ SP.",
      action: { type: "inputChange", expectedFields:[{key: "TTC06_SP", value: 80}],
      label: "Entrez 80 dans le champ SP" },
    },
    {
      id: "step-165",  name: "Démarrer la préchauffe",
      description: "Ouvrir l'IHM et ouvrir la fenêtre H1 et cliquer sur le bouton ON.",
      action: { type: "inputChange", expectedFields:[{key: "H1", value: true}],
      label: "" },
      startTemperatureOnComplete: true,
       targetTemperatures: [
      { key: "TT06", value: 80, time: 10 },
    ]
    },

    {
      id: "step-176",  name: "Fixer la puissance de chauffe à 80%",
      description: "Ouvrir l'IHM et ouvrir la fenêtre DPIC01 et mettre la valeur de OP_MAN à 80.",
      action: { type: "inputChange", expectedFields:[{key: "DPIC01_OP_MAN", value: 80}],
      label: "" },
    },

    
    {
      id: "step-187",  name: "Démarrer la chauffe",
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
      { key: "TT07", value: 24, time: 30 }, 
      { key: "TT08", value: 26, time: 30 }, 
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
      id: "step-2137",  name: "Prélever un échantillon de distillat",
      description: "Cliquer sur la vanne V14.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V14, label: "Cliquez sur la vanne V14 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "sample_v14", entityId: "5046e472-12e9-4a46-a91c-18f7a5296fe2" }
      ]
    },
    {
      id: "step-wait223",
      
      name: "Attendre 1 min",
      description: "Temps d'attente acceléré.",
      action: { type: "wait", realDuration: 3, displayDuration: 60 }
    },
    {
      id: "step-213",  name: "Fermer la vanne de vidange de la recette distillat",
      description: "Cliquer sur la vanne V15.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V15, label: "Cliquez sur la vanne V15 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "v15_out", entityId: "a7c4ab57-8777-4905-b48a-136d321d438a", vanneKey:"V15", newVanneStatus:false },
        { animationName: "fill_bidon_1L_V15", entityId: "c8470577-4e01-4bf0-94f7-ba91adaab138" }
      ],
      tableToShow: {
        headers: ["","Débit (kg/h)","Fraction massique d'éthanol ω"],
        rows: [["A","4.6","33%"],
              ["D","","91.7%"],
              ["R","","%"],]
      },
    },
    {
      id: "step-wait22",
      
      name: "Attendre 5 min",
      description: "Temps d'attente acceléré.",
      action: { type: "wait", realDuration: 5, displayDuration: 240 }
    },
    {
      id: "step-243",  name: "Ouvrir la vanne de vidange du distillat",
      description: "Cliquer sur la vanne V15.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V15, label: "Cliquez sur la vanne V15 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "v15_in", entityId: "0d756bb1-2280-4cd9-9dc0-599759a0205a", vanneKey:"V15", newVanneStatus:true },
        { animationName: "empty_bidon_1L_V15", entityId: "3d87a251-88a8-49eb-bb72-2f954a6cb25e" },
        { animationName: "fill_bidon_10L_V15", entityId: "82e192d7-266e-4b5c-9cb4-aa377eda4f2d" }
      ]
    },
    {
      id: "step-265",  name: "Calculez D à partir de la quantité de distillat arrondi au centième",
      description: "Formule : D = M x 12 = .... Kg/h",
      action: { type: "inputChange", expectedFields:[{key: "answer", value: "1.34"}],
      isDirectAnswer: true,
      label: "Entrez 1.34 dans le champ", modalTitle: "Calculez D à partir de la quantité de distillat arrondi au centième" },
      informationsToShow: ["Quantité du distillat : ", "M = 0,1116 Kg"],
    },
    {
      id: "step-2137v11",  name: "Prélever un échantillon de résidu",
      description: "Cliquer sur la vanne V11.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V11, label: "Cliquez sur la vanne V14 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "sample_v11", entityId: "fa4ce010-c199-4318-a62c-cafd3c042b6d" }
      ],
      tableToShow: {
        headers: ["","Débit (kg/h)","Fraction massique d'éthanol ω"],
        rows: [["A","4.6","33%"],
              ["D","1.34","91.7%"],
              ["R","","%"],]
      },
    },
    {
      id: "step-wait2234",
      
      name: "Attendre 1 min",
      description: "Temps d'attente acceléré.",
      action: { type: "wait", realDuration: 3, displayDuration: 60 }
    },
    {
      id: "step-221",  name: "Fermer la vanne de vidange de la recette résidu",
      description: "Cliquer sur la vanne V12.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V12, label: "Cliquez sur la vanne V12 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "v12_out", entityId: "a2e5f8b1-c191-4e5d-9fd6-6e0635664e11", vanneKey:"V12", newVanneStatus:false },
        { animationName: "fill_bidon_1L_V12", entityId: "b1c9b15f-cb14-4e4e-828c-dbe997a6b816" }
      ],
      tableToShow: {
        headers: ["","Débit (kg/h)","Fraction massique d'éthanol ω"],
        rows: [["A","4.6","33%"],
              ["D","1.34","91.7%"],
              ["R","","8.3%"],]
      },
    },
    {
      id: "step-wait26",
      
      name: "Attendre 5 min",
      description: "Temps d'attente acceléré.",
      action: { type: "wait", realDuration: 10, displayDuration: 300 },
    },
    {
      id: "step-257",  name: "Ouvrir la vanne de vidange du résidu",
      description: "Cliquer sur la vanne V12.",
      action: { type: "click3D", entityTag: ENTITY_TAG_LIST.V12, label: "Cliquez sur la vanne V12 dans la scène 3D" },
      onCompleteAnimation: [
        { animationName: "empty_bidon_1L_V12", entityId: "16e1555e-18be-4788-a48e-132d6ade31ff", vanneKey:"V12", newVanneStatus:true },
        { animationName: "v12_in", entityId: "c54b634a-0375-43d6-89a6-e799af1d308d" },
        { animationName: "fill_bidon_10L_V12", entityId: "c1207705-77b2-446c-836b-eb7bdeddbc87" }
      ],
    },
    {
      id: "step-278",  name: "Calculez R à partir de la quantité de résidu (arrondi au centième)",
      description: "Formule : R = M x 12 = .... Kg/h",
      action: { type: "inputChange", expectedFields:[{key: "answer", value: "3.26"}],
      isDirectAnswer: true,
      label: "Entrez 3.26 dans le champ", modalTitle: "Calculez D à partir de la quantité de résidu (arrondi au centième)" },
      informationsToShow: ["Quantité du résidu : ", "M = 0,2716 Kg"],
    },
    {
      id: "step-289",  name: "Vérifiez que : A x ωA = D x ωD + R x ωR",
      description: "Indiquez le résultat de A x ωA",
      action: { type: "inputChange", expectedFields:[{key: "answer", value: "1.518", min: 1.51, max: 1.52 }],
      isDirectAnswer: true,
      label: "Entrez 1.518 dans le champ", modalTitle: "Indiquez le résultat de A x ωA" },
      tableToShow: {
        headers: ["","Débit (kg/h)","Fraction massique d'éthanol ω"],
        rows: [["A","4.6","33%"],
               ["D","1.34","91.7%"],
               ["R","3.26","8.3%"]]
      }
    },
    {
      id: "step-2830",  name: "Vérifiez que : A x ωA = D x ωD + R x ωR",
      description: "Indiquez le résultat de D x ωD + R x ωR",
      action: { type: "inputChange", expectedFields:[{key: "answer", value: "1.49936", min: 1.4, max: 1.5 }],
      isDirectAnswer: true,
      label: "Entrez 1.49936 dans le champ", modalTitle: "Indiquez le résultat de D x ωD + R x ωR" },
      tableToShow: {
        headers: ["","Débit (kg/h)","Fraction massique d'éthanol ω"],
        rows: [["A","4.6","33%"],
               ["D","1.34","91.7%"],
               ["R","3.26","8.3%"]]
      }
    },
  ],
  onCompleteAnimation: { animationName: "engine_complete"},
};

export default function getExercise4(){
    return myExercise;
}