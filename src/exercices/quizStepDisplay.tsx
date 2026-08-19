import { useState } from "react";
import type { QuizAction } from "./exercice";

interface QuizStepDisplayProps {
  action: QuizAction;
  stepName: string;
  stepDescription: string;
  onSubmit: (selectedIds: string[]) => void;
}

export function QuizStepDisplay({
  action,
  stepName,
  stepDescription,
  onSubmit,
}: QuizStepDisplayProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState(false);
  const isMultiple = action.correctIds.length > 1;

  const toggle = (id: string) => {
    setError(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (isMultiple) {
        // Plusieurs réponses possibles → toggle
        next.has(id) ? next.delete(id) : next.add(id);
      } else {
        // Réponse unique → remplace la sélection
        next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const handleValidate = () => {
    const ids = Array.from(selected);
    const correct = action.correctIds;
    const isValid =
      ids.length === correct.length && correct.every((id) => ids.includes(id));

    if (!isValid) {
      setError(true);
      setTimeout(() => setError(false), 800);
      return;
    }
    onSubmit(ids);
  };

  return (
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
        right:"35%",
        bottom:"25%",
        width: "30vw",
        zIndex: 100
        }}
      className="flex flex-col gap-4 py-3 px-4 w-80"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* En-tête */}
      <div className="flex flex-col gap-1">
        <p className="text-gray-800 font-semibold text-sm">{stepName}</p>
        <p className="text-gray-500 text-xs">{stepDescription}</p>
        <p className="text-blue-500 font-semibold text-sm mt-1">
          {action.question}
        </p>
        {isMultiple && (
          <p className="text-gray-400 text-[0.65rem]">
            Plusieurs réponses possibles
          </p>
        )}
      </div>

      {/* Choix */}
      <ul className="flex flex-col gap-2">
        {action.choices.map((choice) => {
          const isSelected = selected.has(choice.id);
          return (
            <li
              key={choice.id}
              onClick={() => toggle(choice.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border
                cursor-pointer transition-all select-none
                ${isSelected
                  ? "bg-blue-50 border-blue-500 text-blue-800"
                  : "bg-gray-100 border-gray-300 text-gray-800 hover:border-blue-300"
                }`}
            >
              {/* Checkbox visuelle */}
              <span className={`w-4 h-4 rounded-${isMultiple ? "sm" : "full"}
                border-2 flex items-center justify-center shrink-0 transition-colors
                ${isSelected ? "bg-blue-500 border-blue-500" : "border-gray-400"}`}
              >
                {isSelected && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium">{choice.label}</span>
            </li>
          );
        })}
      </ul>

      {/* Feedback erreur */}
      {error && (
        <p className="text-red-500 text-xs text-center animate-pulse">
          {selected.size === 0
            ? "Sélectionnez au moins une réponse."
            : "Réponse incorrecte, réessayez."}
        </p>
      )}

      {/* Bouton valider */}
      <button
        onClick={handleValidate}
        onPointerDown={(e) => e.stopPropagation()}
        disabled={selected.size === 0}
        style={{ background: selected.size === 0
          ? "#9ca3af"
          : "linear-gradient(135deg, #313131 0%, #161616 100%)" }}
        className="w-full py-2 rounded-lg text-white text-sm font-semibold
          transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        Valider
      </button>
    </div>
  );
}