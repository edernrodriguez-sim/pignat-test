import type { Entity, Livelink } from "@3dverse/livelink";
import type { DefaultCameraController } from "@3dverse/livelink-react";
import { useEffect, useRef } from "react";
import { AnimationHelper } from "../animationHelper";

/**
 * 
 * Fonction gérant la récupération des triggers envoyés par les animations
 * @param cameraControllerRef 
 * @param entities 
 */
export function useBehaviourOnAnimationTrigger(
    cameraControllerRef: React.RefObject<DefaultCameraController | null>,
    entities: {
        instance: Livelink | null;
        dropParent: Entity | null;
        bac_de_retention_IN: Entity;
        prechauffeur_FILL: Entity;
        postPrechauffeurTube1_fill: Entity;
        tubes?: Entity;
        boilerEmptying?: Entity;
        matterGoingDown?: Entity;
        stopMatterGoingDown?: Entity;
        goutte_created?: Entity;
        soutirage_on?: Entity;
        soutirage_off?: Entity;
        V15_1L_fill?: Entity;
        soutirage_anim?: Entity;
    }
) {
    const { instance, dropParent, bac_de_retention_IN, prechauffeur_FILL, postPrechauffeurTube1_fill, goutte_created, soutirage_on, soutirage_off,V15_1L_fill,soutirage_anim, /* tubes, boilerEmptying, matterGoingDown, stopMatterGoingDown */} = entities; 
    const  isSoutirageOn = useRef(false);
    // DETECTION DES TRIGGERS POUR L'ANIM DU PLACEMENT DU BAC DE RETENTION
    useEffect(() => {
        if (!bac_de_retention_IN) return;
        
        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name = "bac_de_retention_in_end";

        const onAnimEnd = () => {
            console.log("ONANIMEND");
        };

        

        bac_de_retention_IN.addScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
            onEmitted: onAnimEnd 
        });

        return () => {
            bac_de_retention_IN.removeScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
            onEmitted: onAnimEnd 
        });
        }
            
    }, [bac_de_retention_IN, cameraControllerRef]);


    // DETECTION DES TRIGGERS POUR L'ANIM DU REMPLISSAGE DU PRECHAUFFEUR
    useEffect(() => {
        if (!prechauffeur_FILL) return;
        
        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name = "prechauffeur_fill_end";

        const onAnimEnd = () => {
            console.log(postPrechauffeurTube1_fill);
            console.log("On Anim End");
            AnimationHelper.launchAnim(postPrechauffeurTube1_fill);
        };

        

        prechauffeur_FILL.addScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
            onEmitted: onAnimEnd 
        });

        return () => {
            prechauffeur_FILL.removeScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
            onEmitted: onAnimEnd 
        });
        }
            
    }, [prechauffeur_FILL, cameraControllerRef]);

    // DETECTION DES TRIGGERS POUR L'ANIM D'ACTIVATION DE LA BOBINE DE SOUTIRAGE
    useEffect(() => {
        if (!soutirage_on) return;
        
        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name = "soutirage_on";

        const onAnimEnd = () => {
            isSoutirageOn.current = true;
            console.log("soutirage");
            console.log(isSoutirageOn);
            //AnimationHelper.launchAnim(V15_1L_fill);
        };
        soutirage_on.addScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
            onEmitted: onAnimEnd 
        });
        return () => {
            soutirage_on.removeScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
            onEmitted: onAnimEnd 
        });
        }
            
    }, [soutirage_on, isSoutirageOn]);

    // DETECTION DES TRIGGERS POUR L'ANIM DE DESACTIVATION DE LA BOBINE DE SOUTIRAGE
    useEffect(() => {
        if (!soutirage_off) return;
        
        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name = "soutirage_off";

        const onAnimEnd = () => {
            isSoutirageOn.current = false;
            console.log("soutirageOff");
            console.log(isSoutirageOn);
            //AnimationHelper.pauseAnim(V15_1L_fill);
        };

        soutirage_off.addScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
            onEmitted: onAnimEnd 
        });
        return () => {
            soutirage_off.removeScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
            onEmitted: onAnimEnd 
        });
        }
            
    }, [soutirage_off, isSoutirageOn]);


    // DETECTION DES TRIGGERS POUR L'ANIM DES GOUTTES
    useEffect(() => {
        if (!goutte_created) return;
        
        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name = "goutte_drop_end";
        // 🔒 Guard pour éviter les appels concurrents
        let isCreating = false;
        let entityCount = 0; // 👈 compteur global à l'effet
        let blockCount = 0;
        const onAnimEnd = async () => {
            // ✅ Empêche les appels en rafale
            if (isCreating) {
                console.warn("⛔ newEntity bloqué car déjà en cours");
                blockCount++;
                if (blockCount > 10)
                {
                    console.warn("trop de blocage");
                    isCreating = false;
                    blockCount = 0;
                }
                return;
            }
            isCreating = true;

            try {
                entityCount++;
                console.log(`🟡 newEntity appelé — entités actives estimées : ${entityCount}`);

            const animId = isSoutirageOn.current ? "7c9f4abe-1e48-4768-b47c-d7e0f2c5030e" : "eed0c2a3-296e-4ee2-b4f2-cbc0d56eea9b";



            const name = isSoutirageOn.current ? "entityTestSoutirage" : "entityTestReflux";

            const result=  await Promise.race([instance?.scene.newEntity({
                name: name,
                parent: dropParent,
                components: {
                    local_transform: {
                        position: [-0.12737,2.242702,0.04652],
                        scale: [0.009,0.009,0.009]
                    },
                    mesh_ref: {value: "d9f4eb2b-6a85-4034-9044-fefa7b0f864a"},
                    material_ref: {value: "17c27f52-6b09-447d-9d59-0829436a85b4"},
                    animation_sequence_controller: {
                        animationSequenceRef: animId          
                    },
                        
                    }
                }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("⏱️ newEntity timeout")), 5000)
            ),
        ]);

        if (!result){
            console.error("❌ newEntity null");
            return;
        }
        const resou = result as Entity;
        
        if (isSoutirageOn.current) {
            resou!.animation_sequence_controller!.entities["7c571ab7-ba02-4444-9b21-582f51e557de"] = {originalEUID: resou!.euid.value}
            resou!.animation_sequence_controller!.entities["6eec3a1a-b2b0-4762-a68d-db9b6656b2c5"] = {originalEUID: resou!.euid.value}
            resou!.animation_sequence_controller!.entities["2e319197-f876-4d34-9390-e17c17d78586"] = {originalEUID: resou!.euid.value}
            

            setTimeout(() => {
                console.log(`🗑️ deleteEntities — entités actives restantes : ${--entityCount}`);
                instance?.scene.deleteEntities({entities: [resou]})
            }, 14000)
        }
        else {
            resou!.animation_sequence_controller!.entities["00b56afe-4245-4eb8-b95c-cee5b883f370"] = {originalEUID: resou!.euid.value}
            resou!.animation_sequence_controller!.entities["100dbeb8-60a4-4e5e-ae51-dce416a14312"] = {originalEUID: resou!.euid.value}
            
            setTimeout(() => {
                try {
                    console.log(`🗑️ deleteEntities — entités actives restantes : ${--entityCount}`);
                    instance?.scene.deleteEntities({entities: [resou]})
                    console.log(`🗑️ Entité supprimée`);
                } catch (error) {
                    console.error(`❌ deleteEntities échoué :`, error);
                }
            }, 4000)
        }



        resou!.animation_sequence_controller!.playState = 1;
            }
            catch (err){
        // ✅ Catch le timeout ET les vraies erreurs
        console.error("💥 Erreur ou timeout dans newEntity :", err);
            }
            finally {
                // ✅ Toujours libérer le lock, même en cas d'erreur
                blockCount = 0;
                isCreating = false;
            }

                
                
        };
        
        goutte_created.addScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
            onEmitted: onAnimEnd 
        });

        return () => {
            goutte_created.removeScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
            onEmitted: onAnimEnd 
        });
        }
            
    }, [goutte_created, dropParent, instance]);

        // DETECTION DES TRIGGERS POUR L'ANIM DES GOUTTES SOUTIREES
    useEffect(() => {
        if (!soutirage_anim) return;
        
        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name = "soutirage_end";

        const onAnimEnd = () => {
            console.log("TRIGGER GOUTTE SOUTIREE");
                
            AnimationHelper.launchAnim(V15_1L_fill);
        };
        soutirage_anim.addScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
            onEmitted: onAnimEnd 
        });

        return () => {
            soutirage_anim.removeScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
            onEmitted: onAnimEnd 
        });
        }
            
    }, [soutirage_anim,V15_1L_fill]);
}