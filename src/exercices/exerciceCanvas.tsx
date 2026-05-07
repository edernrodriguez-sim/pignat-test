import {
  DefaultCameraController,
  useCameraEntity,
  Canvas,
  Viewport,
  CameraController,
  LivelinkContext,
} from "@3dverse/livelink-react";
import { useRef, useCallback, useEffect, useState, useContext } from "react";
import React from "react";
import ExerciceUI from "./exerciceUI";
import type { Entity } from "@3dverse/livelink";
import type { Exercise } from "./exercice";
import { useExercise } from "./useExercice";

interface ExerciceCanvasProps {
  exercise: Exercise;
}

// ─── ExerciceCanvas ───────────────────────────────────────────────────────────
// Enfant direct de <Livelink> → a accès à LivelinkContext.
// Contient toute la logique qui dépend de l'instance (init, animations, exercice).

export default function ExerciceCanvas({ exercise }: ExerciceCanvasProps) {
  const [pickedEntity, setPickedEntity] = useState<{ entity: Entity } | null>(null);
  const [pressureValue, setPressureValue] = useState("");
  const cameraControllerRef = useRef<DefaultCameraController>(null);
  const { cameraEntity } = useCameraEntity();

  // ── Instance Livelink ─────────────────────────────────────────────────────
  // Disponible ici car on est sous <Livelink>
  const { instance } = useContext(LivelinkContext);

  useEffect(() => {
    if (!instance) return;
    const init = async () => {
      instance.startSimulation();
    };
    init();
  }, [instance]);

  // ── Hook exercice ─────────────────────────────────────────────────────────
  // instance est passé en param — plus de useContext dans le hook
  const { state, currentStep, onEntityClicked, onInputChange, completeCurrentStep, reset } =
    useExercise(
      exercise,
      {
        onStepComplete:    (step, i) => console.log(`✅ Étape ${i + 1} :`, step.name),
        onExerciseComplete: (ex)    => console.log(`🎉 Terminé :`, ex.name),
      }
    );

  // ── Handler input ─────────────────────────────────────────────────────────

  const handlePressureChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setPressureValue(val);
      onInputChange("pressure-input", val);
    },
    [onInputChange],
  );

  // ── Clic 3D : propager le tag ou le nom de l'entité ──────────────────────

  useEffect(() => {
    if (!pickedEntity?.entity) return;

    const tags: string[] = pickedEntity.entity.tags?.value ?? [];

    if (tags.length > 0) {
      // Priorité au premier tag (ex: "testTag", "Couvercle"…)
      console.log("[pick] tag →", tags[0]);
      onEntityClicked(tags[0]);
    } else {
      // Fallback sur le nom de l'entité
      const name: string =
        (pickedEntity.entity as any).name ??
        (pickedEntity.entity as any).getName?.() ??
        "";
      if (name) {
        console.log("[pick] name →", name);
        onEntityClicked(name);
      }
    }
  }, [pickedEntity, onEntityClicked]);

  // ── Camera controller ─────────────────────────────────────────────────────

  const bindCameraController = useCallback(
    (controller: DefaultCameraController | undefined) => {
      cameraControllerRef.current = controller ?? null;
      if (!controller) return;
      controller.maxDistance   = 10;
      controller.infinityDolly = false;
      controller.dollySpeed    = 0.5;
      controller.lock_pointer  = { aim: "on-drag", on_drag_threshold_in_pixels: 5 };
    },
    [],
  );

  return (
    <Canvas className="w-full h-full">
      <Viewport
        className="w-full h-full"
        cameraEntity={cameraEntity}
        setPickedEntity={setPickedEntity}
      >
        <CameraController ref={bindCameraController} />
        <ExerciceUI
          state={state}
          currentStep={currentStep}
          reset={reset}
          completeCurrentStep={completeCurrentStep}
          pressureValue={pressureValue}
          handlePressureChange={handlePressureChange}
        />
      </Viewport>
    </Canvas>
  );
}