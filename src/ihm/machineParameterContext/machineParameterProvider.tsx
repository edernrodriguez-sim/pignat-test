// ─── Context ──────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useCallback } from "react";
import type { MachineParameter } from "../../models/machineParameter";
import { ParameterEditModal } from "./parameterEditModal";

export type ParameterFieldType =
  | { kind: "number"; min?: number; max?: number; step?: number; unit?: string }
  | { kind: "boolean" }
  | { kind: "select"; options: { label: string; value: string }[] }
  | { kind: "text"; maxLength?: number };

 
interface MachineParameterContextValue {
  parameters: MachineParameter[];
  /** Ouvre la modale d'édition pour le paramètre donné */
  openEditModal: (parameterId: string) => void;
  /** Met à jour la valeur d'un paramètre */
  updateParameter: (parameterId: string, newValue: MachineParameter["value"]) => void;
}
 
const MachineParameterContext = createContext<MachineParameterContextValue | null>(null);
 
// ─── Hook d'accès ─────────────────────────────────────────────────────────────
 
export function useMachineParameters() {
  const ctx = useContext(MachineParameterContext);
  if (!ctx) throw new Error("useMachineParameters must be used inside <MachineParameterProvider>");
  return ctx;
}


interface MachineParameterProviderProps {
  parameters: MachineParameter[];
  onParametersChange: (updated: MachineParameter[]) => void;
    /**
   * Appelé après chaque confirmation dans la modale.
   * Branchez-y onInputChange de useExercise pour connecter les deux systèmes.
   * @param parameterId  l'id du MachineParameter modifié
   * @param newValue     la nouvelle valeur sous forme de string
   */
  onParameterSaved?: (parameterId: string, newValue: string | number |boolean) => void;


  children: React.ReactNode;
}
 
/** Permet la modification et la détection de modif d'un champ depuis la modal de l'ihm */
export function MachineParameterProvider({
  parameters,
  onParametersChange,
  onParameterSaved,
  children,
}: MachineParameterProviderProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
 
  const openEditModal  = useCallback((id: string) => setEditingId(id), []);
  const closeEditModal = useCallback(() => setEditingId(null), []);
 
  const updateParameter = useCallback(
    (id: string, newValue: MachineParameter["value"]) => {
      onParametersChange(
        parameters.map((p) => (p.key === id ? { ...p, value: newValue } : p))
      );
      console.log(`updateParameter : id: ${id} / value : ${newValue}`)
    },
    [parameters, onParametersChange],
  );
 
  const editingParam = parameters.find((p) => p.key === editingId) ?? null;
 
  return (
    <MachineParameterContext.Provider value={{ parameters, openEditModal, updateParameter }}>
      {children}
 
      {/* Modale d'édition — montée ici, au niveau du Provider */}
      {editingParam && (
        <ParameterEditModal
          parameter={editingParam}
          onClose={closeEditModal}
          onSave={(newValue) => {
            updateParameter(editingParam.key, newValue);
            onParameterSaved?.(editingParam.key, newValue);
            closeEditModal();
          }}
        />
      )}
    </MachineParameterContext.Provider>
  );
}


