import { AnimationHelper } from "./animationHelper";
import type { AnimDiscontinuDto } from "./models/animations/animDiscontinuDto";
import type { IHMDto } from "./models/IHMDto";
import { ProjectConstants } from "./projectConstants";

export function LaunchAnimationCompleteContinue({ input } : { input : AnimDiscontinuDto }){

    AnimationHelper.launchAnim(input.animationEntities.bidon_20L_flexible_out);
    AnimationHelper.launchAnim(input.animationEntities.hide_bells_bulles);
    AnimationHelper.launchAnim(input.animationEntities.soutirage_off);
    AnimationHelper.closeAnim(input.animationEntities.fill_bouilleur_continu);
    AnimationHelper.closeAnim(input.animationEntities.complete_water_flow);
    // // 1°) Start position facing bac de retention
    input.cameraControllerRef.current?.setLookAt(0.3,1.1,1.3,0.3,0,0,true);
    // // 2°) Launching bac placement animation
    setTimeout(() => launchBacInAnimation(),1500);

async function launchBacInAnimation(){
    AnimationHelper.launchAnim(input.animationEntities.bac_de_retention_in);
    setTimeout(() => launchBidonV12Animation(),1000);
}
async function launchBidonV12Animation(){
    AnimationHelper.launchAnim(input.animationEntities.bidon_10L_V12_in);
    setTimeout(() => launchBidonV15Animation(),1000);
}
async function launchBidonV15Animation(){
    AnimationHelper.launchAnim(input.animationEntities.bidon_10L_V15_in);
    setTimeout(() => launchBidon20LAnimation(),1000);
}
async function launchBidon20LAnimation(){
    AnimationHelper.launchAnim(input.animationEntities.bidon_20L_in);
    setTimeout(() => moveCameraToFlexBidon20L(),2000);
}
async function moveCameraToFlexBidon20L(){
    input.cameraControllerRef.current?.setLookAt(-0.3,0.6,0.9,-0.3,0.5,0,true);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.bidon_20L_flexible_in),1000);
    setTimeout(() => moveCameraToV16(),3000);
}
async function moveCameraToV16(){
    input.cameraControllerRef.current?.setLookAt(0,1,0.7,0.5,1,0,true);
    setTimeout(() => launchV16OpenAnimation(),2000);
}
async function launchV16OpenAnimation(){
    AnimationHelper.launchAnim(input.animationEntities.v16_in);
    setTimeout(() => moveCameraToIHMAndChangeWaterLevel(),2000);
}

async function moveCameraToIHMAndChangeWaterLevel(){
    input.cameraControllerRef.current?.setLookAt(0.65,1.5,1,0.65,1.5,0,true);
    setTimeout(() => showIHMAndSetWaterLevel(),2000);
}

async function showIHMAndSetWaterLevel(){
    input.setIsIHMModalVisible(true);
    if (input.updateNewIhm)
    {
        setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_FIC02_BUTTON_ID, input),1500);
        setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_REGULATOR_AUTO_BUTTON_ID, input),3000);
        setTimeout(() => focusOnInput(ProjectConstants.IHM_KEYS_REGULATOR_SP_INPUT_ID, input),4000);
        setTimeout(() => changeInput (ProjectConstants.IHM_KEYS_REGULATOR_SP_INPUT_ID,"150", input ),5000);
        setTimeout(() => validateParameterEditModal(input), 6000);
        setTimeout(() => input.setIsIHMModalVisible(false), 7000);
        setTimeout(() => showRisingWaterLevelSimulation(),7000);
    }
}

