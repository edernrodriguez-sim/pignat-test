import { DOM3DOverlay } from "@3dverse/livelink-react";
import BaseInfoPanel from "./BaseInfoPanel";
import type { MachineParameter } from "../models/machineParameter";



/**
 * Affichage des éléments d'UI affichant des infos de la machine
 * @param machineParams Infos de la machine
 * @returns 
 */
function InfoPanels({ machineParams } : { machineParams: MachineParameter[]}){

    /**
     * Retourne le paramètre de machine correspondant à la clé
     * @param key clé du paramètre de la machine
     * @returns paramètre de la machine
     */
    function getMachineParamDataFromKey(key: string){
        if (machineParams.filter(c => c.key === key).length > 0){
            return machineParams.filter(c => c.key === key)[0];
        }
        else
            return null;
    }


    return(
        <DOM3DOverlay>
              {/*TT06*/}
              <BaseInfoPanel
              label="TT06"
              machineParam={getMachineParamDataFromKey("TT06")}
              xPos={-0.45} yPos={2.1} zPos={-0.17}
              anchor="bottom-left"
              />
              {/*TT05*/}
              <BaseInfoPanel
              label="TT05"
              machineParam={getMachineParamDataFromKey("TT05")}
              xPos={0} yPos={1.95}
              zPos={0.045}
              anchor="bottom-left"
              />
              {/*TT04*/}
              <BaseInfoPanel
              label="TT04"
              machineParam={getMachineParamDataFromKey("TT04")}
              xPos={0} yPos={1.75}
              zPos={0.045}
              anchor="bottom-left"
              />
              {/*TT03*/}
              <BaseInfoPanel
              label="TT03"
              machineParam={getMachineParamDataFromKey("TT03")}
              xPos={0} yPos={1.35}
              zPos={0.045}
              anchor="bottom-left"
              />


              {/*TT02*/}
              <BaseInfoPanel
              label="TT02"
              machineParam={getMachineParamDataFromKey("TT02")}
              xPos={0} yPos={0.98}
              zPos={0.045}
              anchor="bottom-left"
              />
              
              {/*TT01*/}
              <BaseInfoPanel
              label="TT01"
              machineParam={getMachineParamDataFromKey("TT01")}
              xPos={0.05} yPos={0.7} zPos={0.045}
              anchor="top-right"
              />

              
              {/*LSL2*/}
              <BaseInfoPanel
              label="LSL02"
              machineParam={getMachineParamDataFromKey("LSL02")}
              xPos={-0.45} yPos={2.1} zPos={-0.17}
              anchor="top-right"
              />    
              {/*LSL1*/}    
              <BaseInfoPanel 
              label="LSL1" 
              machineParam={getMachineParamDataFromKey("LSL01")}
              xPos={-0.25}  yPos={0.9} zPos={0.045}
              anchor="bottom-right"
              />

              {/*DPIC01_PV*/}    
              <BaseInfoPanel 
              label="DPIC01_PV" 
              machineParam={getMachineParamDataFromKey("DPIC01_PV")}
              xPos={0.3}  yPos={2.4} zPos={0}
              width={0.3}
              baseColor="blue"
              anchor="bottom-left"
              />

              {/*FIC02_PV*/}    
              <BaseInfoPanel 
              label="FIC02_PV" 
              machineParam={getMachineParamDataFromKey("FIC02_PV")}
              xPos={0.45}  yPos={1.2} zPos={0.1}
              width={0.28}
              baseColor="blue"
              anchor="bottom-left"
              />

              {/*LSH01*/}    
              <BaseInfoPanel 
              label="LSH01" 
              machineParam={getMachineParamDataFromKey("LSH01")}
              xPos={0.24}  yPos={0.75} zPos={-0.08}
              height={0.09}
              width={0.13}
              anchor="bottom-right"
              _displayLabelOnly={true}
              />
              {/*LSH02*/}    
              <BaseInfoPanel 
              label="LSH02" 
              machineParam={getMachineParamDataFromKey("LSH02")}
              xPos={0.42}  yPos={0.75} zPos={-0.08}
              height={0.09}
              width={0.13}
              anchor="bottom-right"
              _displayLabelOnly={true}
              />

              
              {/*LSL03*/}    
              <BaseInfoPanel 
              label="LSL03" 
              machineParam={getMachineParamDataFromKey("LSL03")}
              xPos={0.15}  yPos={0.43} zPos={-0.08}
              height={0.09}
              width={0.13}
              anchor="bottom-right"
              _displayLabelOnly={true}
              />

              
              {/*LSL04*/}    
              <BaseInfoPanel 
              label="LSL04" 
              machineParam={getMachineParamDataFromKey("LSL04")}
              xPos={0.52}  yPos={0.43} zPos={-0.08}
              height={0.09}
              width={0.13}
              anchor="bottom-right"
              _displayLabelOnly={true}
              />



              </DOM3DOverlay>
    )
}

export default InfoPanels;