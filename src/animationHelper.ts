import type { Entity } from "@3dverse/livelink";

export class AnimationHelper {
    public static animationCloseKeyWord = "_close";
    public static animationOpenKeyWord = "_open";
    public static animationGlowKeyWord = "_glow";
    public static animationStopGlowKeyWord = "_stopGlow";
    public static animationMoveKeyWord = "_move";
    public static animationOtherKeyWord = "_other";
    
    public static launchAnim(animToLaunch: Entity | undefined | null){
        console.log("Launch animatio : " + animToLaunch?.name);
        if (animToLaunch !== undefined && animToLaunch !== null){
            const controller = animToLaunch.animation_sequence_controller!;
            controller.playbackSpeed = 1;
            controller.seekOffset = 0;
            controller.playState = 0;
            controller.playState = 1;
        }
    }

     public static pauseAnim(animToLaunch: Entity | undefined | null){
        console.log("Pause anim : " + animToLaunch?.name);
        if (animToLaunch !== undefined && animToLaunch !== null){
            const controller = animToLaunch.animation_sequence_controller!;
            controller.playState = 2;
        }
    }

    public static closeAnim(animToLaunch: Entity | undefined | null){
        console.log("Close anim : " + animToLaunch?.name);
        if (animToLaunch !== undefined && animToLaunch !== null){
            const controller = animToLaunch.animation_sequence_controller!;
            controller.seekOffset = 0;
            controller.playState = 0;
        }
    }


    public static getAnimationName(entityName : string, animationType : AnimationTypes) : string {
        switch (animationType){
            case AnimationTypes.open:
                return entityName + this.animationOpenKeyWord;
            case AnimationTypes.close:
                return entityName + this.animationCloseKeyWord;
            case AnimationTypes.glow:
                return entityName + this.animationGlowKeyWord;
            case AnimationTypes.stopGlow:
                return entityName + this.animationStopGlowKeyWord;
            case AnimationTypes.move:
                return entityName + this.animationMoveKeyWord;
            case AnimationTypes.other:
                return entityName + this.animationOtherKeyWord;
        }
    }
}

export enum AnimationTypes {
        open = "open",
        close = "close",
        glow = "glow",
        stopGlow = "stopGlow",
        move = "move",
        other = "other"
    }