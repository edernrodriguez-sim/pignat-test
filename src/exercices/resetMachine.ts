import { AnimationHelper } from "../animationHelper";
import type { AnimationEntities } from "../models/animations/animationEntities";

export default function ResetMachine(animationEntities: AnimationEntities | null){
    console.log("ResetMachine");
    console.log(animationEntities);
    if (!animationEntities)
        return;
    AnimationHelper.launchAnim(animationEntities.bac_de_retention_out);
    AnimationHelper.launchAnim(animationEntities.v2_out);
    AnimationHelper.launchAnim(animationEntities.v3_out);
    AnimationHelper.launchAnim(animationEntities.v4_out);
    AnimationHelper.launchAnim(animationEntities.v5_out);
    AnimationHelper.launchAnim(animationEntities.v6_out);
    AnimationHelper.launchAnim(animationEntities.v7_out);
    AnimationHelper.launchAnim(animationEntities.v8_out);
    AnimationHelper.launchAnim(animationEntities.v9_out);
    AnimationHelper.launchAnim(animationEntities.v11_out);
    AnimationHelper.launchAnim(animationEntities.v12_in);
    AnimationHelper.launchAnim(animationEntities.v14_out);
    AnimationHelper.launchAnim(animationEntities.v15_in);
    AnimationHelper.launchAnim(animationEntities.v16_out);
    AnimationHelper.launchAnim(animationEntities.hide_bells_bulles);
    AnimationHelper.launchAnim(animationEntities.hide_bulles_bouilleur);
    AnimationHelper.launchAnim(animationEntities.bidon_20L_out);
    AnimationHelper.launchAnim(animationEntities.bidon_20L_flexible_out);
}