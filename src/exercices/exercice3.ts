// ─── Exercice (stable, défini hors composant) ─────────────────────────────────
import type { Exercise } from "./exercice";

const myExercise: Exercise = {
  id: "ex-003",
  name: "Bilans de matière en mode continu",
  description: "Etudier les différents bilans de matière mis en jeu lors de la distillation",
  steps: [
    {
      id: "step-0", number: 15, name: "Ordonner les températures par ordre croissant",
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
      startTemperatureOnComplete: false
    },
  ],
  onCompleteAnimation: { animationName: "engine_complete"},
};

export default function getExercise3(){
    return myExercise;
}