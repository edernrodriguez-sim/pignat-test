import type { Step } from "./step";

export class Exercise {
    public description: string = "";
    public steps: Step[];
    constructor(description: string, steps: Step[]) {
        this.description = description;
        this.steps = steps;
    }
}