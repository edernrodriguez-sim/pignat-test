export class StepValidationPoint {
    label: string;
    expectedValue: string | boolean | number;
    isIHM: boolean= false;

    constructor(label: string, expectedValue: string | boolean | number)
    {
        this.label = label;
        this.expectedValue = expectedValue;
    }
}