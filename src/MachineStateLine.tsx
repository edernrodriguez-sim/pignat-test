import type { MachineStateLineDto } from "./models/machineStateLineDto";

function MachineStateLine({ machineStateLineDto } : { machineStateLineDto :MachineStateLineDto }){

    const handleHover = (label: string, isHovering: boolean) => {
        machineStateLineDto.onHover(label,isHovering);
    };

    const hoverProps = (label: string) => ({
        onMouseEnter: () => handleHover(label, true),
        onMouseLeave: () => handleHover(label, false),
    })

    const param = machineStateLineDto.param;
    const renderParam = () => {
        switch(machineStateLineDto.param.type) {
            // Affichage d'un élément coché ou non
            case "bool":
            case "vanne":
                return (
                    <>
                        <input 
                        id={param.key}
                        type="checkbox"
                        checked={param.value === "true"}
                        /> 

                        <label {...hoverProps(param.key)} htmlFor={param.key}> {param.label}</label>
                    </>
                );
            
            // Affichage d'une valeur simple
            case "value":
                return <label>{param.label} : {param.value}</label>;
            // Affichage d'une valeur avec une unité (ex : °c ou L/h)
            case "unit":
                return <label>{param.label} : {param.value} {param.unitType} </label>;

            default:
                return <label>Mode : {param.value}</label>;
        };
    }            
    
    return (<div>{renderParam()}</div>);
}

export default MachineStateLine;