import type { Exercise } from "./exercice";
import type { Step } from "./step";

export class ExerciseManager {
    currentStepIndex: number = -1;
    currentStep: Step |undefined;
    currentExercise: Exercise | undefined;
    
    startExercise(newExercise:Exercise){
        this.currentExercise = newExercise;
        this.currentStepIndex = -1;
        this.nextStep();
    }

    nextStep() : boolean {
        if (this.currentExercise == undefined)
            return false;
        this.currentStepIndex++;
        if (this.currentExercise.steps.length > this.currentStepIndex)
        {
            this.currentStep = this.currentExercise.steps[this.currentStepIndex];
            return true;
        }
        else {
            return false;
        }
    }

    getStepCount(): number | undefined{
        return this.currentExercise?.steps.length;
    }
    getCurrentStepIndex(): number | undefined{
        return this.currentStepIndex + 1;
    }
    getCurrentStepHint() : string | undefined{
        return this.currentStep?.hint;
    }
}