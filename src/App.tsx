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
} from "react";
import { type Entity} from "@3dverse/livelink";
import { LoadingOverlay } from "@3dverse/livelink-react-ui";
import "./styles/App.css";
import data from "./assets/machineState.json";
import rulesData from "./assets/rules.json";
import machinePartsJson from "./assets/machineLabelIdMapping.json";
import { RulesSystem, type Rule, type RuleResult } from "./rules/RulesSystem";
import { MachineState } from "./MachineState";
import { AnimationHelper, AnimationTypes } from "./animationHelper";
import { MachineParameter } from "./models/machineParameter";
import { MachineMapping } from "./machineMapping";
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
import { MachineParameterProvider } from "./ihm/machineParameterContext/machineParameterProvider";
import type { SavedField } from "./exercices/exercice";

// Scene et token publics
const scene_id = "05b63dcd-ce5c-4e8f-b363-89a38118462c";
const token = "public_wfVLwtMF9Rg0rp_k";
const main_trigger_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
let QR_URL = "https://mon-url-ici.com";
// Lecture du json de donnée distante
const keysFromJson: MachineParameter[] = data.map(
  (data) =>
    new MachineParameter(
      data.Key,
      data.Label,
      data.Value,
      data.Description,
      data.Type,
      data.UnitType,
      data.showInIHM,
      data.satisfyingValue
    ),
);
let isSetMachineStateLaunched: boolean = false;
// let isSoutirageOn = false;
let isProjectReadOnly: boolean = false;
//let testUseEffect: boolean = false;
const allMachineAnimations: { [key: string]: MachineAnimation } = {};
const AnimationIdvanneIdMapping: { [key: string]: string } = {};
let machineLabelIdMapping: MachineMapping;
let appMode: number;
/**
 * Identifiant de la machine à connecter
 */
let machineIdentifier: number = 0;

