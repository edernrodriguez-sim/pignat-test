// ─── Champs d'édition selon le type ──────────────────────────────────────────

import type { SavedField } from "../../exercices/exercice";
import type { MachineParameter } from "../../models/machineParameter";
import ParameterFieldBasicInput from "./parameterFieldBasicInput";
import ParameterFieldBoolean from "./parameterFieldBoolean";
import ParameterFieldReflux from "./parameterFieldReflux";
import ParameterFieldRegulator from "./parameterFieldRegulator";

const regulatorKeys = ["TTC06","DPIC01","FIC02"]
export interface FieldProps {
  regulatorPrefix?: string | null;
  parameter: MachineParameter[];
  value: SavedField[];
  onChange: (fields: SavedField[]) => void;
}

export interface RegulatorFieldProps {
  regulatorPrefix?: string | null;
  parameter: MachineParameter[];
  value: SavedField[];
  onValidate: (fields: SavedField[]) => void;
}

 
export function ParameterField({ regulatorPrefix, parameter, value, onChange }: FieldProps) {
  
  
  if (parameter[0].key.includes("EV")){
    return(<ParameterFieldReflux onChange={onChange} value={value} parameter={parameter} />)
  }
  else if ( regulatorPrefix && regulatorKeys.includes(regulatorPrefix)){
    return(<ParameterFieldRegulator regulatorPrefix={regulatorPrefix} onChange={onChange} value={value} parameter={parameter} />)
  }
  else if (typeof parameter[0].value === "boolean") {
    return (
      <ParameterFieldBoolean parameter={parameter} value={value} onChange={onChange}/>
    );
  }
  else {
    return (
    <ParameterFieldBasicInput  parameter={parameter} value={value} onChange={onChange}   />
    )
  }
 
  return null;
}
