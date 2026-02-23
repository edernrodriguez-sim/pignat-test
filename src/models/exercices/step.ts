import type { StepValidationPoint } from "./stepValidationPoint";

export class Step {
    isValidated: boolean = false;
    hint: string = "";
    itemsLabelToGlow: string[] = [];
    stepValidationPoints: StepValidationPoint[] = [];
    action: string | undefined;
    animationNames: string[] = [];
}