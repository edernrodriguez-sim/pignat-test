import MachineStateLine from "./MachineStateLine";

export function MachineState({value, onHover, isReadOnly, toggleReadOnly}){

    const onReadOnlyBtnClick = () => {
        toggleReadOnly();
    }
    return (
        <>
        <div id="machineStateTitle"  onClick={onReadOnlyBtnClick}  className="titleDiv">
            <b>État de la machine</b>
            {
                isReadOnly ? 
                (<button id="readOnlyBtnOn" className="readOnlyBtn">Lecture seule</button>)
                :
                (<button id="readOnlyBtnOff" className="readOnlyBtn">Modifiable</button>)
            }
            
        </div>
        <div  className="contentDiv">
        {
            value.map((param) => (
                <MachineStateLine
                param={param}
                onHover={onHover}
                key={param.key}>
                </MachineStateLine>
            ))
        }
        </div>
        </>
    )
}