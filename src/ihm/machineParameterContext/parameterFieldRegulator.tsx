import { useState } from "react";
import type { FieldProps } from "./parameterField";
import type { SavedField } from "../../exercices/exercice";
import type { MachineParameter } from "../../models/machineParameter";
interface RegulatorLabels {
    type: string;
    title: string;
    unit: string;
}
const preheatLabels: RegulatorLabels = {
    type: "Régulation T°",
    title: "Préchauffage",
    unit: "°C"
}
const debitLabels: RegulatorLabels = {
    type: "Régulation Débit",
    title: "Condenseur",
    unit: "L/h"
}
const pressureLabels: RegulatorLabels = {
    type: "Régulation Pression",
    title: "Dif. Colonne",
    unit: "mBar"
}
export default function ParameterFieldRegulator({ regulatorPrefix, parameter,  onChange }: FieldProps){
    const REGULATION_SUFFIXES = ["PV", "SP", "OP", "OP_MAN", "PB", "TI", "TD"];
    const AUTO_SUFFIXE = "AUTO";
    const ENABLED_BG_CLASS = "bg-white";
    const DISABLED_BG_CLASS = "bg-gray-300";
    // Initialisation : on construit un objet { "TTC06_PV": 72, "TTC06_SP": 85, ... }
    // en cherchant chaque clé dans le tableau value (qui est SavedField[])
    
    const [drafts, setDrafts] = useState<Record<string, number | boolean>>(
        () => Object.fromEntries(
        REGULATION_SUFFIXES.map((suffix) => {
            const key = `${regulatorPrefix}_${suffix}`;
            const found = (parameter as MachineParameter[]).find((f) => f.key === key);
            return [key, Number(found?.value) ?? ""];  // valeur existante ou vide
        })
        )
    );
    const [autoMode, setAutoMode] = useState((parameter as MachineParameter[]).find((f) => f.key === `${regulatorPrefix}_${AUTO_SUFFIXE}`)?.value);
    
    let labels: RegulatorLabels = {
        title: "",
        type: "",
        unit: ""
    }

    if (regulatorPrefix?.includes("TTC")){
        labels = preheatLabels;
    }
    else if (regulatorPrefix?.includes("FIC")){
        labels = debitLabels;
    }
    else if (regulatorPrefix?.includes("DPIC")){
        labels = pressureLabels;
    }


    const onCustomChange = (key: string, newValue: number | boolean) => {
        const customKey = `${regulatorPrefix}_${key}`;
        
        // S'il y a un changement de OP_MAN et qu'on est en mode manuel OP prend la même valeur
        if (!autoMode && key === "OP_MAN"){
            onCustomChange("OP",newValue);
        }


        setDrafts((prev) => 
        {
            const updated = { ...prev, [customKey]: newValue };

            // ✅ updated contient la vraie nouvelle valeur
            const fields: SavedField[] = Object.entries(updated).map(([k, v]) => ({
            key: k,
            value: v,
            }));
            
            onChange(fields);

            return updated;
        });
    }

    const autoButtonToggle = (newValue: boolean) => {
        setAutoMode(newValue);

        onCustomChange(`${AUTO_SUFFIXE}`, newValue);
    }





    return (
      <div className="parameterField flex flex-col gap-5.5">
        <div className="parameterField-header flex flex-col">
          <div>{labels.type}</div>
          <div>{labels.title} {regulatorPrefix}</div>
          <button id="regulator-auto-btn" className={`w-13 py-4 m-auto hover:bg-gray-500  hover:text-gray-400 text-sm font-semibold transition-colors cursor-pointer 
            ${autoMode ? "bg-gray-900 text-gray-200" : "regulator-auto-btn-off" }`}
            onClick={() => autoButtonToggle(!autoMode)}
            >
            AUTO
            </button>
        </div>
        <div className="modal-regulator-content flex gap-1">
            <div id="modal-regulator-left" className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        {/*PV*/}
                        <div className="modal-regulator-label">{REGULATION_SUFFIXES[0]}</div>
                        <input id="PV_input" className={`${DISABLED_BG_CLASS}`} max={100} type="number"
                        disabled
                        value={Number(drafts[`${regulatorPrefix}_${REGULATION_SUFFIXES[0]}`])}
                        />{labels.unit}
                    </div>
                        {/*SP*/}
                    <div className="flex gap-2">
                        <div className="modal-regulator-label">{REGULATION_SUFFIXES[1]}</div>
                        <input id="SP_input" max={100} type="number" 
                         className={`${ autoMode ? ENABLED_BG_CLASS : DISABLED_BG_CLASS }`}
                        disabled={!Boolean(autoMode)}
                        value={Number(drafts[`${regulatorPrefix}_${REGULATION_SUFFIXES[1]}`])}
                        onChange={(e) => onCustomChange(REGULATION_SUFFIXES[1], Number(e.target.value))}
                        />{labels.unit}
                    </div>
                </div>
                        {/*OP*/}
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <div className="modal-regulator-label">{REGULATION_SUFFIXES[2]}</div>
                        <input id="OP_input" className={`${DISABLED_BG_CLASS}`} max={100} type="number" 
                        disabled
                        value={Number(drafts[`${regulatorPrefix}_${REGULATION_SUFFIXES[2]}`])}
                        />%
                    </div>
                        {/*OP_MAN*/}
                    <div className="flex gap-2">
                        <div>{REGULATION_SUFFIXES[3]}</div>
                        <input id="OP_MAN_input" className={`${ autoMode ? DISABLED_BG_CLASS : ENABLED_BG_CLASS }`} max={100} type="number" 
                        disabled={Boolean(autoMode)}
                        value={Number(drafts[`${regulatorPrefix}_${REGULATION_SUFFIXES[3]}`])}
                        onChange={(e) => onCustomChange(REGULATION_SUFFIXES[3], Number(e.target.value))}
                        />%
                    </div>
                </div>
            </div>

            <div className="reflux-button-container flex flex-col gap-3">
                        {/*PB*/}
                <div className="flex gap-2">
                    <div className="modal-regulator-label-right">{REGULATION_SUFFIXES[4]}</div>
                    <input id="PB_input" className="bg-white" max={100} type="number" 
                    value={Number(drafts[`${regulatorPrefix}_${REGULATION_SUFFIXES[4]}`])}
                    onChange={(e) => onCustomChange(REGULATION_SUFFIXES[4], Number(e.target.value))}
                    />
                </div>
                        {/*TI*/}
                <div className="flex gap-2">
                    <div className="modal-regulator-label-right">{REGULATION_SUFFIXES[5]}</div>
                    <input id="TI_input" className="bg-white" max={100} type="number" 
                    value={Number(drafts[`${regulatorPrefix}_${REGULATION_SUFFIXES[5]}`])}
                    onChange={(e) => onCustomChange(REGULATION_SUFFIXES[5], Number(e.target.value))}
                    />
                </div>
                        {/*TD*/}
                <div className="flex gap-2">
                    <div className="modal-regulator-label-right">{REGULATION_SUFFIXES[6]}</div>
                    <input id="TD_input" className="bg-white" max={100} type="number" 
                    value={Number(drafts[`${regulatorPrefix}_${REGULATION_SUFFIXES[6]}`])}
                    onChange={(e) => onCustomChange(REGULATION_SUFFIXES[6], Number(e.target.value))}
                    />
                </div>
            </div>
        </div>
      </div>
    );
}