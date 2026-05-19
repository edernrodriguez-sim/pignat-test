import {
  DefaultCameraController,
  useCameraEntity,
  Canvas,
  Viewport,
  CameraController,
  LivelinkContext,
} from "@3dverse/livelink-react";
import { useRef, useCallback, useEffect, useState, useContext, useMemo } from "react";
import ExerciceUI from "./exerciceUI";
import type { Entity } from "@3dverse/livelink";
import type { Exercise } from "./exercice";
import { useExercise } from "./useExercice";
import { ProjectConstants } from "../projectConstants";
import InfoPanels from "../InfoPanels/InfoPanels";
import QRModal from "../QRModal";
import RulesDisplay from "../rules/rulesDisplay";
import type { Rule } from "../rules/RulesSystem";
import Dropdown from "../ui/Dropdown";
import type { MachineStateDto } from "../models/machineStateDto";
import rulesData from "../assets/rules.json";
import data from "../assets/machineState.json";
import { MachineParameter } from "../models/machineParameter";
import { IhmModal } from "../ihm/ihmModal";
import { MachineParameterProvider } from "../ihm/machineParameterContext/machineParameterProvider";
import UseTemperatureSimulation, { type TempTarget } from "../temperatureRandomizer/temperatureSimulator";

interface ExerciceCanvasProps {
  exercise: Exercise;
}

let QR_URL = "https://votre-url-ici.com";
// ─── ExerciceCanvas ───────────────────────────────────────────────────────────
// Enfant direct de <Livelink> → a accès à LivelinkContext.
// Contient toute la logique qui dépend de l'instance (init, animations, exercice).

