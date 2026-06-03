import { useState } from "react";
import type { MachineParameter } from "../../models/machineParameter";
import { ParameterField } from "./parameterField";
import type { SavedField } from "../../exercices/exercice";

interface ParameterEditModalProps {
  editingId: string | null;
  parameter: MachineParameter[];
  onClose: () => void;
  onSave: (value: SavedField[]) => void;
}
 
export function ParameterEditModal({editingId, parameter, onClose, onSave }: ParameterEditModalProps) {
  // Champs de la modal qui sont en "brouillon" et ne seront appliqué qu'a la validation de la modal
  const [draft, setDraft] = useState<SavedField[]>([]);
 
  // Appelé pour valider les modifications dans la modal
  const handleSave = () => {
    onSave(draft);
  };

  const handleChange = (newValues : SavedField[]) => {
    setDraft(newValues);
    
  }
 
  return (
    <div
    id="parameter-edit-modal"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-gray-100 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b  border-gray-300">
          <div>
            {/* <p className="text-black font-bold text-lg">{parameter.label}</p> */}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-grey-800 hover:text-white bg-gray-200 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
 
        {/* Champ selon le type */}
        <div className="px-5 py-4">
          <ParameterField regulatorPrefix={editingId} parameter={parameter} value={draft} onChange={handleChange} />
        </div>
 
        {/* Footer */}
        <div className="flex gap-2 px-5 py-3 border-t border-gray-300">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-300 hover:bg-gray-500 text-gray-900 hover:text-gray-200 text-sm font-semibold transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
          id="parameterEditModalConfirmBtn"
            onClick={handleSave}
            className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold transition-colors cursor-pointer"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
