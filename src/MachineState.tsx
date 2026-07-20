import MachineStateLine from "./MachineStateLine";
import type { MachineStateDto } from "./models/machineStateDto";

export function MachineState({machineStateDto} : { machineStateDto: MachineStateDto}){

    const onReadOnlyBtnClick = () => {
        machineStateDto.toggleReadOnly();
    }
    return (
        <>
        <div id="machineStateTitle"  onClick={onReadOnlyBtnClick}  className="titleDiv">
            <b>État de la machine</b>            
        </div>
        <div  className="contentDiv">
        {
            machineStateDto.value.map((param) => (
                <MachineStateLine
                machineStateLineDto={{param:param, onHover:machineStateDto.onHover}}
                key={param.key}
                >

                </MachineStateLine>
            ))
        }
        </div>
        </>
    )
}