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
import { type Entity, type Quat, type Vec3 } from "@3dverse/livelink";
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
import { ProjectConstants } from "./projectConstants";
import { Exercise } from "./models/exercices/exercice";
import { Step } from "./models/exercices/step";
import { MachineParameter } from "./models/machineParameter";
import type { MachineAnimation } from "./models/machineAnimation";
import { MachineMapping } from "./machineMapping";
import { ExerciseManager } from "./models/exercices/exerciseManager";
import BasicTextModal from "./modals/basicTextModal";
import type { IHMDto } from "./models/IHMDto";
import type { MachineStateDto } from "./models/machineStateDto";
// Scene et token publics
const scene_id = "05b63dcd-ce5c-4e8f-b363-89a38118462c";
const token = "public_wfVLwtMF9Rg0rp_k";
const main_trigger_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
// Lecture du json de donnée distante
const keysFromJson: MachineParameter[] =  data.map((data) => 
    new MachineParameter(data.Key, data.Label, data.Value, data.Type, data.UnitType, data.showInIHM)
);
const datasForIHM: MachineParameter[] =  data.filter(d => d.showInIHM === true).map((data) => 
    new MachineParameter(data.Key, data.Label, data.Value, data.Type, data.UnitType, data.showInIHM)
);
let isSetMachineStateLaunched: boolean = false;
let rulesResult: RuleResult[];
let isProjectReadOnly: boolean = true;

const allMachineAnimations : { [key:string] : MachineAnimation } = {};
const AnimationIdvanneIdMapping : { [key:string] : string } = {};
let exercise : Exercise;
let exerciseManager : ExerciseManager;
let isHintModalVisible: boolean;
let machineLabelIdMapping: MachineMapping;
let isDebugMode: boolean;
export default function App({isDebugModeInput} : {readonly isDebugModeInput: boolean}) {
    isDebugMode = isDebugModeInput;
    if (!isDebugMode)
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
        <Livelink sceneId={scene_id} token={token} LoadingPanel={LoadingOverlay}>
            <SceneViewer />
        </Livelink>
    );
}