export default function ExerciceCanvas({ exercise }: ExerciceCanvasProps) {
  const [pickedEntity, setPickedEntity] = useState<{ entity: Entity } | null>(null);
  const [canShowForceTemperature, setCanShowForceTemperature] = useState(false);
  const [isIHMModalVisible, setIsIHMModalVisible] = useState(false);
  const cameraControllerRef = useRef<DefaultCameraController>(null);
  const { cameraEntity } = useCameraEntity();
  const keysFromJson: MachineParameter[] = data.map(
    (data) =>
      new MachineParameter(
        data.Key,
        data.Label,
        data.Value,
        data.Type,
        data.UnitType,
        data.showInIHM,
        data.satisfyingValue
      ),
  );
  const [machineParams, setMachineParams] = useState(keysFromJson);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);





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

  function updateParameter(updated: MachineParameter[]){
    let newMachine = machineParams;
    updated.forEach(u => 
      
      {
        console.log(`updateParameter : key ${u.key} / value : ${u.value}`)
        
        newMachine = newMachine.map((p) =>
          p.key === u.key ? { ...p, value: u.value  } : p
        );

      });
      console.log(machineParams);
      setMachineParams(newMachine);

  }

  /** Permet le lancement d'une simulation de temperature si besoin dans l'exercice */
  const { startTransitions, completeAll } = UseTemperatureSimulation({
    onParametersChange: (updated) => {
    setMachineParams((prev) => {          // ← prev toujours à jour
      let result = prev;
      updated.forEach((u) => {
        result = result.map((p) =>
          p.key === u.key ? { ...p, value: u.value } : p
        );
      });
      return result;
    });
  },
    onTargetReached: (id, val) => {
    setCanShowForceTemperature(false);
      console.log(`✅ ${id} a atteint ${val}`);
    },
    onAllComplete: () => {
    setCanShowForceTemperature(false);
      console.log("🎉 Toutes les transitions sont terminées");
    },
  }, machineParams);
  const onLaunchTemperatureSimulation = useCallback((t: TempTarget[]) => {
    setCanShowForceTemperature(true);
    startTransitions(machineParams, t);


  }, [startTransitions, machineParams]);

  const forceEndTemperatureSimulation = () => {
    setCanShowForceTemperature(false);
    completeAll();
  }

  // ── Hook exercice ─────────────────────────────────────────────────────────
  // instance est passé en param — plus de useContext dans le hook
  const { state, currentStep, onEntityClicked, onInputChange, completeCurrentStep, reset } =
    useExercise(
      exercise,
      {
        onStepComplete:    (step, i) => console.log(`✅ Étape ${i + 1} :`, step.name),
        onExerciseComplete: (ex)    => console.log(`🎉 Terminé :`, ex.name),
        launchTemperatureSimulation: onLaunchTemperatureSimulation
      }
    );

  // ── Handler input ─────────────────────────────────────────────────────────

  const handleCustomAnswer = useCallback(
    (key: string, value: string) => {      
      // let newMachine = machineParams.map((p) =>
      //   p.key === key ? { ...p, value: value } : p
      // );
      // setMachineParams(newMachine);
      // console.log(newMachine);
      console.log(`handleCustomAnswer : key: ${key} |||| value : ${value}`)
      console.log(machineParams);
      onInputChange(key, value);
    },
    [onInputChange],
  );

  // ── Clic 3D : propager le tag ou le nom de l'entité ──────────────────────

  useEffect(() => {
    if (!pickedEntity?.entity || isIHMModalVisible) return;
    
    // affichage de l'ihm au clic sur l'écran
    if (pickedEntity!.entity.id === "8633ab5a-e58b-432a-a4f8-1e11994959c7") // screen
    {
      setIsIHMModalVisible(true);
      return;
    }


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

  
  const machineStateDto = useMemo<MachineStateDto>(
    () => ({
      isReadOnly: false,
      toggleReadOnly: () => {},
      value: machineParams,
      onHover:  () => {},
      onMachineElementUpdate: () => {}
    }),
    [machineParams],
  );
  const renderUX = () => {
    return (
      <>
        {/*Panneaux d'infos de la machine dans l'UI*/}
        <InfoPanels machineParams={machineParams} />

        {/*État de la machine*/}
          {/* <div className={`absolute top-[3vh] left-[2vh]`}>
            <MachineState machineStateDto={machineStateDto} />
          </div> */}
        {/* Erreurs */}
        <RulesDisplay 
          appMode={2}
          currentRules={rulesData.filter(r => !r.isBlockingForStart) as Rule[]}
          machineDto={machineStateDto} />
          
        {
          /* Affichage des boutons toujours présents */
          <div className={`absolute right-[28vh] top-[3vh]`}>
              <Dropdown onValueSelected={((value) => shareSessionQRCode(value))} />
          </div>
          
        }
        {canShowForceTemperature && 
          <div onClick={forceEndTemperatureSimulation} className={`absolute right-[40vw] bottom-[3vh] bg-gray-100 rounded-lg shadow-2xl p-4 place-content-center`}>
            <button>Terminer la simulation des températures</button>
          </div>
        }
        {isQRCodeModalOpen && <QRModal url={QR_URL} onClose={() => setIsQRCodeModalOpen(false)} />}
      </>
    );
  }
  
   
 

  function shareSessionQRCode(shareSessionType: string) {
    // Création de l'url de base utilisable pour un spectateur actif
    QR_URL =
      window.location.origin +
      import.meta.env.BASE_URL +
      "?idsession=" + instance!.session.session_id.toString();
      // Ajout des éléments pour un spectateur passif
      if (shareSessionType === ProjectConstants.SHARE_TYPE_PASSIVE) {
        
        QR_URL += 
        "&idclient=" +
        instance!.session.client_id +
        "&idcamera=" +
        cameraEntity?.id;
      }

    console.log(QR_URL);
    setIsQRCodeModalOpen(true);
  }

  // ── Callback de connexion : appelé par le Provider à chaque confirmation ──
  //
  // parameterId  = l'id du MachineParameter modifié  (ex: "temperature")
  // newValue     = la nouvelle valeur en string       (ex: "87")
  //
  // onInputChange attend (fieldId, value) — les deux correspondent directement
  // si vous avez choisi le même identifiant pour fieldId et parameterId.
 
  const handleParameterSaved = useCallback(
    (parameterId: string, newValue: string | number | boolean) => {
      // let newMachine = machineParams.map((p) =>
      //   p.key === parameterId ? { ...p, value: newValue } as MachineParameter : p
      // );

      setMachineParams((prev) => 
        prev.map((p) => 
          p.key === parameterId ? { ...p, value: newValue } as MachineParameter : p
        )
      );
      


      console.log(`handleParameterSaved : paramId : ${parameterId} / ${newValue}`)
      console.log("machineParams1");
      console.log(machineParams);
      onInputChange(parameterId, newValue);
      console.log("machineParams2");
      console.log(machineParams);
    },
    [onInputChange],
  );
useEffect(() => {
  console.log("machineParams mis à jour :", machineParams);
}, [machineParams]); // ← s'exécute APRÈS chaque re-render avec la nouvelle valeur

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
          handleCustomAnswer={handleCustomAnswer}
        />
        {renderUX()}
        {/* ── Le Provider entoure TOUT ce qui a besoin des données ───────────────
        Il reçoit :
          - parameters     : le tableau de données actuel
          - onParametersChange : la fonction pour le mettre à jour 
          - onParameterSaved : la fonction pour notifier l'élément qui a été mis à jour et sa valeur*/}
        <MachineParameterProvider
          parameters={machineParams}
          onParametersChange={setMachineParams}  // quand un paramètre est modifié,
          onParameterSaved={handleParameterSaved}
        >     
        {
          isIHMModalVisible && (
            <div id="ihm" className={`relative inline-block w-full select-none`} >
              <IhmModal
              // overlays={overlays}
              datas={machineParams}
              callClose={() => setIsIHMModalVisible(false) }
                />
            </div>
          )
        }
      </MachineParameterProvider>
      </Viewport>
    </Canvas>
  );
}

