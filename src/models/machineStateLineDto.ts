import type { MachineParameter } from "./machineParameter";

export interface MachineStateLineDto {
    param: MachineParameter;
    onHover: (key: string, status: boolean) => void;
}