function SceneViewer() {
    const { instance } = useContext(LivelinkContext);
    const [pickedEntity, setPickedEntity] = useState<{ entity: Entity } | null>(null);
    const [hoveredEntity, setHoveredEntity] = useState<Entity | null>(null);
    const [machineParams, setMachineParams] = useState(keysFromJson);
    const [isExerciseOnGoing, setIsExerciseOnGoing] = useState(false);
    const [isIHMModalVisible, setIsIHMModalVisible] = useState(false);
    const [statusP1, setStatusP1] = useState(false);
    // const [p1Value, setp1Value] = useState(0);
    // const [TT2Value, setTT2Value] = useState(0);
    // const [TT3Value, setTT3Value] = useState(0);
    // const [TT4Value, setTT4Value] = useState(0);
    // const [TT5Value, setTT5Value] = useState(0);
    // const [lsl1Value, setLsl1Value] = useState(false);
    const [refluxType, setrefluxType] = useState("");
    const [isBouilleurOn, setIsBouilleurOn] = useState(true);
    // const [bouilleurRate, setBouilleurRate] = useState(0);
    // const [highlighted, setHighlighted] = useState("");
    // const [prechauffeValue, setPrechauffeValue] = useState(0);
    const [dpic, setDpic] = useState(0);
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
const { entity: screen_glow } = useEntity({
    euid: "741cbe2b-7198-46e7-92ba-3498c87e0461",
});
const { entity: bac_de_retention } = useEntity({
    euid: "d6d376eb-3686-4483-926e-82c901e04f21",
});
// const { entity: bac_de_retention_glow } = useEntity({
//     euid: "be244dc8-0da4-4036-94ba-b1d875c24134",
// });
const { entity: bac_de_retention_out } = useEntity({
    euid: "418eeee8-7509-46c3-b356-7fa34fdcac90",
});
const { entity: bac_de_retention_in } = useEntity({
    euid: "d6d376eb-3686-4483-926e-82c901e04f21",
});
// Bidon V12
const { entity: bidon_10L_V12_out } = useEntity({
    euid: "de3c9604-dba5-48f6-b66c-9864143dab9b",
});
const { entity: bidon_10L_V12_in } = useEntity({
    euid: "d2c81ff2-0f48-4c61-b5eb-27932a1ce27e",
});
    AddAnimation("a66152e4-f0a6-478f-8cc1-4d1331ae1141",AnimationTypes.glow,"bidon_10L_V12");
    AddAnimation("d2c81ff2-0f48-4c61-b5eb-27932a1ce27e",AnimationTypes.move,"bidon_10L_V12");

// Bidon V15
const { entity: bidon_10L_V15_out } = useEntity({
    euid: "7868cb9f-e75b-47fd-bbbf-e33c8e183558",
});
const { entity: bidon_10L_V15_in } = useEntity({
    euid: "41ee3239-b6d8-4127-8401-c06b2b421bf8",
});
    AddAnimation("5ef27586-7f3a-43ad-8f30-1c6b322a3b30",AnimationTypes.glow,"bidon_10L_V15");
    AddAnimation("41ee3239-b6d8-4127-8401-c06b2b421bf8",AnimationTypes.move,"bidon_10L_V15");

// Bidon 20L
const { entity: bidon_20L_out } = useEntity({
    euid: "3a019097-bda9-4d6c-87bc-a73f78fd6306",
});
const { entity: bidon_20L_in } = useEntity({
    euid: "6e1710fe-8116-4209-989b-fa4315a94056",
});
    AddAnimation("ea69d273-7301-476c-90b1-5cee298cd45c",AnimationTypes.glow,"bidon_20L");
    AddAnimation("6e1710fe-8116-4209-989b-fa4315a94056",AnimationTypes.move,"bidon_20L");

//bouchon 
    AddAnimation("dee38e6f-39d0-42f6-b371-b06af8606b97",AnimationTypes.glow,"bouchon");
    AddAnimation("04f499fa-8dbe-4682-9d8d-e39aad9eee2d",AnimationTypes.move,"bouchon");
// V16
const { entity: v16_out } = useEntity({
    euid: "b2cef0ae-a71b-4eb6-ae4e-d65eb080cfaa",
});
const { entity: v16_in } = useEntity({
    euid: "2708134b-9fc3-4354-aca2-2900f5c8443b",
});

// V2
// const { entity: v2_out } = useEntity({
//     euid: "f04997e6-57aa-4e3c-b864-696319b7011d",
// });
const { entity: v2_in } = useEntity({
    euid: "2089b454-c72a-4d8b-acfc-8716553613da",
});

// cloches
const { entity: bells_on } = useEntity({
    euid: "2cf59cc7-b06d-430a-ae37-e5c98b052bd0",
});

AddAnimation("2cf59cc7-b06d-430a-ae37-e5c98b052bd0",AnimationTypes.other,"bells");
// fill_boiler
const { entity: fill_bouilleur } = useEntity({
    euid: "5d0c9657-8d92-4b05-816c-5443c125b02c",
});

// heat bouilleur
const { entity: heat_boiler } = useEntity({
    euid: "4b0d14d8-e1b0-42fe-8ad5-b1ed28f96f6b",
});
AddAnimation("4b0d14d8-e1b0-42fe-8ad5-b1ed28f96f6b",AnimationTypes.other,"heat_boiler");

//V14 
AddAnimation("a82aa290-ee90-487e-a921-e4597aadfb96",AnimationTypes.open,"V14");
AddAnimation("fc80d23c-0b6a-4de4-82cc-9cc69934697b",AnimationTypes.close,"V14");
AddAnimation("451e35a8-bdc6-4ee5-81b1-f0ff3d00cb16",AnimationTypes.glow,"V14");
// echantillon
AddAnimation("5046e472-12e9-4a46-a91c-18f7a5296fe2",AnimationTypes.other,"echantillon_v14");
// v8
const { entity: v8_out } = useEntity({
    euid: "282c631a-baf4-49fc-819b-b66d86fdac2f",
});
const { entity: v8_in } = useEntity({
    euid: "d62102a3-9a75-46f1-ae67-a8e70f6509a6",
});

const { entity: fill_bidon_1L_V15 } = useEntity({
    euid: "c8470577-4e01-4bf0-94f7-ba91adaab138",
});
const { entity: empty_bidon_1L_V15 } = useEntity({
    euid: "3d87a251-88a8-49eb-bb72-2f954a6cb25e",
});

const { entity: fill_bidon_10L_V15 } = useEntity({
    euid: "82e192d7-266e-4b5c-9cb4-aa377eda4f2d",
});

const { entity: v15_out } = useEntity({
    euid: "a7c4ab57-8777-4905-b48a-136d321d438a",
});
const { entity: v15_in } = useEntity({
    euid: "0d756bb1-2280-4cd9-9dc0-599759a0205a",
});



// const { entity: v18Anim_script } = useEntity({
//     euid: "86e63a74-e492-4ca0-b264-71f003c64d53",
// });
const { entity: tubes } = useEntity({
    euid: "e4adcce0-b38e-413a-8097-2bf4b079b374",
});

const { entity: boilerEmptying } = useEntity({
    euid: "4df7e4b4-b02f-4cda-a560-c2805598b0da",
});

//#region Déplacement de caméra avec les anims
// useEffect(() => {
//     if(!v18Anim_script) {
//         return;
//     }
//     console.log("use effect");
//     const onAnimEnd = () => {replaceCamera(cameraControllerRef.current)};
//     const event_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
//     const event_name = "V18_open_end";
//     const onEmitted = onAnimEnd;
//     const onReceived = onAnimEnd;
//     v18Anim_script.addScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });

//     return () => v18Anim_script.removeScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
// }, [v18Anim_script]);
useEffect(() => {
    if (!bac_de_retention) {
        return;
    }
    console.log("bac_de_retention");
    const onAnimEnd = () => {console.log("bac_de_retention_onanimend");cameraControllerRef.current?.setLookAt(0,2.2,0.9,0,2.3,0,true);};
    const event_map_id = "59241495-b540-4983-8c32-cc8170eb8d19";
    const event_name = "exercise_step_click";
    const onEmitted = onAnimEnd;
    const onReceived = onAnimEnd;
    bac_de_retention.addScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
}, [bac_de_retention])

useEffect(() => {
    if(!tubes) {
        return;
    }
    const onAnimEnd = () => {;cameraControllerRef.current?.setLookAt(0,2.2,0.9,0,2.3,0,true);};
    const event_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
    const event_name = "up_tube_animation_begins";
    const onEmitted = onAnimEnd;
    const onReceived = onAnimEnd;
    tubes.addScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
    
    return () => tubes.removeScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
}, [tubes]);

useEffect(() => {
    if(!tubes) {
        return;
    }
    const onAnimReached = () => {;cameraControllerRef.current?.setLookAt(0.3,0.8,0.6,0,0.8,0,true);};
    const event_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
    const event_name = "move_camera_tube_position_2";
    const onEmitted = onAnimReached;
    const onReceived = onAnimReached;
    tubes.addScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
    //
    return () => tubes.removeScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
}, [tubes]);

useEffect(() => {
    if(!tubes) {
        return;
    }
    const onAnimReached = () => {cameraControllerRef.current?.setLookAt(-0.15,1.1,0.6,-0.15,1.1,0,true);};
    const event_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
    const event_name = "tube_animation_end";
    const onEmitted = onAnimReached;
    const onReceived = onAnimReached;
    tubes.addScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
    //
    return () => tubes.removeScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
}, [tubes]);



useEffect(() => {
    if(!boilerEmptying) {
        return;
    }
    const onAnimReached = () => {cameraControllerRef.current?.setLookAt(0,1.8,1.5,0,1.8,0,true);};
    const event_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
    const event_name = "show_column_animation";
    const onEmitted = onAnimReached;
    const onReceived = onAnimReached;
    boilerEmptying.addScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
    //
    return () => boilerEmptying.removeScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
}, [boilerEmptying]);


const { entity: matterGoingDown } = useEntity({
    euid: "05583fb6-3180-42ca-9d3b-3dfb7c13c903",
});

useEffect(() => {
    if(!matterGoingDown) {
        return;
    }
    const onAnimReached = () => {cameraControllerRef.current?.setLookAt(0,2.1,0.4,0,2.1,0,true);};
    const event_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
    const event_name = "start_matter_going_down";
    const onEmitted = onAnimReached;
    const onReceived = onAnimReached;
    matterGoingDown.addScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
    //
    return () => matterGoingDown.removeScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
}, [matterGoingDown]);

useEffect(() => {
    if(!matterGoingDown) {
        return;
    }
    const onAnimReached = () => {cameraControllerRef.current?.setLookAt(0,1.4,0.4,0,1.4,0,true);};
    const event_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
    const event_name = "matter_going_down_2";
    const onEmitted = onAnimReached;
    const onReceived = onAnimReached;
    matterGoingDown.addScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
    //
    return () => matterGoingDown.removeScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
}, [matterGoingDown]);


useEffect(() => {
    if(!matterGoingDown) {
        return;
    }
    const onAnimReached = () => {cameraControllerRef.current?.setLookAt(0.2,0.9,0.4,0.2,0.9,0,true);};
    const event_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
    const event_name = "matter_going_down_3";
    const onEmitted = onAnimReached;
    const onReceived = onAnimReached;
    matterGoingDown.addScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
    //
    return () => matterGoingDown.removeScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
}, [matterGoingDown]);


const { entity: stopMatterGoingDown } = useEntity({
    euid: "cf152fca-b15c-40fe-b530-4c41fbe9c2e4",
});

useEffect(() => {
    if(!stopMatterGoingDown) {
        return;
    }
    const onAnimReached = () => {cameraControllerRef.current?.setLookAt(0.3,0.5,0.4,0.3,0.5,0,true);};
    const event_map_id = "75aa01b4-d1a0-482f-bf95-c16e4feb969b";
    const event_name = "camera_bidon";
    const onEmitted = onAnimReached;
    const onReceived = onAnimReached;
    stopMatterGoingDown.addScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
    //
    return () => stopMatterGoingDown.removeScriptEventListener({ event_map_id, event_name, onReceived, onEmitted });
}, [stopMatterGoingDown]);

 //#endregion
    //allMachineAnimations["V18_open"] =  { key: "V18_open", animationController: v18Anim_open! };
    //#endregion
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
                    
        setMachineStateDatas();


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

    setMachineStateDatas();


    //#endregion

    const { cameraEntity } = useCameraEntity();

    const { entities } = useEntities({ mandatory_components: ["label"] }, [

        "label",

    ]);
    //#region Gestion des labels
    const cameraControllerRef = useRef<DefaultCameraController>(null);
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



function resetMachineToStart(){

    AnimationHelper.launchAnim(bac_de_retention_out);
    AnimationHelper.launchAnim(bidon_10L_V15_out);
    AnimationHelper.launchAnim(bidon_10L_V12_out);
    AnimationHelper.launchAnim(bidon_20L_out);
    AnimationHelper.closeAnim(bells_on);
    AnimationHelper.closeAnim(fill_bouilleur);
    AnimationHelper.closeAnim(heat_boiler);
    AnimationHelper.closeAnim(bidon_10L_V15_in);
    AnimationHelper.closeAnim(bidon_20L_in);
    AnimationHelper.closeAnim(screen_glow);
    AnimationHelper.launchAnim(v16_out);
    AnimationHelper.launchAnim(v8_out)
    updateIhmDto('isLSL1ok',false)
    updateIhmDto("TT2Value",0)
    updateIhmDto("TT3Value",0)
    updateIhmDto("TT4Value",0)
    updateIhmDto("TT5Value",0)
    updateIhmDto("bouilleurRate",0)
    updateIhmDto("refluxRate",0)
    updateIhmDto("waterLevel",0)
    updateIhmDto("prechauffeValue",0)
    
    setDpic(0);
    setStatusP1(false);
    setIsBouilleurOn(false);
}

async function prepareGlobalAnimationThenStart(){
    // 1°) Preparing all the scene
    resetMachineToStart();
    
    // 2°) wait before go the 1st camera placement
    setTimeout(() => startGlobalAnimation(),3000);
    //moveAndOpenV15();
}

async function startGlobalAnimation(){
    // 1°) Start position facing bac de retention
    cameraControllerRef.current?.setLookAt(0.3,1.1,1.3,0.3,0,0,true);
    // 2°) Launching bac placement animation
    setTimeout(() => launchBacInAnimation(),1500);
}
async function launchBacInAnimation(){
    AnimationHelper.launchAnim(bac_de_retention_in);
    setTimeout(() => launchBidonV12Animation(),1000);
}
async function launchBidonV12Animation(){
    AnimationHelper.launchAnim(bidon_10L_V12_in);
    setTimeout(() => launchBidonV15Animation(),1000);
}
async function launchBidonV15Animation(){
    AnimationHelper.launchAnim(bidon_10L_V15_in);
    setTimeout(() => launchBidon20LAnimation(),1000);
}
async function launchBidon20LAnimation(){
    AnimationHelper.launchAnim(bidon_20L_in);
    setTimeout(() => moveCameraToV16(),2000);
}
async function moveCameraToV16(){
    cameraControllerRef.current?.setLookAt(0,1,0.7,0.5,1,0,true);
    setTimeout(() => launchV16OpenAnimation(),2000);
}
async function launchV16OpenAnimation(){
    AnimationHelper.launchAnim(v16_in);
    setTimeout(() => moveCameraToIHMAndChangeWaterLevel(),2000);
}

async function moveCameraToIHMAndChangeWaterLevel(){
    cameraControllerRef.current?.setLookAt(0.65,1.5,1,0.65,1.5,0,true);
    setTimeout(() => showIHMAndSetWaterLevel(),2000);
}

async function showIHMAndSetWaterLevel(){
    setIsIHMModalVisible(true);
    
    setTimeout(() => updateIhmDto("highlighted","water"),1000);
    setTimeout(() => updateIhmDto("waterLevel",1),1500);
    setTimeout(() => updateIhmDto("waterLevel",15),2000);
    setTimeout(() => updateIhmDto("waterLevel",150),2500);
    setTimeout(() => setIsIHMModalVisible(false),4000);
    setTimeout(() => moveToV2(),5000);
}

async function moveToV2(){
    cameraControllerRef.current?.setLookAt(-0.4,1.8,0.6,-0.4,1.8,0,true);
    setTimeout(() => openV2(),1500);
}

async function openV2(){
    AnimationHelper.launchAnim(v2_in);
    setTimeout(() => moveCameraToIHMAndChangeP1(),2000);
}
async function moveCameraToIHMAndChangeP1(){
    cameraControllerRef.current?.setLookAt(0.65,1.5,1,0.65,1.5,0,true);
    setTimeout(() => showIHMAndSetP1(),2000);
}
async function showIHMAndSetP1(){
    setIsIHMModalVisible(true);
    setTimeout(() => updateIhmDto("waterLevel",150),2500);
    setTimeout(() => updateIhmDto("highlighted","statutP1"),1000);
    setTimeout(() => setStatusP1(true),2000);
    setTimeout(() => updateIhmDto("highlighted","feed"),3500);
    setTimeout(() => updateIhmDto("p1Value",5),4500);
    setTimeout(() => updateIhmDto("p1Value",50),5200);
    setTimeout(() => updateIhmDto("highlighted","lsl1"),6700);
    setTimeout(() => setIsIHMModalVisible(false),8500);
    setTimeout(() => launchFillBoilerAnimAndShowLsl1(),9000);
}

async function launchFillBoilerAnimAndShowLsl1(){
    setTimeout(() =>  cameraControllerRef.current?.setLookAt(-0.15,1,0.5,-0.15,1,0,true));
    setTimeout(() => AnimationHelper.launchAnim(fill_bouilleur),2000);
    setTimeout(() => setIsIHMModalVisible(true),6000);
    setTimeout(() => updateIhmDto("highlighted","lsl1"),6700);
    setTimeout(() => updateIhmDto("isLSL1ok",true),7500);
    setTimeout(() => setRefluxValues(),9000);

}

async function setRefluxValues(){
    // setTimeout(() => setHighlighted("refluxType"),1000);
    setTimeout(() => setrefluxType("MANU"),2500);
    // setTimeout(() => setrefluxRate(1),4000);
    // setTimeout(() => setrefluxRate(10),4500);
    // setTimeout(() => setrefluxRate(100),5500);
    setTimeout(() => setP1StatusAndBoiler(),7500);
}

async function setP1StatusAndBoiler(){
    // setTimeout(() => setHighlighted("statutP1"),1000);
    setTimeout(() => setStatusP1(false),2500);
    // setTimeout(() => setHighlighted("bouilleurStatus"),4000);
    setTimeout(() => setIsBouilleurOn(true),6000);
    // setTimeout(() => setHighlighted("bouilleurRate"),7500);
    // setTimeout(() => setBouilleurRate(5),8500);
    // setTimeout(() => setBouilleurRate(50),9000);
    setTimeout(() => setIsIHMModalVisible(false),10500);
    setTimeout(() => AnimationHelper.launchAnim(heat_boiler),11000);
    setTimeout(() => launchBellAnimAndMoveCamera(),13000);
}

async function launchBellAnimAndMoveCamera(){
    AnimationHelper.launchAnim(bells_on);
    setTimeout(() =>  cameraControllerRef.current?.setLookAt(-0.15,1.3,0.5,-0.15,1.3,0,true));
    setTimeout(() => showIHMAndUpdateTT(),3000);
}
async function showIHMAndUpdateTT(){
    setTimeout(() => setIsIHMModalVisible(true),1000);
    // setTimeout(() => setHighlighted("TT"),1500);
    // setTimeout(() => setTT2Value(50),3000);
    // setTimeout(() => setTT3Value(50),3000);
    // setTimeout(() => setTT4Value(50),3000);
    // setTimeout(() => setTT5Value(50),3000);

    // setTimeout(() => setTT2Value(80),3500);
    // setTimeout(() => setTT3Value(75),3500);
    // setTimeout(() => setTT4Value(70),3500);
    // setTimeout(() => setTT5Value(65),3500);

    // setTimeout(() => setTT2Value(85),4000);
    // setTimeout(() => setTT3Value(80),4000);
    // setTimeout(() => setTT4Value(75),4000);
    // setTimeout(() => setTT5Value(70),4000);
    
    // setTimeout(() => setTT2Value(95),4500);
    // setTimeout(() => setTT3Value(92),4500);
    // setTimeout(() => setTT4Value(89),4500);
    // setTimeout(() => setTT5Value(85),4500);
    setTimeout(() => setIsIHMModalVisible(false),6500);
    setTimeout(() => moveToV8(), 7500);
}

async function moveToV8(){
    setTimeout(() =>  cameraControllerRef.current?.setLookAt(-0.1,0.5,0.5,-0.1,0.5,0,true),1000);
    setTimeout(() => AnimationHelper.launchAnim(v8_in),2000);
    setTimeout(() => showIHMAndSetP1_2(),4500);
}

async function showIHMAndSetP1_2(){
    setIsIHMModalVisible(true);
    // setTimeout(() => setHighlighted("prechauffe"),1000);
    // setTimeout(() => setPrechauffeValue(9),2000);
    // setTimeout(() => setPrechauffeValue(95),3000);
    setTimeout(() => SetDpic(),4000);
}

async function SetDpic(){
    // setTimeout(() => setHighlighted("dpic"),1000);
    setTimeout(() => setDpic(1),2000);
    setTimeout(() => setDpic(13),2500);
    setTimeout(() => setIsIHMModalVisible(false),3500);
    setTimeout(() => moveToBidonV15(),4000);
}

async function moveToBidonV15(){
    setTimeout(() =>  cameraControllerRef.current?.setLookAt(0.3,0.7,0.6,0.3,0.7,0,true),1000);
    setTimeout(() => AnimationHelper.launchAnim(fill_bidon_1L_V15),2000);
    setTimeout(() => moveAndOpenV15(),5000);
}

async function moveAndOpenV15(){
    setTimeout(() =>  cameraControllerRef.current?.setLookAt(0.3,0.5,0.6,0.3,0.5,0,true),1000);
    setTimeout(() => AnimationHelper.launchAnim(v15_in),2000);
    setTimeout(() => AnimationHelper.launchAnim(empty_bidon_1L_V15),4000);
    setTimeout(() =>  cameraControllerRef.current?.setLookAt(0.3,0.5,0.6,0.3,0.4,0,true),7000);
    setTimeout(() => AnimationHelper.launchAnim(fill_bidon_10L_V15),7800);
    setTimeout(() => AnimationHelper.launchAnim(v15_out),9000);
}

    
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
            return statusP1 == expectedValue;
        case "refluxType":
            return refluxType == expectedValue;
        case "refluxRate":
            return ihmDto.refluxRate == expectedValue;
        case "isBouilleurOn":
            return isBouilleurOn == expectedValue;
        case "bouilleurRate":
            return ihmDto.bouilleurRate == expectedValue;
        case "dpic":
            return dpic == expectedValue;
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
                    isDebugMode && (
                    <div className={`absolute top-[2vh] left-[2vh]`}>
                        <MachineState
                            machineStateDto={machineStateDto}
                        />
                    </div>
                    )
                }
                {/* Erreurs */}
                {
                    (isDebugMode && rulesResult.filter(r => r.result === "Echec").length > 0) && (
                        
                    <div className={`absolute top-[2vh] right-[2vh]`}>
                        
                        <div className="titleDiv">
                            <b>Erreur(s) :</b>
                            
                        </div>
                        
                        <div className="contentDiv">
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
                                    <p>État : <b>{r.result}</b></p>
                                    <p>Msg : {r.errorMessage}</p>
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
                    !isDebugMode && (
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
                {
                    !isDebugMode && (
                        <>
                        <div className={`absolute bottom-[10vh] right-[58vh]`}>
                            <button id="exerciseBtn" onClick={prepareGlobalAnimationThenStart}>LANCER ANIMATION</button>
                        </div>
                         <div className={`absolute bottom-[10vh] right-[38vh]`}>
                            <button id="exerciseBtn" onClick={resetMachineToStart}>RESET ANIMATION</button>
                        </div>
                        </>
                    )
                }
                {
                    !isIHMModalVisible ?
                    ("")
                    :
                    (
                        <div className={`absolute top-[25vh] left-[70vh]`}>
                            <IHM
                            dto={ihmDto}
                            />
                        </div>
                    )
                }
                
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
}

// function replaceCamera(cameraController : DefaultCameraController | null){
    
//     cameraController?.setLookAt(0,1.3,2.5,0,1.3,0,true);
// }
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