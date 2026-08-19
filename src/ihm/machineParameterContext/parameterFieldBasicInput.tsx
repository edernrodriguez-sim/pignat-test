import { useState } from "react";
import type { FieldProps } from "./parameterField";
import type { SavedField } from "../../exercices/exercice";

export default function ParameterFieldBasicInput({ parameter, onChange }: FieldProps){
    if (!parameter || parameter.length === 0)
        return null;
    const [paramValue, setParamValue] = useState(parameter[0].value);
    
    function OnInputChange(newValue: number){
        setParamValue(() => {
            const newReturn: SavedField = {key: parameter[0].key, value: newValue}
            onChange([newReturn]);
            return newValue;
        })
    }

    return (
      <div className="parameterField flex flex-col gap-5.5">
        <div className="parameterField-header flex flex-col">
          <div>P1_SP_REEL</div>
        </div>
        <div className="flex">
            <input id="parameter_modal_basic_input_id" className="bg-white" value={Number(paramValue)} max={100} type="number" onChange={(e) => OnInputChange(Number(e.target.value))} /> %
        </div>

      </div>
    );
}