import type { Entity, Livelink, UUID } from "@3dverse/livelink";
import type { AnimationEntities } from "../models/animations/animationEntities";

const euid_to_identifier: { [key: UUID]: keyof AnimationEntities } = {
    "741cbe2b-7198-46e7-92ba-3498c87e0461": "screen_glow",
// Bac de rétention
    "418eeee8-7509-46c3-b356-7fa34fdcac90": "bac_de_retention_out",
    "d6d376eb-3686-4483-926e-82c901e04f21": "bac_de_retention_in",
// Bidon de 10L sous la vanne V12
    "de3c9604-dba5-48f6-b66c-9864143dab9b": "bidon_10L_V12_out",
    "d2c81ff2-0f48-4c61-b5eb-27932a1ce27e": "bidon_10L_V12_in",
    "c1207705-77b2-446c-836b-eb7bdeddbc87": "fill_bidon_10L_V12",
// Bidon de 10L sous la vanne V15
    "7868cb9f-e75b-47fd-bbbf-e33c8e183558": "bidon_10L_V15_out",
    "41ee3239-b6d8-4127-8401-c06b2b421bf8": "bidon_10L_V15_in",
    "82e192d7-266e-4b5c-9cb4-aa377eda4f2d": "fill_bidon_10L_V15",
// Bidon de 1L au dessus de la vanne V15
    "c8470577-4e01-4bf0-94f7-ba91adaab138": "fill_bidon_1L_V15",
    "3d87a251-88a8-49eb-bb72-2f954a6cb25e": "empty_bidon_1L_V15",
// Bidon de 1L au dessus de la vanne V12
    "b1c9b15f-cb14-4e4e-828c-dbe997a6b816": "fill_bidon_1L_V12",
    "16e1555e-18be-4788-a48e-132d6ade31ff": "empty_bidon_1L_V12",
// Bidon de 20L
    "3a019097-bda9-4d6c-87bc-a73f78fd6306": "bidon_20L_out",
    "6e1710fe-8116-4209-989b-fa4315a94056": "bidon_20L_in",
    "e5a14273-73da-4287-a306-33497e62390c": "bidon_20L_flexible_in",
    "fec3c1f9-5ad9-4bb4-b3e2-7744c7d242dc": "bidon_20L_flexible_out",
// Cloches
    "2cf59cc7-b06d-430a-ae37-e5c98b052bd0": "bells_on",
    "17effb4a-2a31-4b8e-81d5-6ec73a6ecb12": "hide_bells_bulles",
    "b70320a1-8009-4aff-88fc-27da9777e612": "show_bells_bulles_one_by_one",
// Soupape
     "5cc4816f-ac88-4412-a59f-dba7cb6c95b9": "soupape_on",
     "ffa8ab5a-c565-473f-972e-1820242a21b6": "soupape_off",
    // Bouchon
     "04f499fa-8dbe-4682-9d8d-e39aad9eee2d": "bouchon_in",
     "11756f00-e502-4a77-9d24-b6c81399bd5b": "bouchon_out",
    // Bouilleur
     "5d0c9657-8d92-4b05-816c-5443c125b02c": "fill_bouilleur_continu",
     "cfa61690-aad6-4cac-8f4a-ee4b6cc9ee78": "fill_bouilleur_discontinu",
     "4b0d14d8-e1b0-42fe-8ad5-b1ed28f96f6b": "heat_boiler",
     "4df7e4b4-b02f-4cda-a560-c2805598b0da": "boilerEmptying",
     "c7c576be-1445-4bab-8117-1dc1b5c6caf8": "show_bulles_bouilleur",
     "db6ad4a0-d0b2-4d26-9df9-a8dcdad1263e": "hide_bulles_bouilleur",
     "389b90aa-d47e-4658-80f7-be71acda4676": "bouilleur_bullage",
    // Tuyau inferieur bouilleur V8
     "a47e5f0d-7742-4ec0-b858-f842b4272c5f": "tuyau_inf_bouilleur_V8",
     "f22bd9ed-9103-45a0-b127-524ee1f8de7f": "tuyau_inf_V8_bidon_V12",
    // Préchauffeur 
     "965a7e97-3045-4e98-852f-165436b2c4c0": "prechauffeur_fill",
    // Tuyau vertical parallèle au préchauffeur
     "e536de13-a477-49ea-8afe-51572f9f5110": "prechauffeur_parallel_fill",
    // Tuyau horizontal à la sortie de la pompe juste avant le préchauffeur 
     "0669da0d-ee4c-43aa-b0d1-a78811b5a12c": "prechauffeur_horizontal_entry_fill",
    // Tuyau horizontal en haut du préchauffeur
     "2b1f5b6a-dd6e-4184-94be-3a2d4da9ad41": "prechauffeur_fill_horizon_top",
    // Vanne V2
     "2089b454-c72a-4d8b-acfc-8716553613da": "v2_in",
     "f04997e6-57aa-4e3c-b864-696319b7011d": "v2_out",
     "dfb5ae64-eaf4-4bf3-9cab-99e71a4b63dc": "v2_glow",
     "604e4b3b-e4df-4fac-90dc-57fcb6cceb6c": "v2_stopGlow",
    // Vanne V3
     "a2664f3b-c99a-46cd-b4d6-9ce77d5f6cbd": "v3_in",
     "30f876c7-cc03-4242-95c2-d83997adb6bb": "v3_out",
    // Vanne V4
     "6786201f-a452-43f8-951a-be102de62210s": "v4_in",
     "10ec4acc-9df7-4a88-8ff6-0c39288e0c7e": "v4_out",
    // Vanne V5
     "170b5d93-98ac-42f2-be5e-bb000cf48c4e": "v5_in",
     "dd28ab02-0350-4068-9e07-99fd545d0a19": "v5_out",
    // Vanne V6
     "83cf5cd6-63dc-4e0a-b522-55f6d093aaac": "v6_in",
     "b9361028-1324-4a93-9e99-538ca05545d6": "v6_out",
    // Vanne V7
     "02e6ea8e-5d46-47a8-82ed-3ff69861af02": "v7_in",
     "130f3244-acb9-4457-add6-a12ad19a4f48": "v7_out",
    // Vanne V8
     "282c631a-baf4-49fc-819b-b66d86fdac2f": "v8_out",
     "d62102a3-9a75-46f1-ae67-a8e70f6509a6": "v8_in",
    // Vanne V9
     "376c8468-67d2-41d4-a8f2-07c395d65e5a": "v9_in",
     "a39b48ab-6be3-421c-a45d-768f344f9d79": "v9_out",
    // Vanne V11
     "ba8e9de3-670c-47da-b576-39cb9dac9f7e": "v11_out",
     "a5fa0a7a-7588-4215-8457-4415d824afc4": "v11_in",
    // Vanne V12
     "a2e5f8b1-c191-4e5d-9fd6-6e0635664e11": "v12_out",
     "c54b634a-0375-43d6-89a6-e799af1d308d": "v12_in",
    // Vanne V14
     "fc80d23c-0b6a-4de4-82cc-9cc69934697b": "v14_out",
     "a82aa290-ee90-487e-a921-e4597aadfb96": "v14_in",
    // Vanne V15
     "a7c4ab57-8777-4905-b48a-136d321d438a": "v15_out",
     "0d756bb1-2280-4cd9-9dc0-599759a0205a": "v15_in",
    // Vanne V16
     "b2cef0ae-a71b-4eb6-ae4e-d65eb080cfaa": "v16_out",
     "2708134b-9fc3-4354-aca2-2900f5c8443b": "v16_in",
    // Tubes
     "e4adcce0-b38e-413a-8097-2bf4b079b374": "tubes",
    // Tube du bidon de 20L vers la pompe
     "84126552-9ba1-44dc-810c-e5763a90cd88": "tube_bidon20L_to_P1",
    // Tube de la pompe P1 vers prechauffeur
     "4b183b2e-9cb8-46c6-a48e-a89eab69c242": "tube_P1_to_prechauffe",
    // Bobine de soutirage
     "4d51a2b8-7ba6-434f-8725-9d47c38108a3": "soutirage_on",
     "8bcca0bb-7b80-4175-b935-1a50e78c38f6": "soutirage_off",
     "cae5c9eb-5985-4c6b-b576-484092fba126": "soutirage_cycle",
    
    // Gouutes
     "a9cf253e-956d-4bee-b93b-bb36da55bb12": "goutte_drop",
     "6d527108-3749-449c-9c59-c836ed209c69": "goutte_drop_cycle_on",
     "bc080600-5fa8-4826-87ab-7dce395d5f65": "goutte_drop_cycle_off",
     "d7545006-5c6e-4f14-a9d9-d4dd42523d16": "goutte_soutirage",
     "05583fb6-3180-42ca-9d3b-3dfb7c13c903": "matterGoingDown",
     "cf152fca-b15c-40fe-b530-4c41fbe9c2e4": "stopMatterGoingDown",
     "98dabe7f-367f-487d-afa8-095e22ddcb9c": "postPrechauffeurTube1_fill",
     "f26a04a5-8867-479d-8ded-0dc085bf68c1": "postPrechauffeurTube1_V2",

     "9b67bb27-1672-488a-a851-1549bbfb174a": "complete_water_flow",
     "cdaad75e-f04f-4607-adf0-9ba2e47c234b": "vapeur_on",
     "dc423dd6-e543-4510-a1ff-2f0afa6d8201": "liquide_falling_bidon_1L_V15_in",
     "4caeb794-371f-4560-817b-88376869a72c": "liquide_falling_bidon_1L_V15_out",
     "7cc70a9b-1f98-4bcd-891e-e34ed5068245": "liquide_falling_bidon_1L_V12_in",
     "fabd4d99-2334-4b8f-9a47-1c666f2b70ea": "liquide_falling_bidon_1L_V12_out",


};
let debug_counter = 0;
async function traverseGraph(root: Entity, entitiesMap: Partial<AnimationEntities>) {
    let queue: Entity[] = [root];

    while (queue.length > 0) {
        debug_counter += queue.length;

        for (const entity of queue) {
            const identifier: keyof AnimationEntities = euid_to_identifier[entity.id];
            if (identifier) {
                entitiesMap[identifier] = entity;
            }
        }

        const childrenArrays = await Promise.all(queue.map(entity => entity.getChildren()));
        queue = childrenArrays.flat();
    }
}

