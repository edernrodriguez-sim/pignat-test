import { useState } from "react";
import type { SavedField } from "../../exercices/exercice";
import type { FieldProps } from "./parameterField";

export default function ParameterFieldBoolean({ parameter, onChange }: FieldProps){
  if (!parameter || parameter.length === 0 
  )
    return null;

    const [paramValue, setParamValue] = useState(parameter[0].value); 
    const paramDatas = parameter[0];
  const onCustomChange = (value: boolean) => {
    setParamValue(value);
    const newReturn : SavedField = {key: paramDatas.key, value: value};
    onChange([newReturn])
  }

    return (
      <div className="parameterField flex flex-col gap-5.5">
        <div className="parameterField-header flex flex-col">
          <div>{paramDatas.description}</div>
        </div>
        <div className="bool-modal-btn-container flex gap-15">
          <button id="ihm_bool_modal_off_button" className="bool-modal-btn btn-off" onClick={() => onCustomChange(false)}></button>
          <button id="ihm_bool_modal_on_button" className="bool-modal-btn btn-on" onClick={() => onCustomChange(true)}></button>
        </div>
        <div id="bool-modal-status" className={`${paramValue ? "green" : "red"}`}></div>
        <input
          type="checkbox"
          checked = {paramValue as boolean}
          onChange={() => {}}
          className="bool-modal-input bg-white border border-gray-600 focus:border-blue-400 rounded-lg px-3 py-2 text-white text-sm outline-none transition-colors"
        />
      </div>
    );
}