import type { Entity, Livelink } from "@3dverse/livelink";
import type { DefaultCameraController } from "@3dverse/livelink-react";
import { useEffect, useRef } from "react";
import { AnimationHelper } from "../animationHelper";

var bellCounter = 0;

/**
 * 
 * Fonction gérant la récupération des triggers envoyés par les animations
 * @param cameraControllerRef 
 * @param entities 
 */
export function useBehaviourOnAnimationTrigger(
    instance: Livelink | null,
    cameraControllerRef: React.RefObject<DefaultCameraController | null>,
    entities: {
        dropParent: Entity | null;
        bac_de_retention_IN: Entity | null;
        prechauffeur_FILL: Entity | null;
        bouilleur_fill_continu: Entity | null;
        postPrechauffeurTube1_fill: Entity | null;
        tubes?: Entity | null;
        boilerEmptying?: Entity | null;
        matterGoingDown?: Entity | null;
        stopMatterGoingDown?: Entity | null;
        goutte_drop?: Entity | null;
        soutirage_on?: Entity | null;
        soutirage_off?: Entity | null;
        V12_1L_fill?: Entity | null;
        V12_1L_emptying?: Entity | null;
        V15_1L_fill?: Entity | null;
        V15_1L_emptying?: Entity | null;
        soutirage_anim?: Entity | null;
        show_bells_bulles_one_by_one?: Entity | null;
    },
    updateMachineParam: (key : string,value : string | number | boolean) => void
) {
    const { dropParent, prechauffeur_FILL, postPrechauffeurTube1_fill, goutte_drop, soutirage_on, soutirage_off,V15_1L_fill,V15_1L_emptying,V12_1L_fill,V12_1L_emptying,soutirage_anim, show_bells_bulles_one_by_one, bouilleur_fill_continu} = entities; 
    const  isSoutirageOn = useRef(false);
    
    // DETECTION DES TRIGGERS POUR L'ANIM DU REMPLISSAGE DU PRECHAUFFEUR
    useEffect(() => {
        if (!prechauffeur_FILL) return;

        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name = "prechauffeur_fill_end";

        const onAnimEnd = () => {
            
            updateMachineParam("LSL02", false);
            AnimationHelper.launchAnim(postPrechauffeurTube1_fill);
        };

        

        prechauffeur_FILL.addScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
        });

        return () => {
            prechauffeur_FILL.removeScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
        });
        }
            
    }, [postPrechauffeurTube1_fill, prechauffeur_FILL, cameraControllerRef]);

    // DETECTION DES TRIGGERS POUR L'ANIM DU REMPLISSAGE DU BOUILLEUR
    useEffect(() => {
        if (!bouilleur_fill_continu) return;

        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name = "LSL01_ok";

        const onAnimEnd = () => {
            updateMachineParam("LSL01", false);
        };

        

        bouilleur_fill_continu.addScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
        });

        return () => {
            bouilleur_fill_continu.removeScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
        });
        }
            
    }, [bouilleur_fill_continu, cameraControllerRef]);

    // DETECTION DES TRIGGERS POUR L'ANIM D'ACTIVATION DE LA BOBINE DE SOUTIRAGE
    useEffect(() => {
        if (!soutirage_on) return;
        
        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name = "soutirage_on";

        const onAnimEnd = () => {
            isSoutirageOn.current = true;
        };
        soutirage_on.addScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
        });
        return () => {
            soutirage_on.removeScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
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
        };

        soutirage_off.addScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
        });
        return () => {
            soutirage_off.removeScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
        });
        }
            
    }, [soutirage_off, isSoutirageOn]);


    // DETECTION DES TRIGGERS POUR L'ANIM DES GOUTTES
    const isCreating = useRef(false);
    const entityCount = useRef(0); // 👈 compteur global à l'effet
    const blockCount = useRef(0); // 👈 compteur de blocages pour éviter les appels en rafale    
    useEffect(() => {
        if (!goutte_drop) return;
        if (!instance) return;
        
        
        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name = "goutte_drop_end";
        // 🔒 Guard pour éviter les appels concurrents
        const onAnimEnd = async () => {
            
            // ✅ Empêche les appels en rafale
            if (isCreating.current) {
                console.warn("⛔ newEntity bloqué car déjà en cours");
                blockCount.current++;
                if (blockCount.current > 10)
                {
                    console.warn("trop de blocage");
                    isCreating.current = false;
                    blockCount.current = 0;
                }
                return;
            }
            isCreating.current = true;

            let abortTimeout: NodeJS.Timeout | null = null;
            try {
                entityCount.current++;
                console.log(`🟡 newEntity appelé — entités actives estimées : ${entityCount.current}`);

                const animId = isSoutirageOn.current ? "7c9f4abe-1e48-4768-b47c-d7e0f2c5030e" : "eed0c2a3-296e-4ee2-b4f2-cbc0d56eea9b";
                const name = isSoutirageOn.current ? "entityTestSoutirage" : "entityTestReflux";
                
                new Promise((_, reject) =>
                    abortTimeout = setTimeout(() => {
                        abortTimeout = null;
                        reject(new Error("⏱️ newEntity timeout"));
                    }, 5000)
                );
                const goutte = await instance?.scene.newEntity({
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
                });
                clearTimeout(abortTimeout!); // ✅ Clear le timeout si l'opération réussit

                if (!goutte){
                    console.error("❌ newEntity null");
                    return;
                }
                if(!goutte.animation_sequence_controller){
                    console.error("❌ animation_sequence_controller manquant sur la goutte");
                    return;
                }
               
                const { entities } = goutte.animation_sequence_controller;
                const originalEUID = goutte.euid.value;
                if (isSoutirageOn.current) {
                    entities["7c571ab7-ba02-4444-9b21-582f51e557de"] = { originalEUID };
                    entities["6eec3a1a-b2b0-4762-a68d-db9b6656b2c5"] = { originalEUID };
                    entities["2e319197-f876-4d34-9390-e17c17d78586"] = { originalEUID };

                    setTimeout(() => {
                        console.log(`🗑️ deleteEntities — entités actives restantes : ${--entityCount.current}`);
                        instance?.scene.deleteEntities({entities: [goutte]});
                    }, 14000)
                }
                else {
                    entities["00b56afe-4245-4eb8-b95c-cee5b883f370"] = { originalEUID };
                    entities["100dbeb8-60a4-4e5e-ae51-dce416a14312"] = { originalEUID };
                    
                    setTimeout(() => {
                        try {
                            console.log(`🗑️ deleteEntities — entités actives restantes : ${--entityCount.current}`);
                            instance?.scene.deleteEntities({entities: [goutte]});
                            console.log(`🗑️ Entité supprimée`);
                        } catch (error) {
                            console.error(`❌ deleteEntities échoué :`, error);
                        }
                    }, 4000)
                }

                goutte.animation_sequence_controller.seekOffset = 0;
                goutte.animation_sequence_controller.playState = 1;
            }
            catch (err){
                // ✅ Catch le timeout ET les vraies erreurs
                console.error("💥 Erreur ou timeout dans newEntity :", err);
            }
            finally {
                // ✅ Toujours libérer le lock, même en cas d'erreur
                blockCount.current = 0;
                isCreating.current = false;
                if(abortTimeout ) {
                    clearTimeout(abortTimeout);
                }
            }   
        };
        
        
        goutte_drop.addScriptEventListener({ 
            event_map_id,
            event_name,
            onReceived: onAnimEnd
        });
        
        return () => {
            goutte_drop.removeScriptEventListener({ 
                event_map_id, 
                event_name, 
                onReceived: onAnimEnd
            });
        }
            
    }, [goutte_drop, dropParent, instance]);

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
        });

        return () => {
            soutirage_anim.removeScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onAnimEnd, 
        });
        }
            
    }, [soutirage_anim,V15_1L_fill]);

    
    // DETECTION DU REMPLISSAGE DE LA RECETTE RESIDU (V12)
    useEffect(() => {
        if (!V12_1L_fill) return;

        const anim = V12_1L_fill;
        
        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name_filling = "recette_residu_filling";
        const event_name_full = "recette_residu_full";

        const onFillingReceived = () => {
            updateMachineParam("LSL03", false);
        };

        anim.addScriptEventListener({ 
            event_map_id, 
            event_name: event_name_filling, 
            onReceived: onFillingReceived,
        });

        const onFullReceived = () => {
            updateMachineParam("LSH01", true);
        }

        anim.addScriptEventListener({ 
            event_map_id, 
            event_name: event_name_full, 
            onReceived: onFullReceived,
        });

        return () => {
            anim.removeScriptEventListener({ 
                event_map_id, 
                event_name: event_name_filling, 
                onReceived: onFillingReceived,
            });
            
            anim.removeScriptEventListener({ 
                event_map_id, 
                event_name: event_name_full, 
                onReceived: onFullReceived,
            });
        }
            
    }, [V12_1L_fill, cameraControllerRef]);

    
    // DETECTION DU VIDAGE DE LA RECETTE RESIDU (V12)
    useEffect(() => {
        if (!V12_1L_emptying) return;

        const anim = V12_1L_emptying;
        
        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name_emptying = "recette_residu_emptying";
        const event_name_empty = "recette_residu_empty";

        const onEmptyingReceived = () => {
            updateMachineParam("LSH01", false);
        };

        anim.addScriptEventListener({ 
            event_map_id, 
            event_name: event_name_emptying, 
            onReceived: onEmptyingReceived,
        });

        const onEmptyReceived = () => {
            updateMachineParam("LSL03", true);
        }

        anim.addScriptEventListener({ 
            event_map_id, 
            event_name: event_name_empty, 
            onReceived: onEmptyReceived,
        });

        return () => {
            anim.removeScriptEventListener({ 
                event_map_id, 
                event_name: event_name_emptying, 
                onReceived: onEmptyingReceived,
            });
            
            anim.removeScriptEventListener({ 
                event_map_id, 
                event_name: event_name_empty, 
                onReceived: onEmptyReceived,
            });
        }
            
    }, [V12_1L_emptying, cameraControllerRef]);

    // DETECTION DU REMPLISSAGE DE LA RECETTE DE DISTILLAT (V15)
    useEffect(() => {
        if (!V15_1L_fill) return;

        const anim = V15_1L_fill;
        
        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name = "recette_distillat_filling";
        const event_name_full = "recette_distillat_full";

        const onFillingReceived = () => {
            updateMachineParam("LSL04", false);
        };
        anim.addScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onFillingReceived, 
        });

        const onFullReceived = () => {
            updateMachineParam("LSH02", true);
        }

        anim.addScriptEventListener({ 
            event_map_id, 
            event_name: event_name_full, 
            onReceived: onFullReceived,
        });


        return () => {
            anim.removeScriptEventListener({ 
            event_map_id, 
            event_name, 
            onReceived: onFillingReceived, 
            });
            
            anim.removeScriptEventListener({ 
                event_map_id, 
                event_name: event_name_full, 
                onReceived: onFullReceived,
            });
        }
            
    }, [V15_1L_fill, cameraControllerRef]);

    // DETECTION DU VIDAGE DE LA RECETTE DE DISTILLAT (V15)
    useEffect(() => {
        if (!V15_1L_emptying) return;

        const anim = V15_1L_emptying;
        
        const event_map_id = "3b4ec3a6-28fd-4fdb-8569-d45a272c2624";
        const event_name_emptying = "recette_distillat_emptying";
        const event_name_empty = "recette_distillat_empty";

        const onEmptyingReceived = () => {
            updateMachineParam("LSH02", false);
        };
        anim.addScriptEventListener({ 
            event_map_id, 
            event_name: event_name_emptying, 
            onReceived: onEmptyingReceived, 
        });

        const onEmptyReceived = () => {
            updateMachineParam("LSL04", true);
        }

        anim.addScriptEventListener({ 
            event_map_id, 
            event_name: event_name_empty, 
            onReceived: onEmptyReceived,
        });


        return () => {
            anim.removeScriptEventListener({ 
            event_map_id, 
            event_name: event_name_emptying, 
            onReceived: onEmptyingReceived, 
            });
            
            anim.removeScriptEventListener({ 
                event_map_id, 
                event_name: event_name_empty, 
                onReceived: onEmptyReceived,
            });
        }
            
    }, [V15_1L_emptying, cameraControllerRef]);

    
    // DETECTION D'UNE NOUVELLE CLOCHE REMPLIE
    useEffect(() => {
        if (!show_bells_bulles_one_by_one) return;

        const anim = show_bells_bulles_one_by_one;
        
        const event_map_id = "09975aac-d5b2-4b96-b892-57e1ec87b04d";
        const event_name_emptying = "new_bell_boiling";

        const onEmptyingReceived = () => {
            bellCounter = bellCounter + 1;
            updateMachineParam("DPIC01_PV", 0.9 * bellCounter);
            console.log("Counter");
            console.log(bellCounter);
        };
        anim.addScriptEventListener({ 
            event_map_id, 
            event_name: event_name_emptying, 
            onReceived: onEmptyingReceived, 
        });


        return () => {
            anim.removeScriptEventListener({ 
            event_map_id, 
            event_name: event_name_emptying, 
            onReceived: onEmptyingReceived, 
            });
        }
            
    }, [show_bells_bulles_one_by_one, cameraControllerRef]);
}