/**
 * Récupération des entities d'animation
 * @returns les entities d'animation
 */
export async function useAnimationEntities(livelink: Livelink) : Promise<AnimationEntities> {
    // TODO: optimize would consist to  fetch root parent "Animations" entity and seek deep into the children graph
    const root_animations = await livelink.scene.findEntity({ entity_uuid: "140199e1-c462-4d46-aaa1-b2cf32030303" });
    const entitiesMap: Partial<AnimationEntities> = {};
    if(!root_animations) {
        throw new Error("Root animations entity not found");
    }

    debug_counter = 0;
    const start = performance.now();
    await traverseGraph(root_animations, entitiesMap);
    console.log(`Animation entities fetched in ${(performance.now() - start).toFixed(0)} ms`, debug_counter);
    return entitiesMap as AnimationEntities;

    /*
    // Écran
    const screen_glow = await livelink.scene.findEntity({ entity_uuid: "741cbe2b-7198-46e7-92ba-3498c87e0461" });
    // Bac de rétention
    const bac_de_retention = await livelink.scene.findEntity({ entity_uuid: "d6d376eb-3686-4483-926e-82c901e04f21" });
    const bac_de_retention_out = await livelink.scene.findEntity({ entity_uuid: "418eeee8-7509-46c3-b356-7fa34fdcac90" });
    const bac_de_retention_in = await livelink.scene.findEntity({ entity_uuid: "d6d376eb-3686-4483-926e-82c901e04f21" });
    // Bidon de 10L sous la vanne V12
    const bidon_10L_V12_out = await livelink.scene.findEntity({ entity_uuid: "de3c9604-dba5-48f6-b66c-9864143dab9b" });
    const bidon_10L_V12_in = await livelink.scene.findEntity({ entity_uuid: "d2c81ff2-0f48-4c61-b5eb-27932a1ce27e" });
    const fill_bidon_10L_V12 = await livelink.scene.findEntity({ entity_uuid: "c1207705-77b2-446c-836b-eb7bdeddbc87" });
    // Bidon de 10L sous la vanne V15
    const bidon_10L_V15_out = await livelink.scene.findEntity({ entity_uuid: "7868cb9f-e75b-47fd-bbbf-e33c8e183558" });
    const bidon_10L_V15_in = await livelink.scene.findEntity({ entity_uuid: "41ee3239-b6d8-4127-8401-c06b2b421bf8" });
    const fill_bidon_10L_V15 = await livelink.scene.findEntity({ entity_uuid: "82e192d7-266e-4b5c-9cb4-aa377eda4f2d" });
    // Bidon de 1L au dessus de la vanne V15
    const fill_bidon_1L_V15 = await livelink.scene.findEntity({ entity_uuid: "c8470577-4e01-4bf0-94f7-ba91adaab138" });
    const empty_bidon_1L_V15 = await livelink.scene.findEntity({ entity_uuid: "3d87a251-88a8-49eb-bb72-2f954a6cb25e" });
    // Bidon de 1L au dessus de la vanne V12
    const fill_bidon_1L_V12 = await livelink.scene.findEntity({ entity_uuid: "b1c9b15f-cb14-4e4e-828c-dbe997a6b816" });
    const empty_bidon_1L_V12 = await livelink.scene.findEntity({ entity_uuid: "16e1555e-18be-4788-a48e-132d6ade31ff" });
    // Bidon de 20L
    const bidon_20L_out = await livelink.scene.findEntity({ entity_uuid: "3a019097-bda9-4d6c-87bc-a73f78fd6306" });
    const bidon_20L_in = await livelink.scene.findEntity({ entity_uuid: "6e1710fe-8116-4209-989b-fa4315a94056" });
    const bidon_20L_flexible_in = await livelink.scene.findEntity({ entity_uuid: "e5a14273-73da-4287-a306-33497e62390c" });
    const bidon_20L_flexible_out = await livelink.scene.findEntity({ entity_uuid: "fec3c1f9-5ad9-4bb4-b3e2-7744c7d242dc" });
    // Cloches
    const bells_on = await livelink.scene.findEntity({ entity_uuid: "2cf59cc7-b06d-430a-ae37-e5c98b052bd0" });
    const hide_bells_bulles = await livelink.scene.findEntity({ entity_uuid: "17effb4a-2a31-4b8e-81d5-6ec73a6ecb12" });
    const show_bells_bulles_one_by_one = await livelink.scene.findEntity({ entity_uuid: "b70320a1-8009-4aff-88fc-27da9777e612" });
    // Soupape
    const soupape_on = await livelink.scene.findEntity({ entity_uuid: "5cc4816f-ac88-4412-a59f-dba7cb6c95b9" });
    const soupape_off = await livelink.scene.findEntity({ entity_uuid: "ffa8ab5a-c565-473f-972e-1820242a21b6" });
    // Bouchon
    const bouchon_in = await livelink.scene.findEntity({ entity_uuid: "04f499fa-8dbe-4682-9d8d-e39aad9eee2d" });
    const bouchon_out = await livelink.scene.findEntity({ entity_uuid: "11756f00-e502-4a77-9d24-b6c81399bd5b" });
    // Bouilleur
    const fill_bouilleur_continu = await livelink.scene.findEntity({ entity_uuid: "5d0c9657-8d92-4b05-816c-5443c125b02c" });
    const fill_bouilleur_discontinu = await livelink.scene.findEntity({ entity_uuid: "cfa61690-aad6-4cac-8f4a-ee4b6cc9ee78" });
    const heat_boiler = await livelink.scene.findEntity({ entity_uuid: "4b0d14d8-e1b0-42fe-8ad5-b1ed28f96f6b" });
    const boilerEmptying = await livelink.scene.findEntity({ entity_uuid: "4df7e4b4-b02f-4cda-a560-c2805598b0da" });
    const show_bulles_bouilleur = await livelink.scene.findEntity({ entity_uuid: "c7c576be-1445-4bab-8117-1dc1b5c6caf8" });
    const hide_bulles_bouilleur = await livelink.scene.findEntity({ entity_uuid: "db6ad4a0-d0b2-4d26-9df9-a8dcdad1263e" });
    const bouilleur_bullage = await livelink.scene.findEntity({ entity_uuid: "389b90aa-d47e-4658-80f7-be71acda4676" });
    // Tuyau inferieur bouilleur V8
    const tuyau_inf_bouilleur_V8 = await livelink.scene.findEntity({ entity_uuid: "a47e5f0d-7742-4ec0-b858-f842b4272c5f" });
    const tuyau_inf_V8_bidon_V12 = await livelink.scene.findEntity({ entity_uuid: "f22bd9ed-9103-45a0-b127-524ee1f8de7f" });
    // Préchauffeur 
    const prechauffeur_fill = await livelink.scene.findEntity({ entity_uuid: "965a7e97-3045-4e98-852f-165436b2c4c0" });
    const prechauffeur_fill_horizon_bottom = await livelink.scene.findEntity({ entity_uuid: "0669da0d-ee4c-43aa-b0d1-a78811b5a12c" });
    const prechauffeur_fill_vert_2 = await livelink.scene.findEntity({ entity_uuid: "e536de13-a477-49ea-8afe-51572f9f5110" });
    const prechauffeur_fill_horizon_top = await livelink.scene.findEntity({ entity_uuid: "2b1f5b6a-dd6e-4184-94be-3a2d4da9ad41" });
    // Tuyau vertical parallèle au préchauffeur
    const prechauffeur_parallel_fill = await livelink.scene.findEntity({ entity_uuid: "e536de13-a477-49ea-8afe-51572f9f5110" });
    // Tuyau horizontal à la sortie de la pompe juste avant le préchauffeur 
    const prechauffeur_horizontal_entry_fill = await livelink.scene.findEntity({ entity_uuid: "0669da0d-ee4c-43aa-b0d1-a78811b5a12c" });
    // Tuyau horizontal en haut du préchauffeur
    const prechauffeur_horizontal_end_fill = await livelink.scene.findEntity({ entity_uuid: "2b1f5b6a-dd6e-4184-94be-3a2d4da9ad41" });
    // Vanne V2
    const v2_in = await livelink.scene.findEntity({ entity_uuid: "2089b454-c72a-4d8b-acfc-8716553613da" });
    const v2_out = await livelink.scene.findEntity({ entity_uuid: "f04997e6-57aa-4e3c-b864-696319b7011d" });
    const v2_glow = await livelink.scene.findEntity({ entity_uuid: "dfb5ae64-eaf4-4bf3-9cab-99e71a4b63dc" });
    const v2_stopGlow = await livelink.scene.findEntity({ entity_uuid: "604e4b3b-e4df-4fac-90dc-57fcb6cceb6c" });
    // Vanne V3
    const v3_in = await livelink.scene.findEntity({ entity_uuid: "a2664f3b-c99a-46cd-b4d6-9ce77d5f6cbd" });
    const v3_out = await livelink.scene.findEntity({ entity_uuid: "30f876c7-cc03-4242-95c2-d83997adb6bb" });
    // Vanne V4
    const v4_in = await livelink.scene.findEntity({ entity_uuid: "6786201f-a452-43f8-951a-be102de62210s" });
    const v4_out = await livelink.scene.findEntity({ entity_uuid: "10ec4acc-9df7-4a88-8ff6-0c39288e0c7e" });
    // Vanne V5
    const v5_in = await livelink.scene.findEntity({ entity_uuid: "170b5d93-98ac-42f2-be5e-bb000cf48c4e" });
    const v5_out = await livelink.scene.findEntity({ entity_uuid: "dd28ab02-0350-4068-9e07-99fd545d0a19" });
    // Vanne V6
    const v6_in = await livelink.scene.findEntity({ entity_uuid: "83cf5cd6-63dc-4e0a-b522-55f6d093aaac" });
    const v6_out = await livelink.scene.findEntity({ entity_uuid: "b9361028-1324-4a93-9e99-538ca05545d6" });
    // Vanne V7
    const v7_in = await livelink.scene.findEntity({ entity_uuid: "02e6ea8e-5d46-47a8-82ed-3ff69861af02" });
    const v7_out = await livelink.scene.findEntity({ entity_uuid: "130f3244-acb9-4457-add6-a12ad19a4f48" });
    // Vanne V8
    const v8_out = await livelink.scene.findEntity({ entity_uuid: "282c631a-baf4-49fc-819b-b66d86fdac2f" });
    const v8_in = await livelink.scene.findEntity({ entity_uuid: "d62102a3-9a75-46f1-ae67-a8e70f6509a6" });
    // Vanne V9
    const v9_in = await livelink.scene.findEntity({ entity_uuid: "376c8468-67d2-41d4-a8f2-07c395d65e5a" });
    const v9_out = await livelink.scene.findEntity({ entity_uuid: "a39b48ab-6be3-421c-a45d-768f344f9d79" });
    // Vanne V11
    const v11_out = await livelink.scene.findEntity({ entity_uuid: "ba8e9de3-670c-47da-b576-39cb9dac9f7e" });
    const v11_in = await livelink.scene.findEntity({ entity_uuid: "a5fa0a7a-7588-4215-8457-4415d824afc4" });
    // Vanne V12
    const v12_out = await livelink.scene.findEntity({ entity_uuid: "a2e5f8b1-c191-4e5d-9fd6-6e0635664e11" });
    const v12_in = await livelink.scene.findEntity({ entity_uuid: "c54b634a-0375-43d6-89a6-e799af1d308d" });
    // Vanne V14
    const v14_out = await livelink.scene.findEntity({ entity_uuid: "fc80d23c-0b6a-4de4-82cc-9cc69934697b" });
    const v14_in = await livelink.scene.findEntity({ entity_uuid: "a82aa290-ee90-487e-a921-e4597aadfb96" });
    // Vanne V15
    const v15_out = await livelink.scene.findEntity({ entity_uuid: "a7c4ab57-8777-4905-b48a-136d321d438a" });
    const v15_in = await livelink.scene.findEntity({ entity_uuid: "0d756bb1-2280-4cd9-9dc0-599759a0205a" });
    // Vanne V16
    const v16_out = await livelink.scene.findEntity({ entity_uuid: "b2cef0ae-a71b-4eb6-ae4e-d65eb080cfaa" });
    const v16_in = await livelink.scene.findEntity({ entity_uuid: "2708134b-9fc3-4354-aca2-2900f5c8443b" });
    // Tubes
    const tubes = await livelink.scene.findEntity({ entity_uuid: "e4adcce0-b38e-413a-8097-2bf4b079b374" });
    // Tube du bidon de 20L vers la pompe
    const tube_bidon20L_to_P1 = await livelink.scene.findEntity({ entity_uuid: "84126552-9ba1-44dc-810c-e5763a90cd88" });
    // Tube de la pompe P1 vers prechauffeur
    const tube_P1_to_prechauffe = await livelink.scene.findEntity({ entity_uuid: "4b183b2e-9cb8-46c6-a48e-a89eab69c242" });
    // Bobine de soutirage
    const soutirage_on = await livelink.scene.findEntity({ entity_uuid: "4d51a2b8-7ba6-434f-8725-9d47c38108a3" });
    const soutirage_off = await livelink.scene.findEntity({ entity_uuid: "8bcca0bb-7b80-4175-b935-1a50e78c38f6" });
    const soutirage_cycle = await livelink.scene.findEntity({ entity_uuid: "cae5c9eb-5985-4c6b-b576-484092fba126" });
    
    // Gouutes
    const goutte_drop = await livelink.scene.findEntity({ entity_uuid: "a9cf253e-956d-4bee-b93b-bb36da55bb12" });
    const goutte_drop_cycle_on = await livelink.scene.findEntity({ entity_uuid: "6d527108-3749-449c-9c59-c836ed209c69" });
    const goutte_drop_cycle_off = await livelink.scene.findEntity({ entity_uuid: "bc080600-5fa8-4826-87ab-7dce395d5f65" });
    const goutte_soutirage = await livelink.scene.findEntity({ entity_uuid: "d7545006-5c6e-4f14-a9d9-d4dd42523d16" });
    const matterGoingDown = await livelink.scene.findEntity({ entity_uuid: "05583fb6-3180-42ca-9d3b-3dfb7c13c903" });
    const stopMatterGoingDown = await livelink.scene.findEntity({ entity_uuid: "cf152fca-b15c-40fe-b530-4c41fbe9c2e4" });
    const postPrechauffeurTube1_fill = await livelink.scene.findEntity({ entity_uuid: "98dabe7f-367f-487d-afa8-095e22ddcb9c" });
    const postPrechauffeurTube1_V2 = await livelink.scene.findEntity({ entity_uuid: "f26a04a5-8867-479d-8ded-0dc085bf68c1" });

    const complete_water_flow = await livelink.scene.findEntity({ entity_uuid: "9b67bb27-1672-488a-a851-1549bbfb174a" });
    const vapeur_on = await livelink.scene.findEntity({ entity_uuid: "cdaad75e-f04f-4607-adf0-9ba2e47c234b" });
    const liquide_falling_bidon_1L_V15_in = await livelink.scene.findEntity({ entity_uuid: "dc423dd6-e543-4510-a1ff-2f0afa6d8201" });
    const liquide_falling_bidon_1L_V15_out = await livelink.scene.findEntity({ entity_uuid: "4caeb794-371f-4560-817b-88376869a72c" });
    const liquide_falling_bidon_1L_V12_in = await livelink.scene.findEntity({ entity_uuid: "7cc70a9b-1f98-4bcd-891e-e34ed5068245" });
    const liquide_falling_bidon_1L_V12_out = await livelink.scene.findEntity({ entity_uuid: "fabd4d99-2334-4b8f-9a47-1c666f2b70ea" });
    
    const animationEntities: AnimationEntities = {
        screen_glow: screen_glow,
        bac_de_retention: bac_de_retention,
        bac_de_retention_out: bac_de_retention_out,
        bac_de_retention_in:bac_de_retention_in,
        bidon_10L_V12_out,
        bidon_10L_V12_in,
        bidon_10L_V15_out,
        bidon_10L_V15_in,
        bidon_20L_out,
        bidon_20L_in,
        bells_on,
        hide_bells_bulles,
        show_bells_bulles_one_by_one,
        fill_bouilleur_continu: fill_bouilleur_continu,
        fill_bouilleur_discontinu,
        heat_boiler,
        fill_bidon_1L_V15,
        empty_bidon_1L_V15,
        fill_bidon_10L_V15,
        fill_bidon_1L_V12,
        empty_bidon_1L_V12,
        fill_bidon_10L_V12,
        tubes,
        boilerEmptying,
        matterGoingDown,
        stopMatterGoingDown,
        prechauffeur_fill,
        postPrechauffeurTube1_fill,
        tube_bidon20L_to_P1,
        tube_P1_to_prechauffe,
        prechauffeur_parallel_fill,
        prechauffeur_horizontal_entry_fill,
        prechauffeur_horizontal_end_fill,
        soupape_on,
        soupape_off,
        goutte_drop: goutte_drop,
        goutte_drop_cycle_on,
        goutte_drop_cycle_off,
        soutirage_off : soutirage_off,
        soutirage_on : soutirage_on,
        v2_in,
        v2_out,
        v2_glow,
        v2_stopGlow,
        v3_in,
        v3_out,
        v4_in,
        v4_out,
        v5_in,
        v5_out,
        v6_in,
        v6_out,
        v7_in,
        v7_out,
        v8_out,
        v8_in,
        v9_out,
        v9_in,
        v11_out,
        v11_in,
        v12_out,
        v12_in,
        v14_out,
        v14_in,
        v15_out,
        v15_in,
        v16_out,
        v16_in,
        bidon_20L_flexible_in,
        bidon_20L_flexible_out,
        complete_water_flow,
        bouchon_in,
        bouchon_out,
        show_bulles_bouilleur,
        hide_bulles_bouilleur,
        bouilleur_bullage,
        soutirage_cycle,
        vapeur_on,
        goutte_soutirage,
        prechauffeur_fill_horizon_bottom,
        prechauffeur_fill_horizon_top,
        prechauffeur_fill_vert_2,
        postPrechauffeurTube1_V2,
        liquide_falling_bidon_1L_V15_in,
        liquide_falling_bidon_1L_V15_out,
        liquide_falling_bidon_1L_V12_in,
        liquide_falling_bidon_1L_V12_out,
        tuyau_inf_bouilleur_V8,
        tuyau_inf_V8_bidon_V12
    }
    
    return animationEntities;
    */
}