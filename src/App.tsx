import {
    Livelink,
    Canvas,
    Viewport,
    CameraController,
    useCameraEntity,
    LivelinkContext,
    useEntity,
    DOM3DOverlay,
    useEntities,
    DOMEntity,
    DefaultCameraController,
    // useEntities
} from "@3dverse/livelink-react";
import { useCallback, useContext, useEffect, useRef, useState, type SetStateAction } from "react";
import { type Entity, type Quat,  type Vec3 } from "@3dverse/livelink";
import { LoadingOverlay } from "@3dverse/livelink-react-ui";
import "./styles/App.css";
import data from "./assets/machineState.json";
import exercises from "./assets/exercise1.json";
import rulesData from "./assets/rules.json";
import machinePartsJson from "./assets/machineLabelIdMapping.json";
import { RulesSystem, type Rule, type RuleResult } from "./RulesSystem";
import { MachineState } from "./MachineState";
import { IHM } from "./IHM";
import { getVannesValues } from "./vanneManager";
import { AnimationHelper, AnimationTypes } from "./animationHelper";
import { Exercise } from "./models/exercices/exercice";
import { Step } from "./models/exercices/step";
import { MachineParameter } from "./models/machineParameter";
import type { MachineAnimation } from "./models/machineAnimation";
import { MachineMapping } from "./machineMapping";
import { ExerciseManager } from "./models/exercices/exerciseManager";
import BasicTextModal from "./modals/basicTextModal";
import type { IHMDto } from "./models/IHMDto";
import type { MachineStateDto } from "./models/machineStateDto";
import { useBehaviourOnAnimationTrigger } from "./hooks/useBehaviourOnAnimationTrigger";
import { useAnimationEntities } from "./hooks/useAnimationEntities";
import { LaunchAnimationCompleteContinue } from "./AnimationCompleteContinue";
import { ProjectConstants } from "./projectConstants";
import { LaunchAnimationCompleteDiscontinue } from "./AnimationCompleteDiscontinue";
// import QRModal from "./QRModal";
// Scene et token publics
const scene_id = "05b63dcd-ce5c-4e8f-b363-89a38118462c";
const token = "public_wfVLwtMF9Rg0rp_k";
const main_trigger_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
// let QR_URL = "https://votre-url-ici.com";
// Lecture du json de donnée distante
const keysFromJson: MachineParameter[] =  data.map((data) => 
    new MachineParameter(data.Key, data.Label, data.Value, data.Type, data.UnitType, data.showInIHM)
);
const datasForIHM: MachineParameter[] =  data.filter(d => d.showInIHM === true).map((data) => 
    new MachineParameter(data.Key, data.Label, data.Value, data.Type, data.UnitType, data.showInIHM)
);
let isSetMachineStateLaunched: boolean = false;
// let isSoutirageOn = false;
let rulesResult: RuleResult[];
let isProjectReadOnly: boolean = true;
// let testUseEffect: boolean = false;
const allMachineAnimations : { [key:string] : MachineAnimation } = {};
const AnimationIdvanneIdMapping : { [key:string] : string } = {};
let exercise : Exercise;
let exerciseManager : ExerciseManager;
let isHintModalVisible: boolean;
let machineLabelIdMapping: MachineMapping;
let canShowAnimationButton: boolean = true;
let appMode : number;
let areVannesReseted: boolean = false;

export default function App({ appModeInput } : {readonly appModeInput : number}) {
    appMode = appModeInput;
    if (appMode == ProjectConstants.APP_MODE_EXERCICE)
        isProjectReadOnly = false;
    // Récupération du mapping des labels et des ids
    machineLabelIdMapping = new MachineMapping(machinePartsJson.machineParts);
    exerciseManager = new ExerciseManager();
    // Mapping des exercices
    exercise = exercises.exercises.map(
        (e) => new Exercise(
            e.description,
            e.steps.map((s) => Object.assign(new Step(), s))
        )
    )[0];
    
    return (
        <Livelink sceneId={scene_id} token={token} isTransient={true} autoJoinExisting={false} LoadingPanel={LoadingOverlay}>
            <SceneViewer />
        </Livelink>
    );
}

