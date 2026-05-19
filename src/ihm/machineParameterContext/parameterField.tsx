// ─── Champs d'édition selon le type ──────────────────────────────────────────

import type { MachineParameter } from "../../models/machineParameter";

 
interface FieldProps {
  parameter: MachineParameter;
  value: MachineParameter["value"];
  onChange: (v: MachineParameter["value"]) => void;
}
 
export function ParameterField({ parameter, value, onChange }: FieldProps) {
 console.log(`ParameterField : param : ${parameter.key} / paramValue :  : ${parameter.value} / value :  : ${value}`)
  if (typeof parameter.value === "number") {
    return (
      <div className="parameterField flex flex-col gap-1.5">
        <label className="text-gray-900 text-xs font-semibold uppercase tracking-wider">
          Valeur {parameter.unitType && <span className="normal-case font-normal">({parameter.unitType})</span>}
        </label>
        <input
          type="number"
          value={value as number}
          onChange={(e) => onChange(Number(e.target.value))}
          className="bg-white border border-gray-300 focus:border-blue-400 rounded-lg px-3 py-2 text-grey-900 text-sm outline-none transition-colors"
        />
      </div>
    );
  }
 
  if (typeof parameter.value === "string") {
    return (
      <div className="parameterField flex flex-col gap-1.5">
        <label className="text-gray-900 text-xs font-semibold uppercase tracking-wider">
          Valeur
        </label>
        <input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white border border-gray-600 focus:border-blue-400 rounded-lg px-3 py-2 text-white text-sm outline-none transition-colors"
        />
      </div>
    );
  }

    if (typeof parameter.value === "boolean") {
    return (
      <div className="parameterField flex flex-col gap-1.5">
        <label className="text-gray-900 text-xs font-semibold uppercase tracking-wider">
          Cliquer pour changer la valeur
        </label>
        <input
          type="checkbox"
          checked = {value as boolean}
          onChange={(e) => {
            console.log(e.target.checked);
            onChange(e.target.checked);
            // if (e.target.value === "on"){
            //   onChange(true);
            // }
            // else {onChange(e.target.value)
            // }
            }} 
          className="bg-white border border-gray-600 focus:border-blue-400 rounded-lg px-3 py-2 text-white text-sm outline-none transition-colors"
        />
      </div>
    );
  }
 
  return null;
}
