import { useState } from "react";
import type { FieldProps } from "./parameterField";
import type { SavedField } from "../../exercices/exercice";

export default function ParameterFieldReflux({ parameter, onChange }: FieldProps){
    const [refluxValue, setRefluxValue] = useState(Number(parameter[2].value));
    const [refluxType, setRefluxType] = useState(Number(parameter[1].value));
    const SELECTED_STYLE = "bg-gray-900 text-gray-200";
    const UNSELECTED_STYLE = "bg-gray-300 text-gray-900";
    function ChangeRefluxType(newValue: number){
        setRefluxType(newValue);
        const newReturn: SavedField = {key: parameter[1].key, value: newValue}
        onChange([newReturn]);
    }

    function onChangeRefluxValue(newValue: number){
        setRefluxValue(newValue);
        const newReturn: SavedField = {key: parameter[2].key, value: newValue}
        onChange([newReturn]);
    }

    return (
      <div className="parameterField flex flex-col gap-5.5">
        <div className="parameterField-header flex flex-col">
          <div>GESTION REFLUX</div>
        </div>
        <div className="flex gap-5">
            <div id="modal-reflux-left-side" className="flex flex-col gap-3">
                <div>REFLUX (%)</div>
                <div><input id="parameter-reflux-input" className="bg-white" value={refluxValue} max={100} type="number" step={0.01}  onChange={(e) => onChangeRefluxValue(Number(e.target.value))} /></div>
            </div>

            <div className="reflux-button-container flex flex-col gap-2">
                <button id="parameter-reflux-reflux-button" onClick={() => ChangeRefluxType(0)} autoFocus={refluxType === 0} 
                className={`flex-1 py-2 rounded-lg hover:bg-gray-500  hover:text-gray-200 text-sm font-semibold transition-colors cursor-pointer
                ${ refluxType === 0 ? SELECTED_STYLE : UNSELECTED_STYLE }`}>REFLUX</button>

                <button id="parameter-reflux-cycle-button" onClick={() => ChangeRefluxType(1)} autoFocus={refluxType === 1}  
                className={`flex-1 py-2 rounded-lg hover:bg-gray-500 hover:text-gray-200 text-sm font-semibold transition-colors cursor-pointer
                ${ refluxType === 1 ? SELECTED_STYLE : UNSELECTED_STYLE }`}>CYCLE</button>
                
                <button id="parameter-reflux-soutirage-button" onClick={() => ChangeRefluxType(2)} autoFocus={refluxType === 2}  
                className={`flex-1 py-2 rounded-lg hover:bg-gray-500 hover:text-gray-200 text-sm font-semibold transition-colors cursor-pointer
                ${ refluxType === 2 ? SELECTED_STYLE : UNSELECTED_STYLE }`}>SOUTIRAGE</button>
            </div>
        </div>
      </div>
    );
}