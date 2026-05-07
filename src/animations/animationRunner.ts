import type { MachineUpdate } from "../hooks/useMqttMachineSync";
import type { AnimationEntities } from "../models/animations/animationEntities";
import { ANIM_MAP } from "./animationConfig";

export function applyMachineUpdates(
  updates: MachineUpdate[],
  entities: AnimationEntities | null
) {
  if (!entities) return;

  updates.forEach(({ key, newValue }) => {
    const resolver = ANIM_MAP[key];
    if (resolver) resolver(entities, newValue);
    else console.warn(`Clé inconnue dans ANIM_MAP : ${key}`);
  });
}