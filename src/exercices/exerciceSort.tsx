import { useState } from "react";
import type { SortAction } from "./exercice";

interface SortStepDisplayProps {
  action: SortAction;
  stepName: string;
  stepDescription: string;
  onSubmit: (orderedIds: string[]) => void;
}

interface SortItem { id: string; label: string; }

export function SortStepDisplay({ action, stepName, stepDescription, onSubmit }: SortStepDisplayProps) {
  const [items, setItems]       = useState<SortItem[]>(action.items);
  const [selected, setSelected] = useState<number | null>(null); // index sélectionné
  const [error, setError]       = useState(false);

  const handleClick = (i: number) => {
    if (selected === null) {
      // Premier clic : sélectionner l'item
      setSelected(i);
    } else if (selected === i) {
      // Re-clic sur le même : désélectionner
      setSelected(null);
    } else {
      // Deuxième clic : échanger les deux positions
      setItems((prev) => {
        const next = [...prev];
        [next[selected], next[i]] = [next[i], next[selected]];
        return next;
      });
      setSelected(null);
    }
  };

  const handleValidate = () => {
    const ids = items.map((it) => it.id);
    const valid = action.expectedOrder.every((id, i) => id === ids[i]);
    if (!valid) { setError(true); setTimeout(() => setError(false), 800); return; }
    onSubmit(ids);
  };

  return (
    <div
      className="flex flex-col gap-4 py-3 px-4 w-72"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div>
        <p className="text-gray-800 font-semibold text-sm">{stepName}</p>
        <p className="text-gray-500 text-xs mt-1">{stepDescription}</p>
        <p className="text-gray-500 text-[0.65rem] mt-1">
          {selected === null
            ? "Cliquez un élément pour le sélectionner"
            : "Cliquez une position pour l'y déplacer"}
        </p>
      </div>

      <ol className="flex flex-col gap-2">
        {items.map((item, i) => {
          const isSelected = selected === i;
          const isTarget   = selected !== null && selected !== i;
          return (
            <li
              key={item.id}
              onClick={() => handleClick(i)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border
                cursor-pointer transition-all select-none
                ${isSelected
                  ? "bg-blue-100 border-blue-500 scale-[1.02] shadow-md"
                  : isTarget
                  ? "bg-gray-50 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                  : "bg-gray-100 border-gray-400 hover:border-gray-500"
                }`}
            >
              <span className={`w-5 h-5 rounded-full text-[0.6rem] font-bold
                flex items-center justify-center shrink-0
                ${isSelected ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-100"}`}>
                {i + 1}
              </span>
              <span className="text-gray-800 text-sm font-medium flex-1">{item.label}</span>
              {isSelected && (
                <span className="text-gray-300 text-[0.6rem] font-semibold">sélectionné</span>
              )}
            </li>
          );
        })}
      </ol>

      {error && (
        <p className="text-red-500 text-xs text-center animate-pulse">
          Ordre incorrect, réessayez.
        </p>
      )}

      <button
        onClick={handleValidate}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ background: "linear-gradient(135deg, #313131 0%, #161616 100%)" }}
        className="w-full py-2 rounded-lg text-white text-sm font-semibold cursor-pointer"
      >
        Valider l'ordre
      </button>
    </div>
  );
}