async function showRisingWaterLevelSimulation(){
    input.cameraControllerRef.current?.setLookAt(0.35,1.5,1,0.65,1.5,0,true);
    input.updateIhmDto("FIC02_PV",12);
    setTimeout(() => input.updateIhmDto("FIC02_PV",22.6) ,500);
    setTimeout(() => input.updateIhmDto("FIC02_PV",37.1) ,1000);
    setTimeout(() => input.updateIhmDto("FIC02_PV",53) ,1500);
    setTimeout(() => input.updateIhmDto("FIC02_PV",77) ,2000);
    setTimeout(() => input.updateIhmDto("FIC02_PV",96.7) ,2500);
    setTimeout(() => input.updateIhmDto("FIC02_PV",121.2) ,3000);
    setTimeout(() => input.updateIhmDto("FIC02_PV",144.9) ,3500);
    setTimeout(() => input.updateIhmDto("FIC02_PV",150) ,4000);
    setTimeout(() => moveToFirstWaterPositionAndLaunchAnim(),5000);
}

// Affichage du circuit d'eau
async function moveToFirstWaterPositionAndLaunchAnim(){
    input.cameraControllerRef.current?.setLookAt(0.2,2,0.8,0.4,2,0,true);
    AnimationHelper.closeAnim(input.animationEntities.complete_water_flow);
    AnimationHelper.launchAnim(input.animationEntities.complete_water_flow);
    setTimeout(() => moveToSecondWaterPosition(), 15000);
}

async function moveToSecondWaterPosition(){
    input.cameraControllerRef.current?.setLookAt(0.1,0.4,-0.7,0.2,0.5,0,true);
    setTimeout(() => moveToV4AndOpen(),7000);
}

async function moveToV4AndOpen(){
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(-0.4,1.4,0.6,-0.4,1.4,0,true),500);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v4_in),1500);
    setTimeout(() => moveCameraToIHMAndChangeP1(),4000);
}

async function moveCameraToIHMAndChangeP1(){
    input.cameraControllerRef.current?.setLookAt(0.65,1.5,1,0.65,1.5,0,true);
    setTimeout(() => showIHMAndSetP1(),2000);
}
async function showIHMAndSetP1(){
    input.setIsIHMModalVisible(true);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_P1_BUTTON_ID, input),1500);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_BOOL_BUTTON_ON_ID, input),2500);
    setTimeout(() => validateParameterEditModal(input), 4000);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_P1_SP_REEL_BUTTON_ID, input),5000);
    setTimeout(() => focusOnInput(ProjectConstants.IHM_KEYS_BASIC_INPUT_ID, input),6000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_BASIC_INPUT_ID, "50", input),7000);
    setTimeout(() => validateParameterEditModal(input), 8000);
    setTimeout(() => input.setIsIHMModalVisible(false), 9000);
    setTimeout(() => moveCameraToBidon20L_and_LaunchTubeAnim(),10500);
}

async function moveCameraToBidon20L_and_LaunchTubeAnim(){
    setTimeout(() => moveCameraToBidon20L(),500);
    setTimeout(() => launchTubeAnim_20LToP1(),1000);
}

async function moveCameraToBidon20L(){
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(-0.35,0.6,0.5,-0.35,0.6,0,true));
 
}

async function launchTubeAnim_20LToP1(){
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.tube_bidon20L_to_P1),500);
    setTimeout(() => moveCameraToP1(),4500);
}

async function moveCameraToP1 (){
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(-1,1,0,-0.35,1,0,true));
    setTimeout(() => launchTubeAnim_P1ToPrechauff(),1000);
}

async function launchTubeAnim_P1ToPrechauff(){
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.tube_P1_to_prechauffe),500);
    setTimeout(() => moveCameraToBottomPrechauff(),4500);
}

async function moveCameraToBottomPrechauff(){
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(-0.35,1.8,0.9,-0.35,1.8,0,true),1000);
    setTimeout(() => launchFillPrechauffeur(),1500);
}

async function launchFillPrechauffeur(){
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.prechauffeur_fill),1000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.prechauffeur_horizontal_entry_fill),2000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.prechauffeur_parallel_fill),2500);
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(-0.46,1.95,0.3,-0.4,1.95,0,true),3500);
    setTimeout(() => input.updateIhmDto("LSL02",false),7000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.prechauffeur_fill_horizon_top),7300);
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(-0.46,1.65,0.3,-0.4,1.65,0,true),8500);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.tuyau_post_prechauffage_2),9000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.tuyau_post_prechauffage_3),9500);
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(-0.3,1.25,0.4,-0.3,1.25,0,true),10500);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.tuyau_prechauffage_plateau_1),12000);
    setTimeout(() => launchFillBoilerAnimAndShowLsl1(),14000);
}

