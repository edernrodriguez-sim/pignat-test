import type { MachineParameter } from "./machineParameter";

// types/IHMData.ts
export interface IHMDto {
    waterLevel: number;
    isP1On: boolean;
    isH1On: boolean;
    p1Value: number;
    isLSL1ok: boolean;
    LSH01: boolean;
    LSH02: boolean;
    LSL01: boolean;
    LSL02: boolean;
    LSL03: boolean;
    LSL04: boolean;
    refluxType: string;
    refluxRate: number;
    isBouilleurOn: boolean;
    bouilleurRate: number;
    highlighted: string;
    TT1Value: number;
    TT01: number;
    TT2Value: number;
    TT02: number;
    TT3Value: number;
    TT03: number;
    TT4Value: number;
    TT04: number;
    TT5Value: number;
    TT05: number;
    FIC02_SP: number;
    FIC02_PV: number;
    prechauffeValue: number;
    dpic: number;
    input:MachineParameter[];
    FIC02_OP_MAN: string;
    onClose: () => void;
}