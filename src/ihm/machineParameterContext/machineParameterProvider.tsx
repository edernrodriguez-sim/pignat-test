// ─── Context ──────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useCallback } from "react";
import type { MachineParameter } from "../../models/machineParameter";
import { ParameterEditModal } from "./parameterEditModal";
import type { SavedField } from "../../exercices/exercice";

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
  updateParameter: (values: SavedField[]) => void;
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
  onParametersChange?: (updated: MachineParameter[]) => void;
    /**
   * Appelé après chaque confirmation dans la modale.
   * Branchez-y onInputChange de useExercise pour connecter les deux systèmes.
   * @param parameterId  l'id du MachineParameter modifié
   * @param newValue     la nouvelle valeur sous forme de string
   */
  onParameterSaved?: (fields: SavedField[]) => void;
  onMultiParameterSaved?: (fields: SavedField[]) => void;


  children: React.ReactNode;
}
 
/** Permet la modification et la détection de modif d'un champ depuis la modal de l'ihm */
export function MachineParameterProvider({
  parameters,
  onParametersChange,
  onParameterSaved,
  onMultiParameterSaved,
  children,
}: MachineParameterProviderProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
 
  const openEditModal  = useCallback((id: string) => setEditingId(id), []);
  const closeEditModal = useCallback(() => setEditingId(null), []);
 
  const updateParameter = useCallback(
    (values: SavedField[]) => {
            console.log("updateParameter");
            console.log(values);
      // onParametersChange(
      //   parameters.map((p) => (values.find(v => v.key === p.key) !== undefined ? { ...p, value: values.find(v => v.key === p.key)!.value } : p))
      // );
      if (onParameterSaved)
        onParameterSaved(values);
    },
    [parameters, onParametersChange, onParameterSaved],
  );
 let editingParam: MachineParameter[] = []; 
  if (editingId?.includes("TTC")){
    editingParam = parameters.filter((p) => p.key.includes("TTC"));
  }
  else if (editingId?.includes("EV")){
    editingParam = parameters.filter((p) => p.key.includes("EV"));
  }
  else if (editingId?.includes("DPIC")){
    editingParam = parameters.filter((p) => p.key.includes("DPIC"));
  }
  else if (editingId?.includes("FIC")){
    editingParam = parameters.filter((p) => p.key.includes("FIC"));
  }
  else {
    const param = parameters.find((p) => p.key === editingId) ?? null;
    if (param)
      editingParam = [param];
  }
 
  return (
    <MachineParameterContext.Provider value={{ parameters, openEditModal, updateParameter }}>
      {children}
 
      {/* Modale d'édition — montée ici, au niveau du Provider */}
      {editingParam.length > 0 && (
        <ParameterEditModal
          editingId={editingId}
          parameter={editingParam}
          onClose={closeEditModal}
          onSave={(newValue) => {
            updateParameter(newValue);
            onMultiParameterSaved?.(newValue);
            closeEditModal();
          }}
        />
      )}
    </MachineParameterContext.Provider>
  );
}


