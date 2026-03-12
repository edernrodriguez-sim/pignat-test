import { AnimationHelper } from "./animationHelper";
import type { AnimDiscontinuDto } from "./models/animations/animDiscontinuDto";

export function LaunchAnimationCompleteDiscontinue({ input } : { input : AnimDiscontinuDto }){

    AnimationHelper.launchAnim(input.animationEntities.bidon_20L_flexible_out)
    
    AnimationHelper.launchAnim(input.animationEntities.hide_bells_bulles);
    AnimationHelper.launchAnim(input.animationEntities.soutirage_off);
    AnimationHelper.closeAnim(input.animationEntities.fill_bouilleur_continu);
    AnimationHelper.closeAnim(input.animationEntities.complete_water_flow);
    // 1°) Start position facing bac de retention
    input.cameraControllerRef.current?.setLookAt(0.3,1.1,1.3,0.3,0,0,true);
    // 2°) Launching bac placement animation
    setTimeout(() => launchBacInAnimation(),2000);
    //moveToDropsAndLaunchAnim();

async function launchBacInAnimation(){
    AnimationHelper.launchAnim(input.animationEntities.bac_de_retention_in);
    setTimeout(() =>  AnimationHelper.pauseAnim(input.animationEntities.bac_de_retention_in),850);
    setTimeout(() => launchBidonV12Animation(),1000);
}
async function launchBidonV12Animation(){
    AnimationHelper.launchAnim(input.animationEntities.bidon_10L_V12_in);
    setTimeout(() =>  AnimationHelper.pauseAnim(input.animationEntities.bidon_10L_V12_in),850);
    setTimeout(() => launchBidonV15Animation(),1000);
}
async function launchBidonV15Animation(){
    AnimationHelper.launchAnim(input.animationEntities.bidon_10L_V15_in);
    setTimeout(() =>  AnimationHelper.pauseAnim(input.animationEntities.bidon_10L_V15_in),850);
    setTimeout(() => launchBidon20LAnimation(),1000);
}
async function launchBidon20LAnimation(){
    AnimationHelper.launchAnim(input.animationEntities.bidon_20L_in);
    setTimeout(() =>  AnimationHelper.pauseAnim(input.animationEntities.bidon_20L_in),850);
    setTimeout(() => moveCameraToV16(),2000);
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
    
    setTimeout(() => input.updateIhmDto("highlighted","water"),1000);
    setTimeout(() => input.updateIhmDto("waterLevel",1),1500);
    setTimeout(() => input.updateIhmDto("waterLevel",15),2000);
    setTimeout(() => input.updateIhmDto("waterLevel",150),2500);
    setTimeout(() => input.setIsIHMModalVisible(false),4000);
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
    setTimeout(() => setRefluxValues(),8000);
}

async function setRefluxValues(){
    input.setIsIHMModalVisible(true)
    setTimeout(() => input.updateIhmDto("highlighted","refluxType"),1000);
    setTimeout(() => input.updateIhmDto("refluxType","MANU"),2500);
    setTimeout(() => input.updateIhmDto("refluxRate",1),4000);
    setTimeout(() => input.updateIhmDto("refluxRate",10),4500);
    setTimeout(() => input.updateIhmDto("refluxRate",100),5000);
    setTimeout(() => input.updateIhmDto("refluxRate",100),5000);
    setTimeout(() => input.setIsIHMModalVisible(false),6000);
    setTimeout(() => moveCameraToBobine(),7000);
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
    setTimeout(() => input.updateIhmDto("highlighted","bouilleurStatus") ,4000);
    setTimeout(() => input.updateIhmDto("isBouilleurOn",true),6000);
    setTimeout(() => input.updateIhmDto("highlighted","bouilleurRate"),7500);
    setTimeout(() => input.updateIhmDto("bouilleurRate",5),8500);
    setTimeout(() => input.updateIhmDto("bouilleurRate",50),9000);
    setTimeout(() => input.setIsIHMModalVisible(false),10500);
    setTimeout(() => showBullageBouilleur(),10500);
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
    input.cameraControllerRef.current?.setLookAt(-0.1,1.25,0.5,-0.1,1.25,0,true);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.show_bells_bulles_one_by_one),1000);
    setTimeout(() => input.cameraControllerRef.current?.setLookAt(-0.1,1.6,0.5,-0.1,1.6,0,true),12000);
    setTimeout(() => showIHMAndUpdateTT(),15000);
}
async function showIHMAndUpdateTT(){
    setTimeout(() => input.setIsIHMModalVisible(true),1000);
    setTimeout(() => input.updateIhmDto("highlighted","TT") ,1500);
    setTimeout(() => input.updateIhmDto("TT1Value",84) ,3000);
    setTimeout(() => input.updateIhmDto("TT2Value",50) ,3000);
    setTimeout(() => input.updateIhmDto("TT3Value",50) ,3000);
    setTimeout(() => input.updateIhmDto("TT4Value",50) ,3000);
    setTimeout(() => input.updateIhmDto("TT5Value",50) ,3000);
    
    setTimeout(() => input.updateIhmDto("TT2Value",75.3) ,3500);
    setTimeout(() => input.updateIhmDto("TT3Value",71) ,3500);
    setTimeout(() => input.updateIhmDto("TT4Value",67.1) ,3500);
    setTimeout(() => input.updateIhmDto("TT5Value",61.4) ,3500);
    
    setTimeout(() => input.updateIhmDto("TT2Value",78.6) ,4000);
    setTimeout(() => input.updateIhmDto("TT3Value",75.1) ,4000);
    setTimeout(() => input.updateIhmDto("TT4Value",71.2) ,4000);
    setTimeout(() => input.updateIhmDto("TT5Value",70) ,4000);

    setTimeout(() => input.updateIhmDto("TT2Value",80.6) ,4500);
    setTimeout(() => input.updateIhmDto("TT3Value",77) ,4500);
    setTimeout(() => input.updateIhmDto("TT4Value",76.2) ,4500);
    setTimeout(() => input.updateIhmDto("TT5Value",74.6) ,4500);

    setTimeout(() => input.updateIhmDto("TT2Value",81.3) ,5000);
    setTimeout(() => input.updateIhmDto("TT3Value",78) ,5000);
    setTimeout(() => input.updateIhmDto("TT4Value",77.4) ,5000);
    setTimeout(() => input.updateIhmDto("TT5Value",77.2) ,5000);
    setTimeout(() => SetDpic(), 7500);
}

