import { useState, useCallback, useRef, useContext } from "react";
import {
  type Exercise,
  type ExerciseStep,
  type ExerciseState,
  type StepStatus,
  type AnimationTrigger,
  type SavedField,
  type TableDatas,
} from "./exercice";
import { AnimationHelper } from "../animationHelper";
import type { Livelink } from "@3dverse/livelink";
import { LivelinkContext } from "@3dverse/livelink-react";
import type { TempTarget } from "../temperatureRandomizer/temperatureSimulator";
import type { MachineParameterUpdate } from "../models/exercices/machineParameterUpdate";

// ─── 3DVerse API shim ─────────────────────────────────────────────────────────
// Adaptez selon votre version de l'API 3DVerse
declare const SDK: {
  getEntityByName: (name: string) => Promise<{ id: string } | null>;
  playAnimation: (entityId: string, animationName: string) => void;
};

let entityLivelink: Livelink | null;


async function playAnimation(trigger: AnimationTrigger) {
  try {
    
    if (!entityLivelink || !trigger.entityId) return;
      
      const root_animations = await entityLivelink.scene.findEntity({ entity_uuid: trigger.entityId, });
    AnimationHelper.launchAnim(root_animations);
  } catch (e) {
    console.warn("[Exercise] Impossible de jouer l'animation :", e);
  }
}

interface UseExerciseOptions {
  onStepComplete?: (step: ExerciseStep, stepIndex: number) => void;
  onExerciseComplete?: (exercise: Exercise) => void;
  launchTemperatureSimulation?: (t:TempTarget[]) => void;
  onParametersChange?: (updated: MachineParameterUpdate[]) => void;
}

