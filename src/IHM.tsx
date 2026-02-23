import { IHMDatas } from "./models/IHMDatas";
import type { MachineParameter } from "./models/machineParameter";

export function IHM({onValueChange, input,waterLevel, isP1On, p1Value, isLSL1ok, refluxType, refluxRate, isBouilleurOn, bouilleurRate, highlighted, TT2Value, TT3Value, TT4Value, TT5Value, prechauffeValue, dpic, onClose}){
    const headKeyword = "head";
    const boilerKeyword = "boiler";
    const feedKeyword = "feed";
    const preHeatingKeyword = "preHeating";
    const waterKeyword = "water";

    const onCrossPressed = () => {
        console.warn("onCrossPressed");
        onClose();
    }



    const renderParam = () => {
        const machineParameters = input as MachineParameter[];
        const ihmDatas: IHMDatas = { 
            headValue: getMachineParamValue(headKeyword,machineParameters),
            boilerValue: getMachineParamValue(boilerKeyword,machineParameters),
            feedValue: getMachineParamValue(feedKeyword,machineParameters),
            preHeatingValue: getMachineParamValue(preHeatingKeyword,machineParameters),
            waterValue: getMachineParamValue(waterKeyword,machineParameters),
        };

          // ✅ Fonction pour gérer les changements et notifier le parent
        const handleInputChange = (label: string, value: number |string) => {
            // ✅ Notifier le parent
            onValueChange?.(label, value);
        };

        return (
            <div id="ihm-modal">
                <span id="cross" onClick={onCrossPressed}>x</span>
                <div id="ihm-header">
                    <h1>IHM</h1>
                </div>
                <div>
                    <div id="ihm-modal-content">
                        <div>
                            <div className="ihm-line">
                                <span>Head : </span>
                                <input type="number" placeholder="0" defaultValue={ihmDatas.headValue} className="color-red"
                                onChange={(e) => handleInputChange("head",Number(e.target.value))} />
                                <span> %</span>
                            </div>
                            <div className={`ihm-line ${highlighted === "bouilleurRate" ? 'highlighted':''}`}>
                                <span>Boiler : </span>
                                <input type="number" placeholder="0" value={bouilleurRate} className="color-red"
                                onChange={(e) => {handleInputChange("bouilleurRate",Number(e.target.value));}} />
                                <span> %</span>
                            </div>
                            <div className={`ihm-line ${highlighted === "feed" ? 'highlighted':''}`}>
                                <span>Feed : </span>
                                <input type="number" placeholder="0" value={p1Value} className="color-red"
                                onChange={(e) => handleInputChange("p1Value",Number(e.target.value))} />
                                <span> %</span>
                            </div>
                            <div className={`ihm-line ${highlighted === "statutP1" ? 'highlighted':''}`}>
                                <span>Statut P1 : </span>
                                <input type="checkbox" checked={isP1On}   className="color-red"
                                onChange={(e) => handleInputChange("isP1On",Number(e.target.checked))} />
                                { isP1On ? <span> ON</span> : <span> OFF</span>}
                            </div>
                            <div className={`ihm-line ${highlighted === "prechauffe" ? 'highlighted':''}`}>
                                <span>Pre Heating : </span>
                                <input type="number" placeholder="0" value={prechauffeValue} className="color-red"
                                onChange={(e) => handleInputChange("prechauffeValue",Number(e.target.value))} />
                                <span> %</span>
                            </div>
                            <div className={`ihm-line ${highlighted === "water" ? 'highlighted':''}`}>
                                <span>Water : </span>
                                <input type="number" placeholder="0" value={waterLevel} className="color-green"
                                onChange={(e) => handleInputChange("waterLevel",Number(e.target.value))} />
                                <span> L/h</span>
                            </div>
                            <div className={`ihm-line ${highlighted === "dpic" ? 'highlighted':''}`}>
                                <span>DPIC : </span>
                                <input type="number" placeholder="0" value={dpic} className="color-green"
                                onChange={(e) => handleInputChange("dpic",Number(e.target.value))} />
                                <span> mBar</span>
                            </div>

                        </div>
                        <div>
                            
                        <div className={`ihm-line ${highlighted === "lsl1" ? 'highlighted':''}`}>
                            { isLSL1ok ? (<span>LSL1 : OK</span>) : (<span>LSL1 : défaut</span>)}
                        </div>
                        <div className={`ihm-line ${highlighted === "refluxType" ? 'highlighted':''}`}>
                            <span>Taux de reflux</span>
                            <div className="reflux-line">
                                <input type="radio" name="reflux" checked={refluxType == "AUTO"} id="reflux"
                                onChange={(e) => handleInputChange("reflux","AUTO")} />
                                <span> AUTO</span>
                            </div>
                            <div className="reflux-line">
                                <input type="radio" name="reflux" checked={refluxType == "MANU"} id="cycle"
                                onChange={(e) => handleInputChange("reflux","MANU")} />
                                <span> MANU</span>
                            </div>
                            <div className="reflux-line">
                                <input type="number" name="reflux" value={refluxRate} id="cycle"
                                onChange={(e) => handleInputChange("refluxRate",Number(e.target.value))} />
                                <span> %</span>
                            </div>
                        </div>
                            <div className={`ihm-line ${highlighted === "bouilleurStatus" ? 'highlighted':''}`}>
                                <span>Bouilleur : </span>
                                <input type="checkbox" checked={isBouilleurOn}   className="color-red"
                                onChange={(e) => handleInputChange("isBouilleurOn",Number(e.target.checked))} />
                                { isBouilleurOn ? <span> ON</span> : <span> OFF</span>}
                            </div>
                        <div className={`ihm-line ${highlighted === "TT" ? 'highlighted':''}`}>
                            <div>
                                <span>TT2 : {TT2Value}</span>
                            </div>
                            <div>
                                <span>TT3 : {TT3Value}</span>
                            </div>
                            <div>
                                <span>TT4 : {TT4Value}</span>
                            </div>
                            <div>
                                <span>TT5 : {TT5Value}</span>
                            </div>

                        </div>
                        </div>
                    </div>

                </div>
            </div>
        )
        
    }

    return (renderParam())
}

function getMachineParamValue(key:string,machineParameters : MachineParameter[]) : number {
    return machineParameters.find(p => p.key.toLocaleLowerCase().includes(key.toLocaleLowerCase()))?.value as number || 0;
}