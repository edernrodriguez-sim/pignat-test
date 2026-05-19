import { useState } from "react";
import type { MachineParameter } from "../../models/machineParameter";
import { ParameterField } from "./parameterField";

interface ParameterEditModalProps {
  parameter: MachineParameter;
  onClose: () => void;
  onSave: (value: MachineParameter["value"]) => void;
}
 
export function ParameterEditModal({ parameter, onClose, onSave }: ParameterEditModalProps) {
  const [draft, setDraft] = useState<MachineParameter["value"]>(parameter.value);
 
  const handleSave = () => onSave(draft);
 
  return (
    <div
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
            <p className="text-black font-bold text-lg">{parameter.label}</p>
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
          <ParameterField parameter={parameter} value={draft} onChange={setDraft} />
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
