import type { DefaultCameraController } from "@3dverse/livelink-react";
import type { RefObject, SetStateAction } from "react";
import type { AnimationEntities } from "./animationEntities";
import type { IHMDto } from "../IHMDto";

export interface AnimDiscontinuDto{
    cameraControllerRef: RefObject<DefaultCameraController | null>;
    animationEntities: AnimationEntities;
    setIsIHMModalVisible: (value: SetStateAction<boolean>) => void;
    updateIhmDto: (key: keyof IHMDto, value: number | string | boolean) => void;
}