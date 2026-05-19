// import type {Livelink as LivelinkInstance} from "@3dverse/livelink";

import {
  Livelink,
  Canvas,
  Viewport,
  CameraController,
  useCameraEntity,
  LivelinkContext,
  useEntity,
  DefaultCameraController
} from "@3dverse/livelink-react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import { type Entity} from "@3dverse/livelink";
import { LoadingOverlay } from "@3dverse/livelink-react-ui";
import "./styles/App.css";
import data from "./assets/machineState.json";
import exercises from "./assets/exercise1.json";
import rulesData from "./assets/rules.json";
import machinePartsJson from "./assets/machineLabelIdMapping.json";
import { RulesSystem, type Rule, type RuleResult } from "./rules/RulesSystem";
import { MachineState } from "./MachineState";
// import { getVannesValues } from "./vanneManager";
import { AnimationHelper, AnimationTypes } from "./animationHelper";
import { Exercise } from "./models/exercices/exercice";
import { Step } from "./models/exercices/step";
import { MachineParameter } from "./models/machineParameter";
import { MachineMapping } from "./machineMapping";
import { ExerciseManager } from "./models/exercices/exerciseManager";
import BasicTextModal from "./modals/basicTextModal";
import type { IHMDto } from "./models/IHMDto";
import type { MachineStateDto } from "./models/machineStateDto";
import { useBehaviourOnAnimationTrigger } from "./hooks/useBehaviourOnAnimationTrigger";
import { useAnimationEntities as fetchAnimationEntities } from "./hooks/useAnimationEntities";
import { LaunchAnimationCompleteContinue } from "./AnimationCompleteContinue";
import { ProjectConstants } from "./projectConstants";
import { LaunchAnimationCompleteDiscontinue } from "./AnimationCompleteDiscontinue";
import QRModal from "./QRModal";
import { useMqttMachineSync} from "./hooks/useMqttMachineSync";
import type { MachineAnimation } from "./models/machineAnimation";
import type { AnimationEntities } from "./models/animations/animationEntities";
import Dropdown from "./ui/Dropdown";
import Avatars from "./avatars/avatars";
import RulesDisplay from "./rules/rulesDisplay";
import InfoPanels from "./InfoPanels/InfoPanels";
import { applyMachineUpdates } from "./animations/animationRunner";
import { IhmModal } from "./ihm/ihmModal";
import type { SchemaOverlay } from "./ihm/ihmViewer";
import { MachineParameterProvider } from "./ihm/machineParameterContext/machineParameterProvider";

// Scene et token publics
const scene_id = "05b63dcd-ce5c-4e8f-b363-89a38118462c";
const token = "public_wfVLwtMF9Rg0rp_k";
const main_trigger_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
let QR_URL = "https://votre-url-ici.com";
// Lecture du json de donnée distante
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
const datasForIHM: MachineParameter[] = data
  .filter((d) => d.showInIHM === true)
  .map(
    (data) =>
      new MachineParameter(
        data.Key,
        data.Label,
        data.Value,
        data.Type,
        data.UnitType,
        data.showInIHM,
      ),
  );
let isSetMachineStateLaunched: boolean = false;
// let isSoutirageOn = false;
let isProjectReadOnly: boolean = false;
//let testUseEffect: boolean = false;
const allMachineAnimations: { [key: string]: MachineAnimation } = {};
const AnimationIdvanneIdMapping: { [key: string]: string } = {};
let exercise: Exercise;
let exerciseManager: ExerciseManager;
let isHintModalVisible: boolean;
let machineLabelIdMapping: MachineMapping;
let appMode: number;
/**
 * Identifiant de la machine à connecter
 */
let machineIdentifier: string = "";

export default function App({
  appModeInput,
  sessionIdV,
  machineId
}: {
  readonly appModeInput: number;
  readonly sessionIdV: string | null;
  readonly machineId: string;
}) {
  appMode = appModeInput;
  machineIdentifier = machineId;
  console.log(`Machine id : ${machineId}`)
  
  if (appMode == ProjectConstants.APP_MODE_EXERCICE) isProjectReadOnly = false;
  // Récupération du mapping des labels et des ids
  machineLabelIdMapping = new MachineMapping(machinePartsJson.machineParts);
  exerciseManager = new ExerciseManager();
  // Mapping des exercices
  exercise = exercises.exercises.map(
    (e) =>
      new Exercise(
        e.description,
        e.steps.map((s) => Object.assign(new Step(), s)),
      ),
  )[0];
if (sessionIdV != null){
  return (
    <Livelink
      sessionId={sessionIdV}
      token={token}
      LoadingPanel={LoadingOverlay}
    >
      <SceneViewer />
    </Livelink>
  );
}
else {
  return (
    <Livelink
      sceneId={scene_id}
      token={token}
      isTransient={true}
      autoJoinExisting={false}
      LoadingPanel={LoadingOverlay}
    >
      <SceneViewer />
    </Livelink>
  );
}
}