async function launchFillBoilerAnimAndShowLsl1(){
    
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(-0.15,1,0.6,-0.15,1,0,true),500);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.fill_bouilleur_continu),1500);
    setTimeout(() => input.updateIhmDto("LSL01",false),5000);
    setTimeout(() => setRefluxValues(), 6000);
}

async function setRefluxValues(){
    input.setIsIHMModalVisible(true)
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_EV_MODE_BUTTON_ID, input),2500);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_REFLUX_BUTTON_REFLUX_ID, input),4000);
    setTimeout(() => focusOnInput(ProjectConstants.IHM_KEYS_REFLUX_INPUT_ID, input),5000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REFLUX_INPUT_ID,"1", input),6000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REFLUX_INPUT_ID,"10", input),6500);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REFLUX_INPUT_ID,"100", input),7000);
    setTimeout(() => validateParameterEditModal(input),8500);
    setTimeout(() => input.setIsIHMModalVisible(false),9500);  
    setTimeout(() => moveCameraToBobine(),10500);
}
// Bobine
async function moveCameraToBobine(){
    setTimeout(() => AnimationHelper.closeAnim(input.animationEntities.soutirage_cycle), 100);
    input.cameraControllerRef.current?.setLookAt(-0.1,2.2,0.5,-0.1,2.2,0,true);
    setTimeout(() => SetH2_ON(), 3000);
}



async function SetH2_ON(){
    input.setIsIHMModalVisible(true)
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_H2_BUTTON_ID, input) ,1000);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_BOOL_BUTTON_ON_ID, input) ,2000);
    setTimeout(() =>  validateParameterEditModal(input) ,4000);
    setTimeout(() =>  input.setIsIHMModalVisible(false) ,5000);
    setTimeout(() => showBullageBouilleur(),6000);
}

async function showBullageBouilleur(){
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.heat_boiler),500);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.bouilleur_bullage),500);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.show_bulles_bouilleur),1000);
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(0.05,1,0.5,-0.15,0.9,0,true),2000);
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(-0.1,0.7,1,-0.1,0.7,0,true),5000);
    setTimeout(() => input.updateIhmDto("TT01",73.2) ,6000);
    setTimeout(() => input.updateIhmDto("TT01",76.7) ,6500);
    setTimeout(() => input.updateIhmDto("TT01",80.5) ,7000);
    setTimeout(() => input.updateIhmDto("TT01",82.1) ,7500);
    setTimeout(() => input.updateIhmDto("TT01",84.2) ,8000);
    AnimationHelper.launchAnim(input.animationEntities.vapeur_on)
    setTimeout(() => moveCameraAndOpenV3(),10000);
}


async function moveCameraAndOpenV3(){
    input.cameraControllerRef.current?.setLookAt(-0.35,1.5,0.6,-0.35,1.5,0,true)
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v3_in),1500);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.tuyau_prechauffage_plateau_2_1),2500);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.tuyau_prechauffage_plateau_2),3000);
    setTimeout(() => moveCameraAndCloseV4(),4000);
}

async function moveCameraAndCloseV4(){
    input.cameraControllerRef.current?.setLookAt(-0.4,1.4,0.6,-0.4,1.4,0,true)
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v4_out),1500);
    setTimeout(() => AnimationHelper.closeAnim(input.animationEntities.tuyau_prechauffage_plateau_1),3000);
    setTimeout(() => showIHMAndReduceSP_REEL(),4000);
}