function SceneViewer() {
    // const [isOpen, setIsOpen] = useState(false);
    const { instance } = useContext(LivelinkContext);
    const [pickedEntity, setPickedEntity] = useState<{ entity: Entity } | null>(null);
    const [hoveredEntity, setHoveredEntity] = useState<Entity | null>(null);
    const [machineParams, setMachineParams] = useState(keysFromJson);
    const [isExerciseOnGoing, setIsExerciseOnGoing] = useState(false);
    const [isIHMModalVisible, setIsIHMModalVisible] = useState(false);
    const [refluxType] = useState("");
    const [isBouilleurOn, setIsBouilleurOn] = useState(true);
    const [ihmDto, setIhmDto] = useState<IHMDto>({
        waterLevel: 0,
        isP1On: false,
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
        onValueChange: onIHMInputChange
    });
    instance?.startSimulation();
    const [machineStateDto] = useState<MachineStateDto>({
        isReadOnly: isProjectReadOnly,
        toggleReadOnly: toggleIsReadOnly,
        value: machineParams,
        onHover: onMachineStateHover
    });
    let lastLabelClicked = "";

    const updateIhmDto = (key: keyof IHMDto, value: number | string | boolean) => {
        setIhmDto(prev => ({ ...prev, [key]: value }));
    };
    //#region Recup Anims
    // Récupération des animations ici car elles ne sont pas lisible avant
    // Ajout des vannes

    
    getVannesValues().forEach(v => {
        AnimationIdvanneIdMapping[v.id] = v.label;
        AddVanneAnimations(v.label,
        v.openAnimId,
        v.closeAnimId,
        v.glowAnimId,
        v.stopGlowAnimId
        );
    });
    const { entity: dropParent } = useEntity({
        euid: "79235261-a781-4f84-80d1-5689adabdd57"
    });
    const cameraControllerRef = useRef<DefaultCameraController>(null);
    // Mon Animation Sequence Controller
    // const { entity: v18Anim_open } = useEntity({
    //     euid: "ef3cdc0b-f2e4-4569-8563-cc4a335cbc04",
    // });
    // useEffect(() => {
    //     alert("playstate");
    // }, [v18Anim_open?.playState])

    const screenId = machineLabelIdMapping.getIdByLabelIfExists("ecran");
    AddAnimation("741cbe2b-7198-46e7-92ba-3498c87e0461",AnimationTypes.glow,"ecran");
    // Bac de retention    
    AddAnimation("be244dc8-0da4-4036-94ba-b1d875c24134",AnimationTypes.glow,"bac_de_retention");
    AddAnimation("d6d376eb-3686-4483-926e-82c901e04f21",AnimationTypes.move,"bac_de_retention");

    const animationEntities = useAnimationEntities();
    
    AddAnimation("a66152e4-f0a6-478f-8cc1-4d1331ae1141",AnimationTypes.glow,"bidon_10L_V12");
    AddAnimation("d2c81ff2-0f48-4c61-b5eb-27932a1ce27e",AnimationTypes.move,"bidon_10L_V12");
    
    AddAnimation("5ef27586-7f3a-43ad-8f30-1c6b322a3b30",AnimationTypes.glow,"bidon_10L_V15");
    AddAnimation("41ee3239-b6d8-4127-8401-c06b2b421bf8",AnimationTypes.move,"bidon_10L_V15");
    
    AddAnimation("ea69d273-7301-476c-90b1-5cee298cd45c",AnimationTypes.glow,"bidon_20L");
    AddAnimation("6e1710fe-8116-4209-989b-fa4315a94056",AnimationTypes.move,"bidon_20L");

//bouchon 
    AddAnimation("dee38e6f-39d0-42f6-b371-b06af8606b97",AnimationTypes.glow,"bouchon");
    AddAnimation("04f499fa-8dbe-4682-9d8d-e39aad9eee2d",AnimationTypes.move,"bouchon");
    

AddAnimation("2cf59cc7-b06d-430a-ae37-e5c98b052bd0",AnimationTypes.other,"bells");

AddAnimation("4b0d14d8-e1b0-42fe-8ad5-b1ed28f96f6b",AnimationTypes.other,"heat_boiler");

//V14 
AddAnimation("a82aa290-ee90-487e-a921-e4597aadfb96",AnimationTypes.open,"V14");
AddAnimation("fc80d23c-0b6a-4de4-82cc-9cc69934697b",AnimationTypes.close,"V14");
AddAnimation("451e35a8-bdc6-4ee5-81b1-f0ff3d00cb16",AnimationTypes.glow,"V14");
// echantillon
AddAnimation("5046e472-12e9-4a46-a91c-18f7a5296fe2",AnimationTypes.other,"echantillon_v14");

if (!areVannesReseted){
    closeAllVannes();
    areVannesReseted = true;
}
useBehaviourOnAnimationTrigger(cameraControllerRef,{
    instance,
    dropParent,
    bac_de_retention_IN: animationEntities.bac_de_retention!,
    prechauffeur_FILL: animationEntities.prechauffeur_fill!,
    postPrechauffeurTube1_fill: animationEntities.postPrechauffeurTube1_fill!,
    goutte_created: animationEntities.goutte_drop!,
    soutirage_on: animationEntities.soutirage_on!,
    soutirage_off: animationEntities.soutirage_off!,
    V15_1L_fill: animationEntities.fill_bidon_1L_V15!,
    soutirage_anim: animationEntities.goutte_soutirage!
});

    const customFireEvent = (eventName: string) => {
        if (instance){
            instance.scene.fireEvent({
                    event_map_id: "75aa01b4-d1a0-482f-bf95-c16e4feb969b",
                    event_name: eventName
            });
        }
    }
        
    //#region Gestion du clique

    // Change le curseur si on survole une entité
    useEffect(() => {
        document.body.style.cursor = hoveredEntity ? "pointer" : "default";
    }, [hoveredEntity]);
    
    //--------------------------------------------------------------------------
    const neutralForward = [0, 0, -1] as Vec3;
    const onObjectClicked = useCallback(() => {

        if (isProjectReadOnly)
            return;

        const labelFromId = machineLabelIdMapping.getLabelByIdIfExists(pickedEntity!.entity.id);
        
            console.log(pickedEntity!.entity.id);
        if (labelFromId != undefined){
            lastLabelClicked = labelFromId;
            console.log("setLastLabelClicked");
            console.log(lastLabelClicked);
        }
        
        if (pickedEntity!.entity.id === "67778e9e-6860-4ad0-8475-206f84331901") // V18
        {
            //AnimationHelper.launchAnim(v18Anim_open);
            customFireEvent("V18_clicked");
        }
        
        if (pickedEntity!.entity.id === screenId) // screen
        {
            showIHMModal();
        }
        // Gestion au clic sur une vanne
        if (pickedEntity!.entity.id in AnimationIdvanneIdMapping){
            onVanneClicked();
        }
                    
         if (appMode === ProjectConstants.APP_MODE_MAINTENANCE)
        {
            setMachineStateDatas();

        }


        if (isExerciseOnGoing){
            onClickWhileExerciseOnGoing();
        }
    }, [pickedEntity]);

    //--------------------------------------------------------------------------
    // Highlight + déclenchement d'animation au clic
    useEffect(() => {
        if (!instance) return;

        // Highlight visuel
        const entity = pickedEntity?.entity;
        if (entity){

            const capId = "643bf086-ac9f-4c98-a896-3abb0888aa80";
            if (entity.id === capId)
            {
                instance.scene.fireEvent({
                    event_map_id: "75aa01b4-d1a0-482f-bf95-c16e4feb969b",
                    event_name: "cap_clicked"
                });
            }



            instance.scene.highlightEntities({
                entities: [entity]
            });
            onObjectClicked();
        }
        else {
            instance.scene.highlightEntities({
                entities: [],
            });
        }

    }, [instance, pickedEntity, onObjectClicked]);

    if (appMode === ProjectConstants.APP_MODE_MAINTENANCE)
    {
        setMachineStateDatas();

    }


    //#endregion
    // const [sessionInfo, setSessionInfo] = useState<{
    //         session_id: UUID;
    //         client_id: UUID;
    //         camera_entity_id: UUID;
    //     } | null>(null);
    const { cameraEntity } = useCameraEntity();
    // useEffect(() => {
    //     if (instance && instance.session.client_id && cameraEntity) {
    //         setSessionInfo({
    //             session_id: instance.session.session_id,
    //             client_id: instance.session.client_id,
    //             camera_entity_id: cameraEntity.id,
    //         });
    //     }
    // }, [instance, cameraEntity, setSessionInfo]);
    const { entities } = useEntities({ mandatory_components: ["label"] }, [

        "label",

    ]);
    //#region Gestion des labels
    const moveCamera = (entity: Entity) => {
        if (!cameraControllerRef.current) {
            return;
        }

        const cameraController = cameraControllerRef.current;

        const labelComponent = entity.label;
        if (!labelComponent) {
            console.warn(`Entity ${entity.debug_name?.value} is not a label`);
            return;
        }

        // Extract camera pov from label component
        const position = labelComponent.camera.slice(0, 3) as Vec3;
        const orientation = labelComponent.camera.slice(3, 7) as Quat;

        const distance = cameraController.getTargetDistance();
        const forward = applyQuaternionToVector3(neutralForward, orientation);
        const scaledForward = forward.map(v => v * distance) as Vec3;
        const target = addVec3(position, scaledForward);

        // Move the camera to the position and look at the target
        cameraController.setLookAt(...position, ...target, true);
    };

    const onClickLabel = (value: Entity) => {
        if (instance && value.label)
        {
            if (value.label.title == '1'){

                instance.scene.fireEvent({
                    event_map_id: main_trigger_map_id,
                    event_name: "label_1_clicked"
                });
            }
            else if (value.label.title == '2'){

                instance.scene.fireEvent({
                    event_map_id: main_trigger_map_id,
                    event_name: "label_2_clicked"
                });
            }
            else if (value.label.title == '3'){

                instance.scene.fireEvent({
                    event_map_id: main_trigger_map_id,
                    event_name: "label_3_clicked"
                });
            }
        }
    }

    
function onVanneClicked(){
    const machineParam = machineParams.find(k => k.key === AnimationIdvanneIdMapping[pickedEntity!.entity.id]);
    if(!machineParam) {
        console.warn("Param " + AnimationIdvanneIdMapping[pickedEntity!.entity.id] + " not found");
        return;
    }
    machineParam.value = machineParam.value === "false" ? "true" : "false";
    setMachineParams([ ...machineParams ]);
    launchVanneAnimIfNeeded(machineParam,AnimationIdvanneIdMapping[pickedEntity!.entity.id]);
}

function onMachineStateHover(key: string, status: boolean){
    if (status)
        AnimationHelper.launchAnim(allMachineAnimations[AnimationHelper.getAnimationName(key,AnimationTypes.glow)].animationController);
    else
    {
        AnimationHelper.closeAnim(allMachineAnimations[AnimationHelper.getAnimationName(key,AnimationTypes.glow)].animationController);
        AnimationHelper.launchAnim(allMachineAnimations[AnimationHelper.getAnimationName(key,AnimationTypes.stopGlow)].animationController);
    }
}

//------------------------------------------------------------------------------
// Helper functions to perform vector and quaternion math without external libraries
function applyQuaternionToVector3(v: Vec3, q: Quat): Vec3 {
    // Quaternion rotation: v' = q * v * q^-1
    const [x, y, z] = v;
    const [qx, qy, qz, qw] = q;

    // Calculate quat * vector
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    // Calculate result * inverse quat
    return [
        ix * qw + iw * -qx + iy * -qz - iz * -qy,
        iy * qw + iw * -qy + iz * -qx - ix * -qz,
        iz * qw + iw * -qz + ix * -qy - iy * -qx,
    ];
}

//------------------------------------------------------------------------------
function addVec3(a: Vec3, b: Vec3): Vec3 {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

    //#endregion

    function showIHMModal(){
        setIsIHMModalVisible(true);
    }

    function closeIHMModal(){
        setIsIHMModalVisible(false);

    }

    function toggleIsReadOnly(){
        isProjectReadOnly = !isProjectReadOnly;
    }

function LaunchAnimationCompleteContinueFromButton(){
    canShowAnimationButton = false;
    resetMachineToStart();
    LaunchAnimationCompleteContinue({input: {
        animationEntities: animationEntities,
        cameraControllerRef: cameraControllerRef,
        setIsIHMModalVisible: setIsIHMModalVisible,
        updateIhmDto: updateIhmDto
    }});
}

function LaunchAnimationCompleteDisContinueFromButton(){
    canShowAnimationButton = false;
    resetMachineToStart();
    LaunchAnimationCompleteDiscontinue({input: {
        animationEntities: animationEntities,
        cameraControllerRef: cameraControllerRef,
        setIsIHMModalVisible: setIsIHMModalVisible,
        updateIhmDto: updateIhmDto
    }});
}

function closeAllVannes(){
    AnimationHelper.launchAnim(animationEntities.v2_out);
    AnimationHelper.launchAnim(animationEntities.v3_out);
    AnimationHelper.launchAnim(animationEntities.v4_out);
    AnimationHelper.launchAnim(animationEntities.v5_out);
    AnimationHelper.launchAnim(animationEntities.v6_out);
    AnimationHelper.launchAnim(animationEntities.v7_out);
    AnimationHelper.launchAnim(animationEntities.v8_out)
    AnimationHelper.launchAnim(animationEntities.v9_out)
    AnimationHelper.launchAnim(animationEntities.v11_out)
    AnimationHelper.launchAnim(animationEntities.v12_out)
    AnimationHelper.launchAnim(animationEntities.v14_out)
    AnimationHelper.launchAnim(animationEntities.v15_out)
    AnimationHelper.launchAnim(animationEntities.v16_out);
}

function resetMachineToStart(){

    closeAllVannes();
    AnimationHelper.closeAnim(animationEntities.fill_bidon_1L_V12);
    AnimationHelper.closeAnim(animationEntities.fill_bidon_1L_V15);
    AnimationHelper.closeAnim(animationEntities.fill_bidon_10L_V12);
    AnimationHelper.closeAnim(animationEntities.fill_bidon_10L_V15);
    AnimationHelper.closeAnim(animationEntities.soutirage_cycle);
    AnimationHelper.launchAnim(animationEntities.goutte_drop_cycle_off);
    AnimationHelper.launchAnim(animationEntities.hide_bells_bulles);
    AnimationHelper.launchAnim(animationEntities.hide_bulles_bouilleur);
    AnimationHelper.launchAnim(animationEntities.bac_de_retention_out);
    AnimationHelper.launchAnim(animationEntities.bidon_10L_V15_out);
    AnimationHelper.launchAnim(animationEntities.bidon_10L_V12_out);
    AnimationHelper.launchAnim(animationEntities.bidon_20L_out);
    AnimationHelper.closeAnim(animationEntities.bells_on);
    AnimationHelper.closeAnim(animationEntities.fill_bouilleur_continu);
    AnimationHelper.closeAnim(animationEntities.heat_boiler);
    AnimationHelper.closeAnim(animationEntities.bidon_10L_V15_in);
    AnimationHelper.closeAnim(animationEntities.bidon_20L_in);
    AnimationHelper.closeAnim(animationEntities.screen_glow);
    updateIhmDto('isLSL1ok',false)
    updateIhmDto("TT2Value",0)
    updateIhmDto("TT3Value",0)
    updateIhmDto("TT4Value",0)
    updateIhmDto("TT5Value",0)
    updateIhmDto("bouilleurRate",0)
    updateIhmDto("refluxRate",0)
    updateIhmDto("waterLevel",0)
    updateIhmDto("prechauffeValue",0)
    
    //setDpic(0);
    updateIhmDto("isP1On", false);
    setIsBouilleurOn(false);
}

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

function startExercise(){
    resetMachineToStart();
    setIsExerciseOnGoing(true);
    exerciseManager.startExercise(exercise);
    isProjectReadOnly = false;
    glowExerciseItems();
}

function showStepHint(){
    isHintModalVisible = true;
}
function hideStepHint(){
    isHintModalVisible = false;
}
function glowExerciseItems(){
    exerciseManager.currentStep?.itemsLabelToGlow.forEach((key) => {
        AnimationHelper.launchAnim(allMachineAnimations[AnimationHelper.getAnimationName(key,AnimationTypes.glow)].animationController);
    });
}

function stopGlowExerciseItems(){
    console.log("stopGlowExerciseItems");
        exerciseManager.currentStep?.itemsLabelToGlow.forEach((key) => {
            AnimationHelper.closeAnim(allMachineAnimations[AnimationHelper.getAnimationName(key,AnimationTypes.glow)].animationController);
            if (allMachineAnimations[AnimationHelper.getAnimationName(key,AnimationTypes.stopGlow)] != undefined)
            {
                AnimationHelper.launchAnim(allMachineAnimations[AnimationHelper.getAnimationName(key,AnimationTypes.stopGlow)].animationController);

            }
        });
}

function onClickWhileExerciseOnGoing(){
    if (isStepValidated()){
        onStepValidated();
    }
}

function isStepValidated() : boolean {
    let isValidated = true;
    
    exerciseManager.currentStep?.stepValidationPoints.forEach(s => {
        
        if (s.expectedValue === "click"){
            if(lastLabelClicked != s.label){
                isValidated = false;
            }
        }
        else if (s.isIHM){
            
            isValidated= isValidatedFromIHM(s.label,s.expectedValue);
            

        }
        else {
            console.log(keysFromJson);
            const currentValue = keysFromJson.find(k => k.key === s.label)?.value;
            if (currentValue != s.expectedValue)
                isValidated = false;
        }
    });
    
    return isValidated;
}

function isValidatedFromIHM(label: string,expectedValue: string | boolean | number) : boolean{
    switch(label){
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

function onStepValidated(){
    
    if (exerciseManager.currentStep?.action != undefined){
        if (exerciseManager.currentStep?.action === "move"){
            AnimationHelper.launchAnim(allMachineAnimations[AnimationHelper.getAnimationName(exerciseManager.currentStep?.itemsLabelToGlow[0], AnimationTypes.move)].animationController);
        }
        else if (exerciseManager.currentStep?.action === "animation"){
            exerciseManager.currentStep?.animationNames.forEach(a => {
                AnimationHelper.launchAnim(allMachineAnimations[a].animationController)
            })
            
        }
    }
    stopGlowExerciseItems();
    
    const isExerciseOnGoing = exerciseManager.nextStep();
    if (isExerciseOnGoing)
    {
        glowExerciseItems();
    }
    else {
        setIsExerciseOnGoing(false);
    }
}


function onIHMInputChange(label: string, value: SetStateAction<number> | SetStateAction<boolean> | SetStateAction<string>){
    console.log(label);
    console.log(value);
    // switch(label){
    //     case "bouilleurRate":
    //         setBouilleurRate(value as SetStateAction<number>);
    //         break;
    //     case "p1Value":
    //         setp1Value(value as SetStateAction<number>);
    //         break;
    //     case "isP1On":
    //         setStatusP1(value as SetStateAction<boolean>);
    //         break;
    //     case "prechauffeValue":
    //         setPrechauffeValue(value as SetStateAction<number>);
    //         break;
    //     case "waterLevel":
    //         setWaterLevel(value as SetStateAction<number>);
    //         break;
    //     case "dpic":
    //         setDpic(value as SetStateAction<number>);
    //         break;
    //     case "reflux":
    //         setrefluxType(value as SetStateAction<string>);
    //         break;
    //     case "isBouilleurOn":
    //         setIsBouilleurOn(value as SetStateAction<boolean>);
    //         break;
    //     case "refluxRate":
    //         setrefluxRate(value as SetStateAction<number>);
    //         break;

            
    // }
    if (isExerciseOnGoing)
    {

        onClickWhileExerciseOnGoing();
    }
}

//#endregion




    //#region VUE
    return (
        <Canvas className="w-full h-hull bg-black">
            <Viewport
                cameraEntity={cameraEntity}
                setPickedEntity={setPickedEntity}
                setHoveredEntity={(data) => setHoveredEntity(data?.entity ?? null)}
                className="w-full h-full"
            >
                <CameraController ref={cameraControllerRef} />
                {/* État de la machine */}
                {
                    appMode === ProjectConstants.APP_MODE_MAINTENANCE && (
                    <div className={`absolute top-[2vh] left-[2vh]`}>
                        <MachineState
                            machineStateDto={machineStateDto}
                        />
                    </div>
                    )
                }
                {/* Erreurs */}
                {
                    (appMode === ProjectConstants.APP_MODE_MAINTENANCE && rulesResult != undefined && rulesResult.filter(r => r.result === "Echec").length > 0) && (
                        
                    <div className={`absolute top-[2vh] right-[2vh]`}>
                        
                        <div className="titleDiv">
                            <b>Erreur(s) :</b>
                            
                        </div>
                        
                        <div id="errorDiv" className="contentDiv">
                        {/* Affichage de chaque élément de la machine */}
                        {
                            rulesResult.filter(r => r.result === "Echec").map(r => (
                                
                                <div onClick={revealErrors}
                                onPointerLeave={
                                    () => {
                                        launchValveErrors(false);
                                    }
                                }
                                onPointerOverCapture={
                                    () => {
                                        
                                        launchValveErrors(true);
                                    }
                                }>
                                    
                                    <p><b>{r.name}</b></p>
                                    {/* <p>État : <b>{r.result}</b></p> */}
                                    <p>{r.errorMessage}</p>
                                    <hr/>
                                </div>
                            ))
                        }
                            
                        </div>
                    </div>
                    )
                }



                
                {
                    isHintModalVisible ? 
                    (
                    <div className={`absolute bottom-[40vh] right-[92vh]`}>
                        <BasicTextModal basicTextModalDto={{text:exerciseManager.getCurrentStepHint(), onBasicModalClose: hideStepHint}} />
                    </div>
                    )
                    : ("")
                }
                {
                    appMode === ProjectConstants.APP_MODE_EXERCICE && (
                         isExerciseOnGoing ?
                        (
                        <div id="exercise-UI" className={`absolute bottom-[10vh] right-[92vh]`}>
                            <p>{exerciseManager.currentExercise?.description}</p>
                            <p>Étape : {exerciseManager.getCurrentStepIndex()} / {exerciseManager.getStepCount()}</p>
                            <button className="basicBtn" onClick={showStepHint}>Indice</button>
                        </div>
                        )
                        :
                        (
                        <div className={`absolute bottom-[10vh] right-[98vh]`}>
                            <button id="exerciseBtn" onClick={startExercise}>LANCER EXERCICE</button>
                        </div>
                        )
                    )
                }
                {/* Affichage des boutons toujours présents */ 
                
                        // <div className={`absolute yop-[10vh] right-[28vh]`}>
                        //     <button id="exerciseBtn" onClick={() => shareSessionQRCode()}>Partager la Session</button>
                        // </div>
                }

                {

                    appMode === ProjectConstants.APP_MODE_ANIMCONTINUE && canShowAnimationButton  ? (
                        <div className={`absolute bottom-[10vh] right-[42vw]`}>
                            <button id="exerciseBtn" onClick={LaunchAnimationCompleteContinueFromButton}>LANCER ANIMATION CONTINUE</button>
                        </div> 
                    )
                    :
                    (<></>)
                }
                {
                    appMode === ProjectConstants.APP_MODE_ANIMDISCONTINUE && canShowAnimationButton ? (
                        <div className={`absolute bottom-[10vh] right-[42vw]`}>
                            <button id="exerciseBtn" onClick={LaunchAnimationCompleteDisContinueFromButton}>LANCER ANIMATION DISCONTINUE</button>
                        </div> 
                    )
                    : (<></>)
                }

                {
                    !isIHMModalVisible ?
                    ("")
                    :
                    (
                        <div className={`absolute top-[5vh] left-[70vh]`}>
                            <IHM
                            dto={ihmDto}
                            />
                        </div>
                    )
                }
                {/* {isOpen && <QRModal url={QR_URL} onClose={() => setIsOpen(false) } />} */}
                
                {/* Gestion des labels */}
                <DOM3DOverlay>
                {entities.map(entity => (
                    <DOMEntity
                        key={entity.id}
                        entity={entity}
                        anchor="center"
                    >
                        <div
                            className="px-3 py-1 text-xs text-primary-dark font-medium bg-white/60 border border-white/40 backdrop-blur-3xl rounded-full select-none cursor-pointer hover:scale-105 transition-transform"
                            onClickCapture={() => {
                                moveCamera(entity);
                                onClickLabel(entity);
                            }
                            }
                            title="Click to move camera here"
                        >
                            {entity.label?.title || "Unnamed Label"}
                        </div>
                    </DOMEntity>
                ))}
            </DOM3DOverlay>
            </Viewport>
        </Canvas>
    );
    
    //#endregion
// function shareSessionQRCode(){  
//     QR_URL = "http://localhost:5173/?idsession=" + instance!.session.session_id.toString() + "&idclient=" + instance!.session.client_id;
    
//     console.log(QR_URL);
//     setIsOpen(true);
// }
}

/**
 * Ajout des animations d'une vanne dans le tableau d'animation. Les vannes ont 3 animations, ouverture, fermeture, clignotement
 * @param vanneEntityBaseName Nom de la vanne (ex "V2")
 * @param openAnimationId id de l'animation d'ouverture
 * @param closeAnimationId id de l'animation de fermeture
 * @param glowAnimationId id de l'animation de clignotement
 */
function AddVanneAnimations(vanneEntityBaseName: string, 
    openAnimationId : string,
    closeAnimationId : string,
    glowAnimationId : string,
    stopGlowAnimationId : string | undefined){

    const { entity: openAnimationEntity } = useEntity({
        euid: openAnimationId,
    });
    const { entity: closeAnimationEntity } = useEntity({
        euid: closeAnimationId,
    });
    const { entity: glowAnimationEntity } = useEntity({
        euid: glowAnimationId,
    });
    const { entity: stopGlowAnimationEntity } = useEntity({
        euid: stopGlowAnimationId == undefined ? " " : stopGlowAnimationId,
    });

    const OpenAnimationName = AnimationHelper.getAnimationName(vanneEntityBaseName, AnimationTypes.open);
    const CloseAnimationName = AnimationHelper.getAnimationName(vanneEntityBaseName, AnimationTypes.close);
    const GlowAnimationName = AnimationHelper.getAnimationName(vanneEntityBaseName, AnimationTypes.glow);
    allMachineAnimations[OpenAnimationName] =  { key: OpenAnimationName, animationController: openAnimationEntity! };
    allMachineAnimations[CloseAnimationName] =  { key: CloseAnimationName, animationController: closeAnimationEntity! };
    allMachineAnimations[GlowAnimationName] =  { key: GlowAnimationName, animationController: glowAnimationEntity! };

    if (stopGlowAnimationEntity != null)
    {
        const StopGlowAnimationName = AnimationHelper.getAnimationName(vanneEntityBaseName, AnimationTypes.stopGlow);
        allMachineAnimations[StopGlowAnimationName] =  { key: StopGlowAnimationName, animationController: stopGlowAnimationEntity! };
    }
}

function AddAnimation(animId: string, animationType: AnimationTypes, entityLabel: string){
    const { entity: animToAdd } = useEntity({
        euid: animId,
    });
    const animationName = AnimationHelper.getAnimationName(entityLabel, animationType);
    allMachineAnimations[animationName] =  { key: animationName, animationController: animToAdd! };
}

function setMachineStateDatas(){
    if (isSetMachineStateLaunched === false){
        isSetMachineStateLaunched = true;
        console.log(keysFromJson);
        keysFromJson.forEach(k => {
            if (k.type === ProjectConstants.UNITTYPE_VANNE)
            {
                launchVanneAnimIfNeeded(k,k.key);
            }
            else
            {
                console.log("launchAnimIfNeeded(k)")
            }
                // launchAnimIfNeeded(k);
        });
    }
    testRules();
}

function testRules(){
    rulesResult = [];
    rulesData.forEach(r => {
        const ruleSystem = new RulesSystem();
        const result = ruleSystem.testRule(r as Rule, keysFromJson);
        rulesResult.push({name: r.name, result: result === true ? "Validé":"Echec", errorMessage: r.errorMessage} as RuleResult)
    });
    // if (rulesResult.filter(r => r.result === "Echec").length > 0)
    //     launchValveErrors(true);
    // else
    //     launchValveErrors(false);
}

function launchValveErrors(value: boolean){
    if (value === true)
    {
        AnimationHelper.launchAnim(allMachineAnimations["V4_glow"].animationController);
        AnimationHelper.launchAnim(allMachineAnimations["V2_glow"].animationController);
        AnimationHelper.launchAnim(allMachineAnimations["V3_glow"].animationController);
    }
    else{
        AnimationHelper.closeAnim(allMachineAnimations["V4_glow"].animationController);
        AnimationHelper.closeAnim(allMachineAnimations["V2_glow"].animationController);
        AnimationHelper.closeAnim(allMachineAnimations["V3_glow"].animationController);
        AnimationHelper.closeAnim(allMachineAnimations[AnimationHelper.getAnimationName("V4",AnimationTypes.stopGlow)].animationController);
        AnimationHelper.closeAnim(allMachineAnimations[AnimationHelper.getAnimationName("V2",AnimationTypes.stopGlow)].animationController);
        AnimationHelper.closeAnim(allMachineAnimations[AnimationHelper.getAnimationName("V3",AnimationTypes.stopGlow)].animationController);
    }
}

function revealErrors(){
    alert("REVEAL ERROSRS");
}
// function launchAnimIfNeeded(param : MachineParameter)
// {
// }
function launchVanneAnimIfNeeded(param : MachineParameter, vanneLabel: string){
    console.log("launchVanneAnimIfNeeded");
    console.log(param);
    console.log(vanneLabel);
        if (param.value === "true")
            AnimationHelper.launchAnim(allMachineAnimations[AnimationHelper.getAnimationName(vanneLabel, AnimationTypes.open)].animationController);
        else 
            AnimationHelper.launchAnim(allMachineAnimations[AnimationHelper.getAnimationName(vanneLabel, AnimationTypes.close)].animationController);        
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
        //             event_map_id: "75aa01b4-d1a0-482f-bf95-c16e4feb969b",
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
        //         //     event_map_id: "75aa01b4-d1a0-482f-bf95-c16e4feb969b",
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