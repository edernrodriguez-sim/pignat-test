import type { MachineParameter } from "./machineParameter";

export interface MachineStateDto {
    value: MachineParameter[];
    onHover: (key: string, status: boolean) => void;
    isReadOnly: boolean;
    toggleReadOnly: () => void;
}