import { useMemo, useState } from "react";
import { ProjectConstants } from "../projectConstants";
import { LaunchType, RulesSystem, type Rule, type RuleResult } from "./RulesSystem";
import type { MachineStateDto } from "../models/machineStateDto";
import CustomDropdown from "../ui/ProcessTypeDropdown";

const rulesSystem = new RulesSystem();
let isRuleShowed : boolean = true;

function RulesDisplay({appMode, currentRules, machineDto} : {
        appMode: number,
        currentRules: Rule[],
        machineDto: MachineStateDto
    }) {
    const [launchTypeFilter, setLaunchTypeFilter] = useState(LaunchType.All);
    // Se recalcule automatiquement quand machineDatas ou currentRules changent
    const rulesResult = useMemo<RuleResult[]>(() => {
        return rulesSystem.testRulesForMachineParameters(currentRules, machineDto.value);
    }, [machineDto, currentRules]);

    const failedRules = useMemo(
        () => rulesResult.filter(r => r.result === "Echec"),
        [rulesResult]
    );
    
    console.log(`failedRules.length : ${failedRules.length}`)
    console.log(`appMode : ${appMode}`)
    if (![ProjectConstants.APP_MODE_MAINTENANCE,ProjectConstants.APP_MODE_EXERCICE].includes(appMode) || failedRules.length === 0)
    {
        return null;
    }

    return (
        <div id="rulesDisplay" className={`absolute top-[10vh] right-[2vh]`}>
            {/* Au clic sur la div on affiche ou masque les règles*/}
            <div className={`ruleTitleDiv ${isRuleShowed ? '':'ruleCompleteBorderRadius'}`}
             onClick={() => isRuleShowed = !isRuleShowed}
             >
                <div>
                    { failedRules.length > 1 && (<b>Erreurs ({failedRules.length}) :</b>)}
                    { failedRules.length == 1 && (<b>Erreur :</b>)}
                </div>
                
                    {/* Dropdown filter permettant de filtrer les erreurs selon le mode (continu, discontinu, ...)*/}
                    {isRuleShowed && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <CustomDropdown 
                                onValueSelected={((value) => {setLaunchTypeFilter(value)})}/>
                        </div>
                    )}
                
            </div>
            {/* Partie masquée au clic sur la div titre */}
            {isRuleShowed && (

                <div id="errorDiv" className="ruleContentDiv">
                    {/* Affichage des erreurs en fonction du filtre */}
                    {failedRules.filter(f => f.launchType.includes(launchTypeFilter) || launchTypeFilter == LaunchType.All).map((r) => (
                        
                            <div
                            //onClick={revealErrors}
                            onPointerLeave={() => {
                                //launchValveErrors(false);
                            }}
                            onPointerOverCapture={() => {
                                //launchValveErrors(true);
                            }}
                            >
                            <p><b>{r.name}</b></p>
                            {/* <p>État : <b>{r.result}</b></p> */}
                            <p>{r.errorMessage}</p>
                            <hr />
                            </div>
                    ))}
                </div>

            )}
        </div>
    );
}

export default RulesDisplay;