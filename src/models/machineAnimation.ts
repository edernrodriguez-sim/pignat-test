import { type Entity } from "@3dverse/livelink";
export class MachineAnimation {
    key:string;
    animationController:Entity;
  constructor(key : string, animationController : Entity) {
    this.key = key;
    this.animationController = animationController;
  }
}