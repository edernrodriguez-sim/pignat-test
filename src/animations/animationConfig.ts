import type { Entity } from "@3dverse/livelink";
import { AnimationHelper } from "../animationHelper";
import type { AnimationEntities } from "../models/animations/animationEntities";

type AnimResolver = (
  entities: AnimationEntities,
  newValue: string | number | boolean
) => void;

/**
 * Map permettant de savoir quelle animation lancer en fonction de la valeur du paramètre
 * e: animationEntities contenant toutes les AnimationTypes
 * v: booleen indiquant l'état du paramètre
 */
export const ANIM_MAP: Record<string, AnimResolver> = {
  // Cas spéciaux (launchAnim/closeAnim différents)
  ZS01: (e, v) => AnimationHelper.launchAnim(v ? e.bac_de_retention_in : e.bac_de_retention_out),
  LSH01: (e, v) => AnimationHelper.closeAnim(v ? e.empty_bidon_1L_V12 : e.fill_bidon_1L_V12),
  LSH02: (e, v) => AnimationHelper.closeAnim(v ? e.empty_bidon_1L_V15 : e.fill_bidon_1L_V15),
  ARU: (e, v) => AnimationHelper.launchAnim(v ? e.aru_in : e.aru_out),
  LSL01: (e, v) => AnimationHelper.launchAnim(v ? e.boilerEmptying : e.fill_bouilleur_continu),
  LSL02: (e, v) => AnimationHelper.launchAnim(v ? e.empty_prechauffeur_fill : e.prechauffeur_fill),

  // Vannes — pattern uniforme
  ...Object.fromEntries(
    ["V2","V3","V4","V5","V6","V7","V8","V9","V11","V12","V14","V15","V16"].map(
      (v) => [
        v,
        (e: AnimationEntities, newValue: boolean) => {
           const key = `${v.toLowerCase()}_${newValue ? "out" : "in"}` as keyof AnimationEntities;
          AnimationHelper.launchAnim(e[key] as Entity);
        }
      ]
    )
  ),
};