function SceneViewer() {
  const [canStartMqtt, setCanStartMqt] = useState(false);
  const cameraControllerRef = useRef<DefaultCameraController>(null);
  const { cameraEntity } = useCameraEntity();
  const [isOpen, setIsOpen] = useState(false);
  const { instance } = useContext(LivelinkContext);
  const [pickedEntity, setPickedEntity] = useState<{ entity: Entity } | null>(
    null,
  );
  const [hoveredEntity, setHoveredEntity] = useState<Entity | null>(null);
  const [machineParams, setMachineParams] = useState(keysFromJson);
  // Récupération des infos mqtt dans la scene
  const {  machineUpdates } = useMqttMachineSync(setMachineParams, canStartMqtt, machineIdentifier);
  const [animationEntities, setAnimationEntities] = useState<AnimationEntities | null>(null);
  const [canShowAnimationButton, setCanShowAnimationButton] = useState(false);
  const [rulesResult, setRulesResult] = useState<RuleResult[]>([]);
  const { entity: dropParent } = useEntity({
    euid: "79235261-a781-4f84-80d1-5689adabdd57",
  });
  useBehaviourOnAnimationTrigger(instance, cameraControllerRef, {
    dropParent,
    bac_de_retention_IN: animationEntities?.bac_de_retention_in ?? null,
    prechauffeur_FILL: animationEntities?.prechauffeur_fill ?? null,
    postPrechauffeurTube1_fill: animationEntities?.postPrechauffeurTube1_fill ?? null,
    goutte_drop: animationEntities?.goutte_drop ?? null,
    soutirage_on: animationEntities?.soutirage_on ?? null,
    soutirage_off: animationEntities?.soutirage_off ?? null,
    V15_1L_fill: animationEntities?.fill_bidon_1L_V15 ?? null,
    soutirage_anim: animationEntities?.goutte_soutirage ?? null,
  });

  // Ferme toutes les vannes en lançant leur animation de fermeture
  const closeAllVannes = useCallback(async () => {
    if(!animationEntities){
      return;
    }
    AnimationHelper.launchAnim(animationEntities.v2_out);
    AnimationHelper.launchAnim(animationEntities.v3_out);
    AnimationHelper.launchAnim(animationEntities.v4_out);
    AnimationHelper.launchAnim(animationEntities.v5_out);
    AnimationHelper.launchAnim(animationEntities.v6_out);
    AnimationHelper.launchAnim(animationEntities.v7_out);
    AnimationHelper.launchAnim(animationEntities.v8_out);
    AnimationHelper.launchAnim(animationEntities.v9_out);
    AnimationHelper.launchAnim(animationEntities.v11_out);
    AnimationHelper.launchAnim(animationEntities.v12_out);
    AnimationHelper.launchAnim(animationEntities.v14_out);
    AnimationHelper.launchAnim(animationEntities.v15_out);
    AnimationHelper.launchAnim(animationEntities.v16_out);

    await new Promise((resolve) => setTimeout(resolve, 50));
  }, [animationEntities]);

  // Ferme toutes les vannes à l'initialisation et à chaque fois que les animations sont récupérées pour éviter les 
  // problèmes d'état incohérent des vannes
  useEffect(() => {
    if(!animationEntities){
      return;
    }
    closeAllVannes();
  }, [animationEntities, closeAllVannes]);

  // Initialisation de la scene, lancement des animations et récupération des infos de la scene
  useEffect(() => {
    if (!instance) {
      return;
    }

    const init = async () => {
      console.log("!!!!!! SceneViewer - init");

      instance.startSimulation();
      
    //   await Promise.all([
    //     fetchAnimations(instance),
    //     fetchVannesAnimations(instance)
    //   ]);

      const entities = await fetchAnimationEntities(instance);
      setAnimationEntities(entities);
      console.log("!!!!!! SceneViewer - init done");
      setCanStartMqt(true);
      setTimeout(() => {
        setCanShowAnimationButton(true);
      }, (1000));
    };
    init();
  }, [instance]);

  // Déclenchement des animations de vannes à chaque mise à jour MQTT
  useEffect(() => {
    
    if (machineUpdates.length === 0) return;

    applyMachineUpdates(machineUpdates, animationEntities);


//     machineUpdates.forEach(({ key, newValue }) => {

//     if (key === "ZS01"){
//       if (newValue){
//           AnimationHelper.launchAnim(animationEntities?.bac_de_retention_in);
//       }
//       else {
//           AnimationHelper.launchAnim(animationEntities?.bac_de_retention_out);
//       }
//     }
//     if (key === "LSH01"){
//       if (newValue){
//           AnimationHelper.closeAnim(animationEntities?.empty_bidon_1L_V12);
//       }
//       else {
//           AnimationHelper.closeAnim(animationEntities?.fill_bidon_1L_V12);
//       }
//     }

    
//     if (key === "LSH02"){
//       if (newValue){
//           AnimationHelper.closeAnim(animationEntities?.empty_bidon_1L_V15);
//       }
//       else {
//           AnimationHelper.closeAnim(animationEntities?.fill_bidon_1L_V15);
//       }
//     }





// if (key === "V2"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v2_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v2_out);
//       }
//       else if (key === "V3"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v3_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v3_out);
//       }
//       else if (key === "V4"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v4_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v4_out);
//       }
//       else if (key === "V5"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v5_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v5_out);
//       }
//       else if (key === "V6"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v6_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v6_out);
//       }
//       else if (key === "V7"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v7_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v7_out);
//       }
//       else if (key === "V8"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v8_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v8_out);
//       }
//       else if (key === "V9"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v9_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v9_out);
//       }
//       else if (key === "V11"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v11_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v11_out);
//       }
//       else if (key === "V12"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v12_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v12_out);
//       }
//       else if (key === "V14"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v14_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v14_out);
//       }
//       else if (key === "V15"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v15_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v15_out);
//       }
//       else if (key === "V16"){
//         if (newValue)
//           AnimationHelper.launchAnim(animationEntities?.v16_in);
//         else
//           AnimationHelper.launchAnim(animationEntities?.v16_out);
//       }
//     });




    // if (vanneUpdates.length === 0) return;
    // vanneUpdates.forEach(({ key, isOpen }) => {
    //   //const fakeParam = { value: isOpen ? true : false } as MachineParameter;

    //   if (key === "V2"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v2_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v2_out);
    //   }
    //   else if (key === "V3"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v3_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v3_out);
    //   }
    //   else if (key === "V4"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v4_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v4_out);
    //   }
    //   else if (key === "V5"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v5_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v5_out);
    //   }
    //   else if (key === "V6"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v6_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v6_out);
    //   }
    //   else if (key === "V7"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v7_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v7_out);
    //   }
    //   else if (key === "V8"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v8_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v8_out);
    //   }
    //   else if (key === "V9"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v9_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v9_out);
    //   }
    //   else if (key === "V11"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v11_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v11_out);
    //   }
    //   else if (key === "V12"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v12_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v12_out);
    //   }
    //   else if (key === "V14"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v14_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v14_out);
    //   }
    //   else if (key === "V15"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v15_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v15_out);
    //   }
    //   else if (key === "V16"){
    //     if (isOpen)
    //       AnimationHelper.launchAnim(animationEntities?.v16_in);
    //     else
    //       AnimationHelper.launchAnim(animationEntities?.v16_out);
    //   }


    //   //launchVanneAnimIfNeeded(fakeParam, key);
    // });

  }, [machineUpdates, machineParams]);

  useEffect(() =>  {

    const ruleSystem = new RulesSystem();
    console.log(rulesResult);
    const result = ruleSystem.testRulesForMachineParameters(rulesData.filter(r => !r.isBlockingForStart) as Rule[], machineParams);
    setRulesResult(result);
    
  }, [machineParams])

  const [isExerciseOnGoing, setIsExerciseOnGoing] = useState(false);
  const [isIHMModalVisible, setIsIHMModalVisible] = useState(false);
  const [refluxType] = useState("");
  const [isBouilleurOn, setIsBouilleurOn] = useState(true);
  const [ihmDto, setIhmDto] = useState<IHMDto>({
    waterLevel: 0,
    isP1On: false,
    isH1On: false,
    p1Value: 0,
    isLSL1ok: false,
    refluxType: "",
    refluxRate: 0,
    isBouilleurOn: false,
    bouilleurRate: 0,
    highlighted: "",
    TT1Value: 0,
    TT2Value: 0,
    TT3Value: 0,
    TT4Value: 0,
    TT5Value: 0,
    prechauffeValue: 0,
    dpic: 0,
    input: datasForIHM,
    onClose: closeIHMModal,
    onValueChange: onIHMInputChange,
  });
  
  const machineStateDto = useMemo<MachineStateDto>(
    () => ({
      isReadOnly: isProjectReadOnly,
      toggleReadOnly: toggleIsReadOnly,
      value: machineParams,
      onHover: onMachineStateHover,
      onMachineElementUpdate: () => {}
    }),
    [machineParams],
  );

  let lastLabelClicked = "";

  const updateIhmDto = (
    key: keyof IHMDto,
    value: number | string | boolean,
  ) => {
    setIhmDto((prev) => ({ ...prev, [key]: value }));
  };
  //#region Recup Anims

  const screenId = machineLabelIdMapping.getIdByLabelIfExists("ecran");
  
  

  const customFireEvent = (eventName: string) => {
    if (instance) {
      instance.scene.fireEvent({
        event_map_id: main_trigger_map_id,
        event_name: eventName,
      });
    }
  };

  //#region Gestion du clique

  // Change le curseur si on survole une entité
  useEffect(() => {
    document.body.style.cursor = hoveredEntity ? "pointer" : "default";
  }, [hoveredEntity]);

  //--------------------------------------------------------------------------
  const onObjectClicked = useCallback(() => {
    if (isProjectReadOnly) return;

    const labelFromId = machineLabelIdMapping.getLabelByIdIfExists(
      pickedEntity!.entity.id,
    );

    
    if (labelFromId?.charAt(0) === 'V'){
      if (labelFromId?.charAt(1) === '2'){
        AnimationHelper.launchAnim(animationEntities?.v2_out);
      }
    }
    if (labelFromId != undefined) {
      lastLabelClicked = labelFromId;
    }

    if (
      pickedEntity!.entity.id === "67778e9e-6860-4ad0-8475-206f84331901"
    ) // V18
    {
      //AnimationHelper.launchAnim(v18Anim_open);
      customFireEvent("V18_clicked");
    }
    console.log("ici");
    console.log(`valeur cliquée : ${pickedEntity!.entity.id} screenId : ${screenId}`);
    if (pickedEntity!.entity.id === screenId) // screen
    {
      setIsIHMModalVisible(true);
    }
    // Gestion au clic sur une vanne
    if (pickedEntity!.entity.id in AnimationIdvanneIdMapping) {
      onVanneClicked();
    }

    if (appMode === ProjectConstants.APP_MODE_MAINTENANCE) {
      setMachineStateDatas();
    }

    if (isExerciseOnGoing) {
      onClickWhileExerciseOnGoing();
    }
  }, [pickedEntity]);

  //--------------------------------------------------------------------------
  // Highlight + déclenchement d'animation au clic
  useEffect(() => {
    if (!instance) return;

    // Highlight visuel
    const entity = pickedEntity?.entity;
    if (entity) {
      const capId = "643bf086-ac9f-4c98-a896-3abb0888aa80";
      if (entity.id === capId) {
        instance.scene.fireEvent({
          event_map_id: main_trigger_map_id,
          event_name: "cap_clicked",
        });
      }

      // Disable entity highlighting (colored outline around the entity mesh)
      // instance.scene.highlightEntities({
      //   entities: [entity],
      // });
      onObjectClicked();
    } else {
      instance.scene.highlightEntities({
        entities: [],
      });
    }
  }, [instance, pickedEntity, onObjectClicked]);

  if (appMode === ProjectConstants.APP_MODE_MAINTENANCE) {
    setMachineStateDatas();
  }

  //#endregion

  function onVanneClicked() {
    const machineParam = machineParams.find(
      (k) => k.key === AnimationIdvanneIdMapping[pickedEntity!.entity.id],
    );
    if (!machineParam) {
      console.warn(
        "Param " +
          AnimationIdvanneIdMapping[pickedEntity!.entity.id] +
          " not found",
      );
      return;
    }
    machineParam.value = machineParam.value === "false" ? "true" : "false";
    setMachineParams([...machineParams]);
  }

  function onMachineStateHover(key: string, status: boolean) {
    if (status)
      AnimationHelper.launchAnim(
        allMachineAnimations[
          AnimationHelper.getAnimationName(key, AnimationTypes.glow)
        ].animationController,
      );
    else {
      AnimationHelper.closeAnim(
        allMachineAnimations[
          AnimationHelper.getAnimationName(key, AnimationTypes.glow)
        ].animationController,
      );
      AnimationHelper.launchAnim(
        allMachineAnimations[
          AnimationHelper.getAnimationName(key, AnimationTypes.stopGlow)
        ].animationController,
      );
    }
  }


  //#endregion

  function closeIHMModal() {
    setIsIHMModalVisible(false);
  }

  function toggleIsReadOnly() {
    isProjectReadOnly = !isProjectReadOnly;
  }

  const resetMachineToStart = useCallback(async () => {
    if(!animationEntities) {
      return;
    }

    console.log("++++ resetMachineToStart ++++");

    await closeAllVannes();

    AnimationHelper.closeAnim(animationEntities.fill_bidon_1L_V12);
    AnimationHelper.closeAnim(animationEntities.fill_bidon_1L_V15);
    AnimationHelper.closeAnim(animationEntities.fill_bidon_10L_V12);
    AnimationHelper.closeAnim(animationEntities.fill_bidon_10L_V15);
    AnimationHelper.closeAnim(animationEntities.soutirage_cycle);

    await new Promise((resolve) => setTimeout(resolve, 50));

    AnimationHelper.launchAnim(animationEntities.goutte_drop_cycle_off);
    AnimationHelper.launchAnim(animationEntities.hide_bells_bulles);
    AnimationHelper.launchAnim(animationEntities.hide_bulles_bouilleur);

    AnimationHelper.launchAnim(animationEntities.bac_de_retention_out);
    AnimationHelper.launchAnim(animationEntities.bidon_10L_V15_out);
    AnimationHelper.launchAnim(animationEntities.bidon_10L_V12_out);
    AnimationHelper.launchAnim(animationEntities.bidon_20L_out);

    await new Promise((resolve) => setTimeout(resolve, 50));
    
    AnimationHelper.closeAnim(animationEntities.bells_on);
    AnimationHelper.closeAnim(animationEntities.fill_bouilleur_continu);
    AnimationHelper.closeAnim(animationEntities.heat_boiler);
    AnimationHelper.closeAnim(animationEntities.screen_glow);

    await new Promise((resolve) => setTimeout(resolve, 50));

    updateIhmDto("isLSL1ok", false);
    updateIhmDto("TT2Value", 0);
    updateIhmDto("TT3Value", 0);
    updateIhmDto("TT4Value", 0);
    updateIhmDto("TT5Value", 0);
    updateIhmDto("bouilleurRate", 0);
    updateIhmDto("refluxRate", 0);
    updateIhmDto("waterLevel", 0);
    updateIhmDto("prechauffeValue", 0);

    //setDpic(0);
    updateIhmDto("isP1On", false);
    setIsBouilleurOn(false);
  }, [animationEntities, updateIhmDto, closeAllVannes]);

  const LaunchAnimationCompleteContinueFromButton = useCallback(async () => {
    if(!animationEntities) {
      return;
    }
    setCanShowAnimationButton(false);
    console.log("++++ LaunchAnimationCompleteContinueFromButton ++++");
    await resetMachineToStart();

    LaunchAnimationCompleteContinue({
      input: {
        animationEntities,
        cameraControllerRef,
        setIsIHMModalVisible,
        updateIhmDto,
      },
    });
  }, [animationEntities, cameraControllerRef, setIsIHMModalVisible, updateIhmDto, resetMachineToStart]);

  const LaunchAnimationCompleteDisContinueFromButton = useCallback(async () => {
    if(!animationEntities) {
      return;
    }
    setCanShowAnimationButton(false);

    await resetMachineToStart();

    LaunchAnimationCompleteDiscontinue({
      input: {
        animationEntities,
        cameraControllerRef,
        setIsIHMModalVisible,
        updateIhmDto,
      },
    });
  }, [animationEntities, cameraControllerRef, setIsIHMModalVisible, updateIhmDto, resetMachineToStart]);

  // async function prepareGlobalAnimationThenStart(){
  //     // 1°) Preparing all the scene
  //     resetMachineToStart();

  //     // 2°) wait before go the 1st camera placement
  //     setTimeout(() => LaunchAnimationCompleteContinue({input: {
  //         animationEntities: animationEntities,
  //         cameraControllerRef: cameraControllerRef,
  //         setIsIHMModalVisible: setIsIHMModalVisible,
  //         updateIhmDto: updateIhmDto

  //     } }),3000);
  //     //moveAndOpenV15();
  // }

  //#region Exercices

  async function startExercise() {
    await resetMachineToStart();
    setIsExerciseOnGoing(true);
    exerciseManager.startExercise(exercise);
    isProjectReadOnly = false;
    glowExerciseItems();
  }

  function showStepHint() {
    isHintModalVisible = true;
  }
  function hideStepHint() {
    isHintModalVisible = false;
  }
  function glowExerciseItems() {
    exerciseManager.currentStep?.itemsLabelToGlow.forEach((key) => {
      AnimationHelper.launchAnim(
        allMachineAnimations[
          AnimationHelper.getAnimationName(key, AnimationTypes.glow)
        ].animationController,
      );
    });
  }

  function stopGlowExerciseItems() {
    console.log("stopGlowExerciseItems");
    exerciseManager.currentStep?.itemsLabelToGlow.forEach((key) => {
      AnimationHelper.closeAnim(
        allMachineAnimations[
          AnimationHelper.getAnimationName(key, AnimationTypes.glow)
        ].animationController,
      );
      if (
        allMachineAnimations[
          AnimationHelper.getAnimationName(key, AnimationTypes.stopGlow)
        ] != undefined
      ) {
        AnimationHelper.launchAnim(
          allMachineAnimations[
            AnimationHelper.getAnimationName(key, AnimationTypes.stopGlow)
          ].animationController,
        );
      }
    });
  }

  function onClickWhileExerciseOnGoing() {
    if (isStepValidated()) {
      onStepValidated();
    }
  }

  function isStepValidated(): boolean {
    let isValidated = true;

    exerciseManager.currentStep?.stepValidationPoints.forEach((s) => {
      if (s.expectedValue === "click") {
        if (lastLabelClicked != s.label) {
          isValidated = false;
        }
      } else if (s.isIHM) {
        isValidated = isValidatedFromIHM(s.label, s.expectedValue);
      } else {
        console.log(keysFromJson);
        const currentValue = keysFromJson.find((k) => k.key === s.label)?.value;
        if (currentValue != s.expectedValue) isValidated = false;
      }
    });

    return isValidated;
  }

  function isValidatedFromIHM(
    label: string,
    expectedValue: string | boolean | number,
  ): boolean {
    switch (label) {
      case "waterlevel":
        return ihmDto.waterLevel == expectedValue;
      case "isP1On":
        return ihmDto.isP1On == expectedValue;
      case "refluxType":
        return refluxType == expectedValue;
      case "refluxRate":
        return ihmDto.refluxRate == expectedValue;
      case "isBouilleurOn":
        return isBouilleurOn == expectedValue;
      case "bouilleurRate":
        return ihmDto.bouilleurRate == expectedValue;
      case "dpic":
        return ihmDto.dpic == expectedValue;
    }
    return false;
  }

  function onStepValidated() {
    if (exerciseManager.currentStep?.action != undefined) {
      if (exerciseManager.currentStep?.action === "move") {
        AnimationHelper.launchAnim(
          allMachineAnimations[
            AnimationHelper.getAnimationName(
              exerciseManager.currentStep?.itemsLabelToGlow[0],
              AnimationTypes.move,
            )
          ].animationController,
        );
      } else if (exerciseManager.currentStep?.action === "animation") {
        exerciseManager.currentStep?.animationNames.forEach((a) => {
          AnimationHelper.launchAnim(
            allMachineAnimations[a].animationController,
          );
        });
      }
    }
    stopGlowExerciseItems();

    const isExerciseOnGoing = exerciseManager.nextStep();
    if (isExerciseOnGoing) {
      glowExerciseItems();
    } else {
      setIsExerciseOnGoing(false);
    }
  }

  function onIHMInputChange(
    label: string,
    value:
      | SetStateAction<number>
      | SetStateAction<boolean>
      | SetStateAction<string>,
  ) {
    console.log(label);
    console.log(value);
    if (isExerciseOnGoing) {
      onClickWhileExerciseOnGoing();
    }
  }

  //#endregion
  
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
    setIsOpen(true);
  }

  //--------------------------------------------------------------------------
  // Camera constraints
  // const MIN_DOLLY_DISTANCE = 0.5;
  const MAX_DOLLY_DISTANCE = 5;
  const ON_DRAG_THRESHOLD_DISTANCE_IN_PX = 5;

  //--------------------------------------------------------------------------
  const bindCameraController = useCallback(
    (controller: DefaultCameraController | undefined) => {
        cameraControllerRef.current = controller ?? null;
        if (!controller){
          return;
        }

        // Keep orbital camera on the upper hemisphere (avoid going under floor).
        // controller.minPolarAngle = -Math.PI / 2;
        // controller.maxPolarAngle = Math.PI  - 0.6;

        // Clamp dolly range.
        // controller.minDistance = MIN_DOLLY_DISTANCE;
        controller.maxDistance = MAX_DOLLY_DISTANCE;
        controller.infinityDolly = false;

        controller.dollySpeed = 0.5;

        controller.lock_pointer = {
            aim: "on-drag",
            on_drag_threshold_in_pixels: ON_DRAG_THRESHOLD_DISTANCE_IN_PX,
        };
    },
    [cameraControllerRef],
  );

  if(!instance) {
    return;
  }

  //----------------------------------------------------------------------------
  //#region VUE
  //----------------------------------------------------------------------------
  const renderUX = () => {
    if(instance == null) {
      return;
    }
    
    return (
      <>
        {/*Panneaux d'infos de la machine dans l'UI*/}
        <InfoPanels machineParams={machineParams} />

        {/*État de la machine*/}
          <div className={`absolute top-[2vh] left-[2vh]`}>
            <MachineState machineStateDto={machineStateDto} />
          </div>
        {/* Erreurs */}
        <RulesDisplay 
          appMode={appMode}
          currentRules={rulesData.filter(r => !r.isBlockingForStart) as Rule[]}
          machineDto={machineStateDto} />

        {isHintModalVisible ? (
          <div className={`absolute bottom-[40vh] right-[92vh]`}>
            <BasicTextModal
              basicTextModalDto={{
                text: exerciseManager.getCurrentStepHint(),
                onBasicModalClose: hideStepHint,
              }}
            />
          </div>
        ) : (
          ""
        )}
        {appMode === ProjectConstants.APP_MODE_EXERCICE &&
          (isExerciseOnGoing ? (
            <div
              id="exercise-UI"
              className={`absolute bottom-[10vh] right-[92vh]`}
            >
              <p>{exerciseManager.currentExercise?.description}</p>
              <p>
                Étape : {exerciseManager.getCurrentStepIndex()} /{" "}
                {exerciseManager.getStepCount()}
              </p>
              <button className="basicBtn" onClick={showStepHint}>
                Indice
              </button>
            </div>
          ) : (
            <div className={`absolute bottom-[10vh] right-[98vh]`}>
              <button id="exerciseBtn" onClick={startExercise}>
                LANCER EXERCICE
              </button>
            </div>
          ))}
        {
            /* Affichage des boutons toujours présents */
            <div className={`absolute yop-[10vh] right-[28vh] top-[3vh]`}>
                <Dropdown onValueSelected={((value) => shareSessionQRCode(value))} />
            </div>
          
        }

        {appMode === ProjectConstants.APP_MODE_ANIMCONTINUE &&
        canShowAnimationButton ? (
          <div className={`absolute bottom-[10vh] right-[42vw]`}>
            <button
              id="exerciseBtn"
              onClick={LaunchAnimationCompleteContinueFromButton}
            >
              LANCER ANIMATION CONTINUE
            </button>
          </div>
        ) : (
          <></>
        )}
        {appMode === ProjectConstants.APP_MODE_ANIMDISCONTINUE &&
        canShowAnimationButton ? (
          <div className={`absolute bottom-[10vh] right-[42vw]`}>
            <button
              id="exerciseBtnn"
              onClick={LaunchAnimationCompleteDisContinueFromButton}
            >
              LANCER ANIMATION DISCONTINUE
            </button>
          </div>
        ) : (
          <></>
        )}
        
        {isOpen && <QRModal url={QR_URL} onClose={() => setIsOpen(false)} />}
      </>
    );
  }

  function onParameterUpdate(newMachineParams : MachineParameter[]){
    setMachineParams(newMachineParams);
    console.log(`Update ${newMachineParams.filter(k => k.key === "TT03")[0].value}`)
    console.log(`Update ${machineParams.filter(k => k.key === "TT03")[0].value}`)
  }



  return (
    <Canvas className="w-full h-full">
      <Viewport
        className="w-full h-full"
        cameraEntity={cameraEntity}
        setPickedEntity={setPickedEntity}
        setHoveredEntity={(data) => setHoveredEntity(data?.entity ?? null)}
      >
        {/* <CameraController preset={CameraControllerPresets.pointer_locked_orbital}/> */}
        <CameraController ref={bindCameraController} />
        <Avatars />
        {renderUX()}

        {/* ── Le Provider entoure TOUT ce qui a besoin des données ───────────────
        Il reçoit :
          - parameters     : le tableau de données actuel
          - onParametersChange : la fonction pour le mettre à jour */}
        <MachineParameterProvider
          parameters={machineParams}
          onParametersChange={onParameterUpdate}  // quand un paramètre est modifié,
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

  //#endregion
}