async function showIHMAndReduceSP_REEL(){
    input.setIsIHMModalVisible(true);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_P1_SP_REEL_BUTTON_ID, input),1000);
    setTimeout(() => focusOnInput(ProjectConstants.IHM_KEYS_BASIC_INPUT_ID, input),2000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_BASIC_INPUT_ID, "2", input),3000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_BASIC_INPUT_ID, "20", input),4000);
    setTimeout(() => validateParameterEditModal(input), 6000);
    setTimeout(() => setDPICValues(),8000);
}



async function setDPICValues(){
    
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_DPIC01_BUTTON_ID, input),1000);
    setTimeout(() => focusOnInput(ProjectConstants.IHM_KEYS_REGULATOR_OP_MAN_INPUT_ID, input),2500);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REGULATOR_OP_MAN_INPUT_ID, "7", input),4000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REGULATOR_OP_MAN_INPUT_ID, "70", input),4500);
    setTimeout(() => validateParameterEditModal(input),6500);
    
    setTimeout(() => input.setIsIHMModalVisible(false),7000);
    setTimeout(() => moveToBellPosition1AndLaunchAnim(),7500);
}


async function moveToBellPosition1AndLaunchAnim(){
    setTimeout(() => showIHMAndUpdateTT(),1000);
    input.cameraControllerRef.current?.setLookAt(-0.1,1.25,0.5,-0.1,1.25,0,true);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.show_bells_bulles_one_by_one),1000);
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(0.45,2.4,1.1,0.45,2.4,0,true),8000);
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(-0.1,1.6,0.5,-0.1,1.6,0,true),12000);
    setTimeout(() => moveToDropsAndLaunchAnim(),14000);
}



async function moveToDropsAndLaunchAnim(){
    input.cameraControllerRef.current?.setLookAt(-0.2,2.25,0.4,-0.1,2.25,0,true);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.soutirage_off), 100);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.goutte_drop_cycle_on),2000);
    setTimeout(() => moveToV8(),5000);
}

async function showIHMAndUpdateTT(){
    updateTempWithTiming("TT02",3,20,83.4);
    updateTempWithTiming("TT03",13,20,80);
    updateTempWithTiming("TT04",21,20,77.5);
    updateTempWithTiming("TT05",29,20,77.2);
}

async function updateTempWithTiming(key: keyof IHMDto, duration: number, baseValue: number, targetValue : number){
 let totalSteps = duration;
 let valueStep = (targetValue - baseValue) / totalSteps;
 let currentValue = baseValue;

 let intervalId = setInterval(() => {
    totalSteps = totalSteps - 1; 
    currentValue = currentValue + valueStep;
    input.updateIhmDto(key,currentValue);


    if(totalSteps <= 0){
        clearInterval(intervalId);
    }
 } , 1000)
}


async function moveToV8(){
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.2,0.5,0.8,-0.1,0.6,0,true),500);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.tuyau_inf_bouilleur_V8),1500);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v8_in),3000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.tuyau_inf_V8_bidon_V12),3500);
    setTimeout(() => showIHMAndSetP1ON_2(),6500);
}


async function showIHMAndSetP1ON_2(){

    input.setIsIHMModalVisible(true);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_P1_BUTTON_ID, input) ,2000);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_BOOL_BUTTON_ON_ID, input) ,4000);
    setTimeout(() =>  validateParameterEditModal(input) ,5000);
    setTimeout(() => SetH1_ON(),6000);
}

async function SetH1_ON(){
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_H1_BUTTON_ID, input) ,1000);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_BOOL_BUTTON_ON_ID, input) ,2000);
    setTimeout(() =>  validateParameterEditModal(input) ,4000);
    setTimeout(() => SetTT06_AutoAndValue(),6000);
}



async function SetTT06_AutoAndValue(){
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_TTC06_BUTTON_ID, input) ,1000);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_REGULATOR_AUTO_BUTTON_ID, input) ,3000);
    setTimeout(() => focusOnInput(ProjectConstants.IHM_KEYS_REGULATOR_SP_INPUT_ID, input) ,3000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REGULATOR_SP_INPUT_ID, "77.4", input) ,5000);
    setTimeout(() =>  validateParameterEditModal(input) ,8000);
    setTimeout(() =>  setDPICValues2() ,9500);
}

