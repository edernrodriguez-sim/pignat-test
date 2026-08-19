import { AnimationHelper } from "./animationHelper";
import type { AnimDiscontinuDto } from "./models/animations/animDiscontinuDto";
import type { IHMDto } from "./models/IHMDto";
import { ProjectConstants } from "./projectConstants";

export function LaunchAnimationCompleteDiscontinue({ input } : { input : AnimDiscontinuDto }){

    AnimationHelper.launchAnim(input.animationEntities.bidon_20L_flexible_out)
    
    AnimationHelper.launchAnim(input.animationEntities.hide_bells_bulles);
    AnimationHelper.launchAnim(input.animationEntities.soutirage_off);
    AnimationHelper.closeAnim(input.animationEntities.fill_bouilleur_continu);
    AnimationHelper.closeAnim(input.animationEntities.complete_water_flow);
    AnimationHelper.closeAnim(input.animationEntities.v8_out);
    AnimationHelper.closeAnim(input.animationEntities.v4_out);
    AnimationHelper.closeAnim(input.animationEntities.v3_out);
    AnimationHelper.closeAnim(input.animationEntities.v2_out);
    // 1°) Start position facing bac de retention
    input.cameraControllerRef.current?.setLookAt(0.3,1.1,1.3,0.3,0,0,true);
    // 2°) Launching bac placement animation
    setTimeout(() => launchBacInAnimation(),2500);

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
    setTimeout(() => moveCameraAndCloseV2(),1000);
}

async function moveCameraAndCloseV2(){
    input.cameraControllerRef.current?.setLookAt(-0.8,1.7,0.15,-0.35,1.7,0,true)
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v2_out),1500);
    setTimeout(() => moveCameraAndCloseV3(),4000);
}
async function moveCameraAndCloseV3(){
    input.cameraControllerRef.current?.setLookAt(-0.35,1.5,0.6,-0.35,1.5,0,true)
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v3_out),1500);
    setTimeout(() => moveCameraAndCloseV4(),4000);
}
async function moveCameraAndCloseV4(){
    input.cameraControllerRef.current?.setLookAt(-0.4,1.4,0.6,-0.4,1.4,0,true)
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v4_out),1500);
    setTimeout(() => moveCameraAndCloseV8(),4000);
}
async function moveCameraAndCloseV8(){
    input.cameraControllerRef.current?.setLookAt(0.2,0.4,0.6,-0.1,0.4,0,true)
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v8_out),1500);
    setTimeout(() => moveCameraToV16(),4000);
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
    
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_FIC02_BUTTON_ID, input),1500);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_REGULATOR_AUTO_BUTTON_ID, input),3000);
    setTimeout(() => focusOnInput(ProjectConstants.IHM_KEYS_REGULATOR_SP_INPUT_ID, input),4000);
    setTimeout(() => changeInput (ProjectConstants.IHM_KEYS_REGULATOR_SP_INPUT_ID,"150", input ),5000);
    setTimeout(() => validateParameterEditModal(input), 6000);
    setTimeout(() => input.setIsIHMModalVisible(false),8000);
    setTimeout(() => showRisingWaterLevelSimulation(),8000);
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
    input.cameraControllerRef.current?.setLookAt(0,0.4,-0.7,0,0.5,0,true);
    setTimeout(() => moveToCapAndLaunchAnim(),7000);
}


async function moveToCapAndLaunchAnim(){
    input.cameraControllerRef.current?.setLookAt(-0.15,1,0.6,-0.15,1,0,true);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.bouchon_in), 1000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.fill_bouilleur_discontinu), 3000);
    setTimeout(() => input.updateIhmDto("LSL01",false),4000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.bouchon_out), 7500);
    setTimeout(() => setRefluxValues(),11000);
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

    // setTimeout(() => input.updateIhmDto("highlighted","refluxType"),1000);
    // setTimeout(() => input.updateIhmDto("refluxType","MANU"),2500);
    // setTimeout(() => input.updateIhmDto("refluxRate",1),4000);
    // setTimeout(() => input.updateIhmDto("refluxRate",10),4500);
    // setTimeout(() => input.updateIhmDto("refluxRate",100),5000);
    // setTimeout(() => input.updateIhmDto("refluxRate",100),5000);
    setTimeout(() => input.setIsIHMModalVisible(false),9500);
    setTimeout(() => moveCameraToBobine(),10500);
}

// Bobine
async function moveCameraToBobine(){
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.soutirage_off), 100);
    input.cameraControllerRef.current?.setLookAt(-0.1,2.2,0.5,-0.1,2.2,0,true);
    setTimeout(() => setP1StatusAndBoiler(), 3000);
}

async function setP1StatusAndBoiler(){
    input.cameraControllerRef.current?.setLookAt(-0.15,1,0.6,-0.15,1,0,true);
    setTimeout(() => input.setIsIHMModalVisible(true),1000);

    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_H2_BUTTON_ID, input) ,2000);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_BOOL_BUTTON_ON_ID, input) ,3000);
    setTimeout(() => validateParameterEditModal(input) ,5000);
    setTimeout(() => setDPICValues(),6000);
}

