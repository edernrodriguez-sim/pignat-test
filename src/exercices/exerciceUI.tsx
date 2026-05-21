import { useState } from "react";
import type { ExerciseState, ExerciseStep, InputChangeAction } from "./exercice";
import { ExercisePanel } from "./exercicePanel";

export default function ExerciceUI({state, reset, completeCurrentStep, currentStep , handleCustomAnswer}
  : { state: ExerciseState, reset: () => void, completeCurrentStep: () => void, currentStep: ExerciseStep, handleCustomAnswer: (key: string, value: string) => void}
) {
  const [answerValue, setAnswerValue] = useState("");
  function handleSubmit(){
    const action = currentStep.action as InputChangeAction;
    handleCustomAnswer(action.fieldId, answerValue);
    setAnswerValue("");
  }

  function onValueChange(e: React.ChangeEvent<HTMLInputElement>){
    setAnswerValue(e.target.value);
  }


  return (
    <div style={{ display: "flex", gap: "24px", padding: "32px" }}>

      {/* ── Panneau 3D (votre canvas 3DVerse) ── */}
      {/* ── Colonne droite ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Panneau d'exercice */}
        <ExercisePanel
          state={state}
          onReset={reset}
          onForceComplete={completeCurrentStep}
          showDebug={true} // Désactivez en production
        />

        {/* Input de l'UI (étape 2) — visible uniquement quand c'est l'étape active */}
        {currentStep?.action.type === "inputChange" && !state.isCompleted &&
          currentStep.action.isDirectAnswer && (
            
              <form onSubmit={(e) => {e.preventDefault();
                handleSubmit();
              }}>

            <div
              style={{
                background: "#d9d9d9",
                border: "1px solid #9c9c9f",
                boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5)",
                borderRadius: 12,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                position: "absolute",
                right:"45%",
                bottom:"25%",
                zIndex: 100
              }}
            >
              <label
                htmlFor="pressure-input"
                style={{ color: "#37383a", fontSize: 12, fontWeight: 600 }}
              >
                { currentStep.action.modalTitle ? currentStep.action.modalTitle : "Débit (l/H)"}
              </label>
              <input
                id="pressure-input"
                type="text"
                value={answerValue}
                onChange={onValueChange}
                style={{
                  background: "#ededed",
                  border: "1px solid #bebebe",
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: "#424242",
                  fontSize: 14,
                  outline: "none",
                }}
              />

              <button id="customAnswerModalButton" className="rounded-md text-gray-200"
              type="submit">Valider</button>
            </div>
              </form>
          )}
      </div>
    </div>
  );
  }