function setMachineStateDatas() {
  if (isSetMachineStateLaunched === false) {
    isSetMachineStateLaunched = true;
    keysFromJson.forEach((k) => {
      if (k.type === ProjectConstants.UNITTYPE_VANNE) {
        // launchVanneAnimIfNeeded(k, k.key);
      }
    });
  }
  //testRules();
}


// Quand on clique sur n’importe quel objet, on lance l’animation
// if (pickedEntity/* && animationEntity*/) {
//     console.log("🎯 Objet cliqué :", pickedEntity);
//     //console.log("🎯 complete_flow cliqué :", complete_anim_flow_script);
//     //console.log("🎬 Entité d'animation :", animationEntityUUID);

//     const capId = "643bf086-ac9f-4c98-a896-3abb0888aa80";
//     if (pickedEntity.id === capId)
//     {
//         console.log("Clicked on right bonbonne");
//         instance.scene.fireEvent({
//             event_map_id: main_trigger_map_id,
//             event_name: "cap_clicked"
//         });
//     }

//     // Click sur V4
//     if (pickedEntity.id === "31a02337-5eff-49c7-a6fa-87b6d0ec8472"){

//         console.log("Clicked on V4");
//         if (V2_status === true){
//             const controller = (v4Anim_open as any).animation_sequence_controller;
//             controller.playState = 1;
//             V2_status = false;
//         }
//         else {
//             const controller = (v4Anim_close as any).animation_sequence_controller;
//             controller.playState = 1;
//             V2_status = true;
//         }
//         // instance.scene.fireEvent({
//         //     event_map_id: main_trigger_map_id,
//         //     event_name: "cap_clicked"
//         // });
//     }