async function setDPICValues2(){
    input.setIsIHMModalVisible(true);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_DPIC01_BUTTON_ID, input),1000);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_REGULATOR_AUTO_BUTTON_ID, input),2500);
    setTimeout(() => focusOnInput(ProjectConstants.IHM_KEYS_REGULATOR_SP_INPUT_ID, input),2500);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REGULATOR_SP_INPUT_ID, "1", input),4000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REGULATOR_SP_INPUT_ID, "14", input),4500);
    setTimeout(() =>  validateParameterEditModal(input) ,6000);
    
    setTimeout(() => setRefluxValues2(),4000);
}
async function setRefluxValues2(){
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_EV_MODE_BUTTON_ID, input),2500);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_REFLUX_BUTTON_CYCLE_ID, input),4000);
    setTimeout(() => focusOnInput(ProjectConstants.IHM_KEYS_REFLUX_INPUT_ID, input),5000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REFLUX_INPUT_ID,"6", input),6000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REFLUX_INPUT_ID,"66", input),6500);
    setTimeout(() => validateParameterEditModal(input),8500);
    setTimeout(() => input.setIsIHMModalVisible(false),9500);  
    setTimeout(() => moveCameraToBobineAndLaunchCycleAnim(),10500);
}

async function moveCameraToBobineAndLaunchCycleAnim(){
    setTimeout(() => AnimationHelper.closeAnim(input.animationEntities.soutirage_cycle), 100);
    input.cameraControllerRef.current?.setLookAt(-0.1,2.2,0.5,-0.1,2.2,0,true);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.soutirage_cycle), 1000);
    setTimeout(() => moveToSoutiragePositions(), 3000);
}

async function moveToSoutiragePositions(){
    input.cameraControllerRef.current?.setLookAt(0.1,2,0.5,0.1,2,0,true);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.tuyau_inf_bouilleur_V8),1500);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.tuyau_inf_V8_bidon_V12),2500);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.1,1.7,0.5,0.1,1.7,0,true), 3000);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.1,1.3,0.5,0.1,1.3,0,true), 6000);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.3,0.9,0.5,0.3,0.9,0,true), 9000);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.3,0.5,0.6,0.3,0.5,0,true), 11000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.fill_bidon_1L_V15), 12000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.Remplissage_Recette_Residu),12000);
    setTimeout(() =>  moveAndOpenV15(), 18000);
}

async function moveAndOpenV15(){
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v15_in),2000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.liquide_falling_bidon_1L_V15_in),2500)
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.empty_bidon_1L_V15),4000);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.3,0.5,0.6,0.3,0.4,0,true),7000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.fill_bidon_10L_V15),7000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v15_out),9000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.liquide_falling_bidon_1L_V15_out),9100);
    setTimeout(() => moveAndOpenV12(),11000);
}

async function moveAndOpenV12(){
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.2,0.5,0.6,0.3,0.5,0,true),1000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v12_in),2000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.liquide_falling_bidon_1L_V12_in),2500)
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.empty_bidon_1L_V12),4000);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.2,0.5,0.6,0.3,0.4,0,true),7000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.fill_bidon_10L_V12),7000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v12_out),9000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.liquide_falling_bidon_1L_V12_out),9100);
}
}



function validateParameterEditModal(input : AnimDiscontinuDto){
    input.updateNewIhm!(ProjectConstants.IHM_KEYS_PARAM_CONFIRM_BUTTON_ID,true);
}

function pressIHMButton(id: string, input : AnimDiscontinuDto){
    input.updateNewIhm!(id,true);
}

function focusOnInput(id: string, input : AnimDiscontinuDto) {
    input.updateNewIhm!(id ,false);
}

function changeInput(id: string, value: string, input: AnimDiscontinuDto) {
    input.updateNewIhm!(id ,false, value);
}