export function useExercise(exercise: Exercise, options: UseExerciseOptions = {}, ) {
  const { onStepComplete, onExerciseComplete, onParametersChange } = options;
  const { instance } = useContext(LivelinkContext);
  entityLivelink = instance;
  const [tableDatas, setTableDatas] = useState<TableDatas>();

  const initialStatuses = Object.fromEntries(
    exercise.steps.map((s, i) => [s.id, i === 0 ? "active" : "pending"])
  ) as Record<string, StepStatus>;

  const [state, setState] = useState<ExerciseState>({
    exercise,
    currentStepIndex: 0,
    stepStatuses: initialStatuses,
    isCompleted: false,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // ── Validation interne ────────────────────────────────────────────────────

  const onAnimation = (input: AnimationTrigger) => {
    if (input.vanneKey != null && input.newVanneStatus != null && input.vanneKey.length > 0 )
      onParametersChange?.([{key:input.vanneKey, value: input.newVanneStatus}]) 
  }

  const completeCurrentStep = useCallback(async () => {
    const { currentStepIndex, exercise: ex, isCompleted } = stateRef.current;
    if (isCompleted) return;

    const currentStep = ex.steps[currentStepIndex];
    const isLast = currentStepIndex === ex.steps.length - 1;

    if (currentStep.onCompleteAnimation && currentStep.onCompleteAnimation.length > 0) {
      currentStep.onCompleteAnimation.forEach(async (anim) => {
        await playAnimation(anim);
        onAnimation(anim);
      }
    );
    }

    if (currentStep.startTemperatureOnComplete 
      && currentStep.targetTemperatures
      && options.launchTemperatureSimulation) {
      options.launchTemperatureSimulation(currentStep.targetTemperatures);
    }

    setState((prev) => {
      const nextIndex = isLast ? prev.currentStepIndex : currentStepIndex + 1;
      const newStatuses = { ...prev.stepStatuses };
      newStatuses[currentStep.id] = "completed";
      if (!isLast){
        newStatuses[ex.steps[nextIndex].id] = "active"
        const nextStep = ex.steps[nextIndex];
        if (nextStep.shouldHideTable){
          setTableDatas(undefined);
        }
        else if (ex.steps[nextIndex].tableToShow)
        {
          setTableDatas(ex.steps[nextIndex].tableToShow);
        }
      };
      return { ...prev, currentStepIndex: nextIndex, stepStatuses: newStatuses, isCompleted: isLast };
    });

    onStepComplete?.(currentStep, currentStepIndex);

    if (isLast) {
      if (ex.onCompleteAnimation) await playAnimation(ex.onCompleteAnimation);
      onExerciseComplete?.(ex);
    }
  }, [onStepComplete, onExerciseComplete]);

  // ── Handler clic 3D — appelé depuis ExerciceCanvas ────────────────────────

  const onEntityClicked = useCallback(async (entityName: string) => {
    const { currentStepIndex, exercise: ex, isCompleted } = stateRef.current;
    if (isCompleted) return;
    
    const step = ex.steps[currentStepIndex];
    if (step.action.type !== "click3D") return;
    if (step.action.entityTag !== entityName) return;
    if (step.onActionAnimation && step.onActionAnimation.length > 0){
      step.onActionAnimation.forEach(async (anim) => {
        await playAnimation(anim);
        onAnimation(anim);
      })
    }


    completeCurrentStep();
  }, [completeCurrentStep]);

  // ── Handler input ─────────────────────────────────────────────────────────

  const onInputChange = useCallback(async (updatedFields : SavedField[]) => {
    const { currentStepIndex, exercise: ex, isCompleted } = stateRef.current;
    if (isCompleted) return;
    
    const step = ex.steps[currentStepIndex];
    if (step.action.type !== "inputChange") return;
    if (step.action.expectedFields === undefined || step.action.expectedFields.length <= 0) return;

    // Construire un Map pour accéder aux valeurs soumises en O(1)
    const submittedMap = new Map(updatedFields.map((f) => [f.key, f.value]));
    

    // Pour chaque champ nécessaire à l'exercice, on check s'il y a une valeur équivalente existante et qui a la bonne valeur
    // Tous les champs attendus doivent être présents ET avoir la bonne valeur
    const isValid = step.action.expectedFields.every((f) => {
      const submitted = submittedMap.get(f.key);
      if (submitted === undefined) return false;

      // Priorité à la fourchette si définie
      if (f.min !== undefined || f.max !== undefined) {
        const num = Number(submitted);
        if (isNaN(num)) return false;
        if (f.min !== undefined && num < f.min) return false;
        if (f.max !== undefined && num > f.max) return false;
        return true;
      }

      // Sinon valeur exacte
      return f.value === undefined || String(submitted) === String(f.value);
    });

    if (!isValid) return;
    if (step.onActionAnimation && step.onActionAnimation.length > 0){
      step.onActionAnimation.forEach(async (anim) => {
        await playAnimation(anim);
      })
    };

    completeCurrentStep();
  }, [completeCurrentStep]);

  /**
   * Validation de l'étape en cours dans le cas d'une réponse de type Sorting
   */
  const onSortSubmit = useCallback(async (orderedIds: string[]) => {
    const { currentStepIndex, exercise: ex, isCompleted } = stateRef.current;
    if (isCompleted) return;
    const step = ex.steps[currentStepIndex];
    if (step.action.type !== "sort") return;

    const isValid = step.action.expectedOrder.every(
      (id, i) => id === orderedIds[i]
    );
    if (!isValid) return;
    completeCurrentStep();
  }, [completeCurrentStep]);


  const onQuizSubmit = useCallback(async (selectedIds: string[]) => {
    const { currentStepIndex, exercise: ex, isCompleted } = stateRef.current;
    if (isCompleted) return;
    const step = ex.steps[currentStepIndex];
    if (step.action.type !== "quiz") return;

    const correct = step.action.correctIds;
    const isValid =
      selectedIds.length === correct.length &&
      correct.every((id) => selectedIds.includes(id));

    if (!isValid) return;
    completeCurrentStep();
  }, [completeCurrentStep]);

  /**
   * Validation de l'étape en cours dans le cas d'une réponse de type TrueFalse
   */
  const onTrueFalseSubmit = useCallback(async (answer: boolean) => {
    const { currentStepIndex, exercise: ex, isCompleted } = stateRef.current;
    if (isCompleted) return;
    const step = ex.steps[currentStepIndex];
    if (step.action.type !== "trueFalse") return;

    if (step.action.expectedAnswer != answer) return;
    completeCurrentStep();


  }, [completeCurrentStep]);
  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setState({
      exercise,
      currentStepIndex: 0,
      stepStatuses: Object.fromEntries(
        exercise.steps.map((s, i) => [s.id, i === 0 ? "active" : "pending"])
      ) as Record<string, StepStatus>,
      isCompleted: false,
    });
  }, [exercise]);

  const currentStep = state.exercise.steps[state.currentStepIndex] ?? null;

  return { state, currentStep, onEntityClicked, onInputChange, onSortSubmit, onTrueFalseSubmit, completeCurrentStep, reset, onQuizSubmit, tableDatas };
}