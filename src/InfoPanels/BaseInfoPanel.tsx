import { DOM3DDiv } from "@3dverse/livelink-react"
import type { MachineParameter } from "../models/machineParameter";

interface BaseInfoPanelDto {

    xPos: number;
    yPos: number;
    zPos: number;
    label: string;
    machineParam: MachineParameter | null;
    anchor: string;
    width?: number | undefined;
    height?: number | undefined;
    baseColor?: string | undefined;
    _displayLabelOnly?: boolean | undefined;
    
}

function BaseInfoPanel({xPos, yPos, zPos, label, machineParam, anchor, width, height, baseColor, _displayLabelOnly} : BaseInfoPanelDto){

    const defaultLength = 0.22;
    const defaultHeight = 0.15;

    let bottomValue = 0;
    let topValue = 0.15;
    let leftValue = 0;
    let rightValue = 0.15;
    let colorFontClass = "infoPanelBaseColor";
    let valueToShow = "";
    let displayLabelOnly: boolean | undefined;
    function setData(){
        if (!machineParam || machineParam.value == undefined)
            return;

        valueToShow = machineParam.value.toString();
        // Dans le cas des booleens on affiche en vert si la valeur et similaire à la valeur satisfaisante
        // ou si la valeur est true et qu'il n'y a pas de valeur satisfaisante
        if (typeof(machineParam.value) === "boolean"){
            if ((machineParam.satisfyingValue !== undefined && machineParam.satisfyingValue === machineParam.value)
                || (machineParam.satisfyingValue === undefined && machineParam.value === true)){
                colorFontClass = "infoPanelGreenColor";
                valueToShow = "OK";
            }
            else {
                colorFontClass = "infoPanelRedColor";
                valueToShow = "NOK";
            }
        }
        else if (typeof(machineParam.value) === "number")
        {
            valueToShow = machineParam.value.toFixed(2).toString();
        }
        
        if (baseColor != undefined && baseColor.length > 0){
            if (baseColor === "blue"){
                colorFontClass = "infoPanelBlueColor";
            }
        }

        const w =  width == undefined || width <= 0 ? defaultLength : width;
        const h = height == undefined || height <= 0 ? defaultHeight : height;
        if (anchor === "bottom-left")
        {
            leftValue = xPos;
            rightValue = xPos + w;
            bottomValue = yPos;
            topValue = yPos + h;
        }
        else if (anchor === "top-left")
        {
            rightValue = xPos + w;
            leftValue = xPos;
            bottomValue = yPos - h;
            topValue = yPos;
        }
        else if (anchor === "bottom-right")
        {
            rightValue = xPos;
            leftValue = xPos - w;
            bottomValue = yPos;
            topValue = yPos + h;
        }
        else if (anchor === "top-right")
        {
            rightValue = xPos;
            leftValue = xPos - w;
            bottomValue = yPos - h;
            topValue = yPos;
        }


        displayLabelOnly = _displayLabelOnly;
    }

    function addValueUnitIfNeeded(){
        if (!machineParam)
            return;
        
        if (machineParam.unitType !== undefined){
            valueToShow +=  machineParam.unitType;
        }
    }

    setData();
    addValueUnitIfNeeded();

    return(
        
    <DOM3DDiv
        worldQuad={{
            tl: [leftValue, topValue, zPos],
            tr: [rightValue, topValue, zPos],
            bl: [leftValue, bottomValue,zPos],
            br: [rightValue, bottomValue, zPos],
        }}

        className={"fontPad bg-underground text-black  text-md " + colorFontClass}
    >
        <div className="labelFont">{label}</div>
        {
            !displayLabelOnly &&
            (<div  className="valueFont">{valueToShow}</div>)
        }
    </DOM3DDiv>
    )
}

export default BaseInfoPanel