async function SetDpic(){
    setTimeout(() => input.updateIhmDto("highlighted","dpic"),1000);
    setTimeout(() => input.updateIhmDto("dpic",1),2000);
    setTimeout(() => input.updateIhmDto("dpic",13),2500);
    setTimeout(() => setRefluxValues33(),3000);
}

async function setRefluxValues33(){
    input.setIsIHMModalVisible(true)
    setTimeout(() => input.updateIhmDto("highlighted","refluxType"),1000);
    setTimeout(() => input.updateIhmDto("refluxRate",3),2000);
    setTimeout(() => input.updateIhmDto("refluxRate",33),2500);
    setTimeout(() => input.setIsIHMModalVisible(false),4500);
    setTimeout(() => moveCameraToBobineAndLaunchCycleAnim(),7000);
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
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.fill_bidon_1L_V15), 8000);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.3,0.9,0.5,0.3,0.9,0,true), 9000);
    setTimeout(() =>  moveToBidonV15(), 10000);
}
async function moveToBidonV15(){
    setTimeout(() => moveAndOpenV15(),2000);
}

async function moveAndOpenV15(){
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.3,0.5,0.6,0.3,0.5,0,true),1000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v15_in),2000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.liquide_falling_bidon_1L_V15_in),2500)
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.empty_bidon_1L_V15),4000);
    setTimeout(() =>  input.cameraControllerRef.current?.setLookAt(0.3,0.5,0.6,0.3,0.4,0,true),7000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.fill_bidon_10L_V15),6200);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.v15_out),9000);
    setTimeout(() => AnimationHelper.launchAnim(input.animationEntities.liquide_falling_bidon_1L_V15_out),9100);
}
}