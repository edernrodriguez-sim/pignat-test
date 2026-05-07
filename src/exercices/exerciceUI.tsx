import type { ExerciseState, ExerciseStep } from "./exercice";
import { ExercisePanel } from "./exercicePanel";

export default function ExerciceUI({state, reset, completeCurrentStep, currentStep, pressureValue , handlePressureChange}
  : { state: ExerciseState, reset: () => void, completeCurrentStep: () => void, currentStep: ExerciseStep, pressureValue: string, handlePressureChange: (e: React.ChangeEvent<HTMLInputElement>) => void}
) {
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
        {currentStep?.action.type === "inputChange" &&
          currentStep.action.fieldId === "pressure-input" && (
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
                top:"45%"
              }}
            >
              <label
                htmlFor="pressure-input"
                style={{ color: "#37383a", fontSize: 12, fontWeight: 600 }}
              >
                Débit (l/H)
              </label>
              <input
                id="pressure-input"
                type="number"
                value={pressureValue}
                onChange={handlePressureChange}
                placeholder="Entrez la pression…"
                style={{
                  background: "#ededed",
                  border: "1px solid #5a5a5a",
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: "#424242",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>
          )}
      </div>
    </div>
  );
  }