//     /*const controller = (animationEntity as any).animation_sequence_controller;

//     if (controller) {
//         controller.playState = 1; // 1 = Play, 0 = Pause
//         console.log("✅ Animation lancée !");
//     } else {
//         console.warn("⚠️ L'entité d'animation n'a pas de animation_sequence_controller !");
//     }*/
// }

// let keysIntersect: MachineParameter[];
// keysIntersect = [];
// // Pour chaque clé locale
// allMachineKeys.forEach(k => {
//     // Si lien trouvé on l'affiche
//     if (keysFromJson.filter(j => j.key === k).length > 0){
//         keysIntersect.push(keysFromJson.filter(j => j.key === k)[0])
//     }
// })

// ]);
// const boilerLabelUUID = "edc9c2c0-5c7a-4216-9b3e-b963568521b4";
// // 👉 UUID de l'entité qui contient le contrôleur d'animation
// const animationEntityUUID = "7ea767d9-408c-41a2-b31a-7f259e8135c8";

//  const { entity: labelEntity } = useEntity({
//     euid: boilerLabelUUID,
// });

// // On récupère cette entité via useEntity
// const { entity: animationEntity } = useEntity({
//     euid: animationEntityUUID,
// });

// const { entity: complete_anim_flow_script } = useEntity({
//     euid: "86e63a74-e492-4ca0-b264-71f003c64d53"
// });