export default function App({
  appModeInput,
  sessionIdV,
  machineId,
  username
}: {
  readonly appModeInput: number;
  readonly sessionIdV: string | null;
  readonly machineId: number;
  readonly username?: string;
}) {
  appMode = appModeInput;
  machineIdentifier = machineId;
  
  if (appMode == ProjectConstants.APP_MODE_EXERCICE) isProjectReadOnly = false;
  // Récupération du mapping des labels et des ids
  machineLabelIdMapping = new MachineMapping(machinePartsJson.machineParts);
  SetDefaultN_Serie(machineId);

if (sessionIdV != null){

  return (
    <Livelink
      sessionId={sessionIdV}
      token={token}
      LoadingPanel={LoadingOverlay}
    >
      <SceneViewer username={username} />
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

function SetDefaultN_Serie(defaultN_Serie: number){
  let nSerieKey = keysFromJson.find(k => k.key === ProjectConstants.MACHINE_PARAM_N_SERIE_KEY);
  if (nSerieKey){
    keysFromJson.filter(k => k.key === ProjectConstants.MACHINE_PARAM_N_SERIE_KEY)[0].value = defaultN_Serie;
  }
}

function SceneViewer({username} : {username?: string}) {
  const [canStartMqtt, setCanStartMqt] = useState(false);
  const cameraControllerRef = useRef<DefaultCameraController>(null);
  const { instance } = useContext(LivelinkContext);
  // Ajout de l'identifiant utilisateur sur camera pour identifier les users dans la scène
  const customUserName = username ?? "_MainUser";
  const { cameraEntity } = useCameraEntity({name:instance?.session.client_id!+"_"+customUserName});
  const [isOpen, setIsOpen] = useState(false);
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
    bouilleur_fill_continu: animationEntities?.fill_bouilleur_continu ?? null,
    postPrechauffeurTube1_fill: animationEntities?.postPrechauffeurTube1_fill ?? null,
    goutte_drop: animationEntities?.goutte_drop ?? null,
    soutirage_on: animationEntities?.soutirage_on ?? null,
    soutirage_off: animationEntities?.soutirage_off ?? null,
    V12_1L_fill: animationEntities?.Remplissage_Recette_Residu ?? null,
    V12_1L_emptying: animationEntities?.empty_bidon_1L_V12 ?? null,
    V15_1L_fill: animationEntities?.fill_bidon_1L_V15 ?? null,
    V15_1L_emptying: animationEntities?.empty_bidon_1L_V15 ?? null,
    soutirage_anim: animationEntities?.goutte_soutirage ?? null,
    show_bells_bulles_one_by_one: animationEntities?.show_bells_bulles_one_by_one ?? null,
    },
  updateMachineParam
  );


   function updateMachineParam(key : string, value: string | number | boolean) {
    console.log("updateMachineParam");
    setMachineParams((prev) => {          // ← prev toujours à jour
      let result = prev;
      result = result.map((p) =>
        p.key === key ? { ...p, value: value } as MachineParameter : p
      );
      return result;
    });
    console.log("machineParams");
    console.log(machineParams);
  }
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

  }, [machineUpdates, machineParams]);

  useEffect(() =>  {

    const ruleSystem = new RulesSystem();
    console.log(rulesResult);
    const result = ruleSystem.testRulesForMachineParameters(rulesData.filter(r => !r.isBlockingForStart) as Rule[], machineParams);
    setRulesResult(result);
    
  }, [machineParams])

  const [isIHMModalVisible, setIsIHMModalVisible] = useState(false);
  
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

  const updateIhmDto = (
    key: keyof IHMDto,
    value: number | string | boolean,
  ) => {
    
    setMachineParams((prev) => prev.map(
      (p) => p.key === key ? {...p, value: value} as MachineParameter : p
    ));

  };

  const updateNewIhm = (id: string, isClick: boolean, value?: string) => {
    const element = document.getElementById(id);
    
    if (isClick)
    {
      const clickElement= element as HTMLButtonElement;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLButtonElement.prototype, "value")?.set;
      nativeInputValueSetter?.call(clickElement, true);
      clickElement.dispatchEvent(new Event("click", { bubbles: true }));
    }
    else if (value != undefined) {
      const inputElement= element as HTMLInputElement; 

      // Modifier la valeur via le setter natif (contourne React)
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

        // Convertir en number si l'input est de type number
    const parsedValue = inputElement.type === "number" ? Number(value) : value;
    
      nativeInputValueSetter?.call(inputElement, parsedValue);

      // Déclencher l'événement pour que React réagisse
      inputElement.dispatchEvent(new Event("input", { bubbles: true }));
    }
    else {
      
      const inputElement= element as HTMLInputElement;
      inputElement.focus();
    }
  }
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
  async function testAnim(){
    // const root_animations =  await instance!.scene.findEntity({ entity_uuid: "930d5a8f-416d-4680-b351-d3c06d055cd4", linkage: [
    //     "f5305415-6c87-4ef9-b8e6-e5955739147b",
    //     "98023327-2c90-4bd7-ba83-80108a54ec5e"
    //   ] });
    const root_animations = await instance!.scene.findEntity({ entity_uuid: "b70320a1-8009-4aff-88fc-27da9777e612"});
      AnimationHelper.launchAnim(root_animations);

  }
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

     if (
      pickedEntity!.entity.id === "5dc3121e-6264-45b5-ba2b-29b20470ef7d"
    ) // V16
    {
      console.log("ICI");
      testAnim();
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

  function toggleIsReadOnly() {
    isProjectReadOnly = !isProjectReadOnly;
  }

  const resetMachineToStart = useCallback(async () => {
    if(!animationEntities) {
      return;
    }

    console.log("++++ resetMachineToStart ++++");

    await closeAllVannes();

    AnimationHelper.closeAnim(animationEntities.Remplissage_Recette_Residu);
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

    setTimeout(() => updateIhmDto("isLSL1ok", false),5000);
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
        updateNewIhm
      },
    });
  }, [animationEntities, cameraControllerRef, setIsIHMModalVisible, updateIhmDto,updateNewIhm, resetMachineToStart]);

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
        updateNewIhm
      },
    });
  }, [animationEntities, cameraControllerRef, setIsIHMModalVisible, updateIhmDto, resetMachineToStart]);

  
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
        {
          appMode === ProjectConstants.APP_MODE_EXERCICE || appMode === ProjectConstants.APP_MODE_MAINTENANCE && (
              
            <div className={`absolute top-[10vh] left-[2vh]`}>
              <MachineState machineStateDto={machineStateDto} />
            </div>
          )
        }
        {/* Erreurs */}
        <RulesDisplay 
          appMode={appMode}
          currentRules={rulesData.filter(r => !r.isBlockingForStart) as Rule[]}
          machineDto={machineStateDto} />

        
        {
            /* Affichage des boutons toujours présents */
            <div className={`absolute yop-[10vh] right-[28vh] top-[3vh]`}>
                <Dropdown onValueSelected={((value) => shareSessionQRCode(value))} />
            </div>
          
        }

        {appMode === ProjectConstants.APP_MODE_ANIMCONTINUE &&
        canShowAnimationButton ? (
          <div className={`absolute bottom-[10vh] right-[42vw] `}>
            <button
              id="exerciseBtn"
              className="animationButton"
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
              id="exerciseBtn"
              className="animationButton"
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
  
  function onParameterSaved(newMachineParams : SavedField[]){
      console.log("onParameterSaved");
      console.log(newMachineParams);
      setMachineParams((prev) => 
        prev.map((p) => 
          newMachineParams.find(f => f.key === p.key) ? { ...p, value: newMachineParams.find(f => f.key === p.key)?.value } as MachineParameter : p
        )
      );
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
          onParameterSaved={onParameterSaved}
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
}


