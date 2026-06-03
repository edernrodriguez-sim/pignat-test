import type { SetStateAction } from "react";
import type { MachineParameter } from "./machineParameter";

// types/IHMData.ts
export interface IHMDto {
    waterLevel: number;
    isP1On: boolean;
    isH1On: boolean;
    p1Value: number;
    isLSL1ok: boolean;
    LSL01: boolean;
    LSL02: boolean;
    refluxType: string;
    refluxRate: number;
    isBouilleurOn: boolean;
    bouilleurRate: number;
    highlighted: string;
    TT1Value: number;
    TT2Value: number;
    TT3Value: number;
    TT4Value: number;
    TT5Value: number;
    FIC02_SP: number;
    prechauffeValue: number;
    dpic: number;
    input:MachineParameter[];
    FIC02_OP_MAN: string;
    onClose: () => void;
    onValueChange: (label: string, value: SetStateAction<number> | SetStateAction<boolean> | SetStateAction<string>) => void;
}