async function setDPICValues(){
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_DPIC01_BUTTON_ID, input),1000);
    setTimeout(() => focusOnInput(ProjectConstants.IHM_KEYS_REGULATOR_OP_MAN_INPUT_ID, input),2500);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REGULATOR_OP_MAN_INPUT_ID, "7", input),4000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REGULATOR_OP_MAN_INPUT_ID, "70", input),4500);
    setTimeout(() => validateParameterEditModal(input),6500);
    setTimeout(() => input.setIsIHMModalVisible(false),7500);
    setTimeout(() => showBullageBouilleur(),8500);
}

async function showBullageBouilleur(){
    AnimationHelper.launchAnim(input.animationEntities.vapeur_on)
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.heat_boiler),1000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.bouilleur_bullage),1000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.show_bulles_bouilleur),2500);
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(0.05,1.1,0.5,-0.15,1,0,true),3500);
    setTimeout(() => moveToDropsAndLaunchAnim(),5500);
}

async function moveToDropsAndLaunchAnim(){
    input.cameraControllerRef.current?.setLookAt(-0.2,2.25,0.4,-0.1,2.25,0,true);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.soutirage_off), 100);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.goutte_drop_cycle_on),1000);
    setTimeout(() => moveToBellPosition1AndLaunchAnim(),5000);
}

async function moveToBellPosition1AndLaunchAnim(){
    setTimeout(() => showIHMAndUpdateTT(),1000);
    input.cameraControllerRef.current?.setLookAt(-0.1,1.25,0.5,-0.1,1.25,0,true);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.show_bells_bulles_one_by_one),1000);
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(0.45,2.4,1.1,0.45,2.4,0,true),8000);
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(-0.1,1.6,0.5,-0.1,1.6,0,true),12000);
    setTimeout(() => SetDpic(),15000);
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


async function SetDpic(){
    input.setIsIHMModalVisible(true)
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_DPIC01_BUTTON_ID, input),1000);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_REGULATOR_AUTO_BUTTON_ID, input),2500);
    setTimeout(() => focusOnInput(ProjectConstants.IHM_KEYS_REGULATOR_SP_INPUT_ID, input),2500);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REGULATOR_SP_INPUT_ID, "1", input),4000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REGULATOR_SP_INPUT_ID, "14", input),4500);
    setTimeout(() =>  validateParameterEditModal(input) ,6000);
    setTimeout(() => setRefluxValues33(),3000);
}

async function setRefluxValues33(){
    input.setIsIHMModalVisible(true)
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_EV_MODE_BUTTON_ID, input),2500);
    setTimeout(() => pressIHMButton(ProjectConstants.IHM_KEYS_REFLUX_BUTTON_CYCLE_ID, input),4000);
    setTimeout(() => focusOnInput(ProjectConstants.IHM_KEYS_REFLUX_INPUT_ID, input),5000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REFLUX_INPUT_ID,"6", input),6000);
    setTimeout(() => changeInput(ProjectConstants.IHM_KEYS_REFLUX_INPUT_ID,"66", input),6500);
    setTimeout(() => validateParameterEditModal(input),8000);
    
    setTimeout(() => input.setIsIHMModalVisible(false),9000);
    setTimeout(() => moveCameraToBobineAndLaunchCycleAnim(),10000);
}
async function moveCameraToBobineAndLaunchCycleAnim(){
    setTimeout(() => AnimationHelper.closeAnim(input.animationEntities.soutirage_cycle), 100);
    input.cameraControllerRef.current?.setLookAt(-0.1,2.2,0.5,-0.1,2.2,0,true);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.soutirage_cycle), 1000);
    setTimeout(() => moveToSoutiragePositions(), 3000);
}

async function moveToSoutiragePositions(){
    input.cameraControllerRef.current?.setLookAt(0.1,2,0.5,0.1,2,0,true);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.1,1.7,0.5,0.1,1.7,0,true), 3000);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.1,1.3,0.5,0.1,1.3,0,true), 6000);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.3,0.9,0.5,0.3,0.9,0,true), 9000);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.3,0.5,0.6,0.3,0.5,0,true), 11000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.fill_bidon_1L_V15), 12000);
    setTimeout(() =>  moveToBidonV15(), 16000);
}
async function moveToBidonV15(){
    setTimeout(() => moveAndOpenV15(),2000);
}

async function moveAndOpenV15(){
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v15_in),2000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.liquide_falling_bidon_1L_V15_in),2500)
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.empty_bidon_1L_V15),4000);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.3,0.5,0.6,0.3,0.4,0,true),7000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.fill_bidon_10L_V15),6200);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v15_out),9000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.liquide_falling_bidon_1L_V15_out),9100);
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