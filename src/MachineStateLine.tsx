import { useEffect, useRef, useState } from "react";
import type { MachineStateLineDto } from "./models/machineStateLineDto";

function MachineStateLine({ machineStateLineDto } : { machineStateLineDto: MachineStateLineDto }) {
    const [isUpdated, setIsUpdated] = useState(false);
    const prevValueRef = useRef(machineStateLineDto.param.value);

    useEffect(() => {
        if (prevValueRef.current !== machineStateLineDto.param.value) {
            prevValueRef.current = machineStateLineDto.param.value;
            setIsUpdated(true);
            const timer = setTimeout(() => setIsUpdated(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [machineStateLineDto.param.value]);

    const handleHover = (label: string, isHovering: boolean) => {
        machineStateLineDto.onHover(label, isHovering);
    };

    const hoverProps = (label: string) => ({
        onMouseEnter: () => handleHover(label, true),
        onMouseLeave: () => handleHover(label, false),
    });

    const param = machineStateLineDto.param;
    const renderParam = () => {
        switch (machineStateLineDto.param.type) {
            case "bool":
            case "vanne":
                return (
                    <>
                        <input
                            id={param.key}
                            type="checkbox"
                            checked={param.value === true || param.value === "true"}
                            readOnly
                        />
                        <label {...hoverProps(param.key)} htmlFor={param.key}> {param.label}</label>
                    </>
                );
            case "value":
                return <label>{param.label} : {param.value}</label>;
            case "unit":
                return <label>{param.label} : {param.value} {param.unitType}</label>;
            default:
                return <label>Mode : {param.value}</label>;
        }
    };

    return (
        <div className={isUpdated ? "param-line param-updated" : "param-line"}>
            {renderParam()}
        </div>
    );
}

export default MachineStateLine;
