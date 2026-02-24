import { IHMDatas } from "./models/IHMDatas";
import type { IHMDto } from "./models/IHMDto";
import type { MachineParameter } from "./models/machineParameter";

export function IHM({ dto } : {dto: IHMDto}){
    const headKeyword = "head";
    const boilerKeyword = "boiler";
    const feedKeyword = "feed";
    const preHeatingKeyword = "preHeating";
    const waterKeyword = "water";

    const onCrossPressed = () => {
        console.warn("onCrossPressed");
        dto.onClose();
    }



    const renderParam = () => {
        const machineParameters = dto.input as MachineParameter[];
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
            dto.onValueChange?.(label, value);
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
                            <div className={`ihm-line ${dto.highlighted === "bouilleurRate" ? 'highlighted':''}`}>
                                <span>Boiler : </span>
                                <input type="number" placeholder="0" value={dto.bouilleurRate} className="color-red"
                                onChange={(e) => {handleInputChange("bouilleurRate",Number(e.target.value));}} />
                                <span> %</span>
                            </div>
                            <div className={`ihm-line ${dto.highlighted === "feed" ? 'highlighted':''}`}>
                                <span>Feed : </span>
                                <input type="number" placeholder="0" value={dto.p1Value} className="color-red"
                                onChange={(e) => handleInputChange("p1Value",Number(e.target.value))} />
                                <span> %</span>
                            </div>
                            <div className={`ihm-line ${dto.highlighted === "statutP1" ? 'highlighted':''}`}>
                                <span>Statut P1 : </span>
                                <input type="checkbox" checked={dto.isP1On}   className="color-red"
                                onChange={(e) => handleInputChange("isP1On",Number(e.target.checked))} />
                                { dto.isP1On ? <span> ON</span> : <span> OFF</span>}
                            </div>
                            <div className={`ihm-line ${dto.highlighted === "prechauffe" ? 'highlighted':''}`}>
                                <span>Pre Heating : </span>
                                <input type="number" placeholder="0" value={dto.prechauffeValue} className="color-red"
                                onChange={(e) => handleInputChange("prechauffeValue",Number(e.target.value))} />
                                <span> %</span>
                            </div>
                            <div className={`ihm-line ${dto.highlighted === "water" ? 'highlighted':''}`}>
                                <span>Water : </span>
                                <input type="number" placeholder="0" value={dto.waterLevel} className="color-green"
                                onChange={(e) => handleInputChange("waterLevel",Number(e.target.value))} />
                                <span> L/h</span>
                            </div>
                            <div className={`ihm-line ${dto.highlighted === "dpic" ? 'highlighted':''}`}>
                                <span>DPIC : </span>
                                <input type="number" placeholder="0" value={dto.dpic} className="color-green"
                                onChange={(e) => handleInputChange("dpic",Number(e.target.value))} />
                                <span> mBar</span>
                            </div>

                        </div>
                        <div>
                            
                        <div className={`ihm-line ${dto.highlighted === "lsl1" ? 'highlighted':''}`}>
                            { dto.isLSL1ok ? (<span>LSL1 : OK</span>) : (<span>LSL1 : défaut</span>)}
                        </div>
                        <div className={`ihm-line ${dto.highlighted === "refluxType" ? 'highlighted':''}`}>
                            <span>Taux de reflux</span>
                            <div className="reflux-line">
                                <input type="radio" name="reflux" checked={dto.refluxType == "AUTO"} id="reflux"
                                onChange={() => handleInputChange("reflux","AUTO")} />
                                <span> AUTO</span>
                            </div>
                            <div className="reflux-line">
                                <input type="radio" name="reflux" checked={dto.refluxType == "MANU"} id="cycle"
                                onChange={() => handleInputChange("reflux","MANU")} />
                                <span> MANU</span>
                            </div>
                            <div className="reflux-line">
                                <input type="number" name="reflux" value={dto.refluxRate} id="cycle"
                                onChange={(e) => handleInputChange("refluxRate",Number(e.target.value))} />
                                <span> %</span>
                            </div>
                        </div>
                            <div className={`ihm-line ${dto.highlighted === "bouilleurStatus" ? 'highlighted':''}`}>
                                <span>Bouilleur : </span>
                                <input type="checkbox" checked={dto.isBouilleurOn}   className="color-red"
                                onChange={(e) => handleInputChange("isBouilleurOn",Number(e.target.checked))} />
                                { dto.isBouilleurOn ? <span> ON</span> : <span> OFF</span>}
                            </div>
                        <div className={`ihm-line ${dto.highlighted === "TT" ? 'highlighted':''}`}>
                            <div>
                                <span>TT2 : {dto.TT2Value}</span>
                            </div>
                            <div>
                                <span>TT3 : {dto.TT3Value}</span>
                            </div>
                            <div>
                                <span>TT4 : {dto.TT4Value}</span>
                            </div>
                            <div>
                                <span>TT5 : {dto.TT5Value}</span>
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