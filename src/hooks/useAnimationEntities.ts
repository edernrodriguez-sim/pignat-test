import { useEntity } from "@3dverse/livelink-react";
import type { AnimationEntities } from "../models/animations/animationEntities";

/**
 * Récupération des entities d'animation
 * @returns les entities d'animation
 */
export function useAnimationEntities() : AnimationEntities {
    // Écran
    const { entity: screen_glow } = useEntity({ euid: "741cbe2b-7198-46e7-92ba-3498c87e0461" });
    // Bac de rétention
    const { entity: bac_de_retention } = useEntity({ euid: "d6d376eb-3686-4483-926e-82c901e04f21" });
    const { entity: bac_de_retention_out } = useEntity({ euid: "418eeee8-7509-46c3-b356-7fa34fdcac90" });
    const { entity: bac_de_retention_in } = useEntity({ euid: "d6d376eb-3686-4483-926e-82c901e04f21" });
    // Bidon de 10L sous la vanne V12
    const { entity: bidon_10L_V12_out } = useEntity({ euid: "de3c9604-dba5-48f6-b66c-9864143dab9b" });
    const { entity: bidon_10L_V12_in } = useEntity({ euid: "d2c81ff2-0f48-4c61-b5eb-27932a1ce27e" });
    const { entity: fill_bidon_10L_V12 } = useEntity({ euid: "c1207705-77b2-446c-836b-eb7bdeddbc87" });
    // Bidon de 10L sous la vanne V15
    const { entity: bidon_10L_V15_out } = useEntity({ euid: "7868cb9f-e75b-47fd-bbbf-e33c8e183558" });
    const { entity: bidon_10L_V15_in } = useEntity({ euid: "41ee3239-b6d8-4127-8401-c06b2b421bf8" });
    const { entity: fill_bidon_10L_V15 } = useEntity({ euid: "82e192d7-266e-4b5c-9cb4-aa377eda4f2d" });
    // Bidon de 1L au dessus de la vanne V15
    const { entity: fill_bidon_1L_V15 } = useEntity({ euid: "c8470577-4e01-4bf0-94f7-ba91adaab138" });
    const { entity: empty_bidon_1L_V15 } = useEntity({ euid: "3d87a251-88a8-49eb-bb72-2f954a6cb25e" });
    // Bidon de 1L au dessus de la vanne V12
    const { entity: fill_bidon_1L_V12 } = useEntity({ euid: "b1c9b15f-cb14-4e4e-828c-dbe997a6b816" });
    const { entity: empty_bidon_1L_V12 } = useEntity({ euid: "16e1555e-18be-4788-a48e-132d6ade31ff" });
    // Bidon de 20L
    const { entity: bidon_20L_out } = useEntity({ euid: "3a019097-bda9-4d6c-87bc-a73f78fd6306" });
    const { entity: bidon_20L_in } = useEntity({ euid: "6e1710fe-8116-4209-989b-fa4315a94056" });
    const { entity: bidon_20L_flexible_in } = useEntity({ euid: "e5a14273-73da-4287-a306-33497e62390c" });
    const { entity: bidon_20L_flexible_out } = useEntity({ euid: "fec3c1f9-5ad9-4bb4-b3e2-7744c7d242dc" });
    // Cloches
    const { entity: bells_on } = useEntity({ euid: "2cf59cc7-b06d-430a-ae37-e5c98b052bd0" });
    const { entity: hide_bells_bulles } = useEntity({ euid: "17effb4a-2a31-4b8e-81d5-6ec73a6ecb12" });
    const { entity: show_bells_bulles_one_by_one } = useEntity({ euid: "b70320a1-8009-4aff-88fc-27da9777e612" });
    // Soupape
    const { entity: soupape_on } = useEntity({ euid: "5cc4816f-ac88-4412-a59f-dba7cb6c95b9" });
    const { entity: soupape_off } = useEntity({ euid: "ffa8ab5a-c565-473f-972e-1820242a21b6" });
    // Bouchon
    const { entity: bouchon_in } = useEntity({ euid: "04f499fa-8dbe-4682-9d8d-e39aad9eee2d" });
    const { entity: bouchon_out } = useEntity({ euid: "11756f00-e502-4a77-9d24-b6c81399bd5b" });
    // Bouilleur
    const { entity: fill_bouilleur_continu } = useEntity({ euid: "5d0c9657-8d92-4b05-816c-5443c125b02c" });
    const { entity: fill_bouilleur_discontinu } = useEntity({ euid: "cfa61690-aad6-4cac-8f4a-ee4b6cc9ee78" });
    const { entity: heat_boiler } = useEntity({ euid: "4b0d14d8-e1b0-42fe-8ad5-b1ed28f96f6b" });
    const { entity: boilerEmptying } = useEntity({ euid: "4df7e4b4-b02f-4cda-a560-c2805598b0da" });
    const { entity: show_bulles_bouilleur } = useEntity({ euid: "c7c576be-1445-4bab-8117-1dc1b5c6caf8" });
    const { entity: hide_bulles_bouilleur } = useEntity({ euid: "db6ad4a0-d0b2-4d26-9df9-a8dcdad1263e" });
    const { entity: bouilleur_bullage } = useEntity({ euid: "389b90aa-d47e-4658-80f7-be71acda4676" });
    // Tuyau inferieur bouilleur V8
    const { entity: tuyau_inf_bouilleur_V8 } = useEntity({ euid: "a47e5f0d-7742-4ec0-b858-f842b4272c5f" });
    const { entity: tuyau_inf_V8_bidon_V12 } = useEntity({ euid: "f22bd9ed-9103-45a0-b127-524ee1f8de7f" });
    // Préchauffeur 
    const { entity: prechauffeur_fill } = useEntity({ euid: "965a7e97-3045-4e98-852f-165436b2c4c0" });
    const { entity: prechauffeur_fill_horizon_bottom } = useEntity({ euid: "0669da0d-ee4c-43aa-b0d1-a78811b5a12c" });
    const { entity: prechauffeur_fill_vert_2 } = useEntity({ euid: "e536de13-a477-49ea-8afe-51572f9f5110" });
    const { entity: prechauffeur_fill_horizon_top } = useEntity({ euid: "2b1f5b6a-dd6e-4184-94be-3a2d4da9ad41" });
    // Tuyau vertical parallèle au préchauffeur
    const { entity: prechauffeur_parallel_fill } = useEntity({ euid: "e536de13-a477-49ea-8afe-51572f9f5110" });
    // Tuyau horizontal à la sortie de la pompe juste avant le préchauffeur 
    const { entity: prechauffeur_horizontal_entry_fill } = useEntity({ euid: "0669da0d-ee4c-43aa-b0d1-a78811b5a12c" });
    // Tuyau horizontal en haut du préchauffeur
    const { entity: prechauffeur_horizontal_end_fill } = useEntity({ euid: "2b1f5b6a-dd6e-4184-94be-3a2d4da9ad41" });
    // Vanne V2
    const { entity: v2_in } = useEntity({ euid: "2089b454-c72a-4d8b-acfc-8716553613da" });
    const { entity: v2_out } = useEntity({ euid: "f04997e6-57aa-4e3c-b864-696319b7011d" });
    const { entity: v2_glow } = useEntity({ euid: "dfb5ae64-eaf4-4bf3-9cab-99e71a4b63dc" });
    const { entity: v2_stopGlow } = useEntity({ euid: "604e4b3b-e4df-4fac-90dc-57fcb6cceb6c" });
    // Vanne V3
    const { entity: v3_in } = useEntity({ euid: "a2664f3b-c99a-46cd-b4d6-9ce77d5f6cbd" });
    const { entity: v3_out } = useEntity({ euid: "30f876c7-cc03-4242-95c2-d83997adb6bb" });
    // Vanne V4
    const { entity: v4_in } = useEntity({ euid: "6786201f-a452-43f8-951a-be102de62210s" });
    const { entity: v4_out } = useEntity({ euid: "10ec4acc-9df7-4a88-8ff6-0c39288e0c7e" });
    // Vanne V5
    const { entity: v5_in } = useEntity({ euid: "170b5d93-98ac-42f2-be5e-bb000cf48c4e" });
    const { entity: v5_out } = useEntity({ euid: "dd28ab02-0350-4068-9e07-99fd545d0a19" });
    // Vanne V6
    const { entity: v6_in } = useEntity({ euid: "83cf5cd6-63dc-4e0a-b522-55f6d093aaac" });
    const { entity: v6_out } = useEntity({ euid: "b9361028-1324-4a93-9e99-538ca05545d6" });
    // Vanne V7
    const { entity: v7_in } = useEntity({ euid: "02e6ea8e-5d46-47a8-82ed-3ff69861af02" });
    const { entity: v7_out } = useEntity({ euid: "130f3244-acb9-4457-add6-a12ad19a4f48" });
    // Vanne V8
    const { entity: v8_out } = useEntity({ euid: "282c631a-baf4-49fc-819b-b66d86fdac2f" });
    const { entity: v8_in } = useEntity({ euid: "d62102a3-9a75-46f1-ae67-a8e70f6509a6" });
    // Vanne V9
    const { entity: v9_in } = useEntity({ euid: "376c8468-67d2-41d4-a8f2-07c395d65e5a" });
    const { entity: v9_out } = useEntity({ euid: "a39b48ab-6be3-421c-a45d-768f344f9d79" });
    // Vanne V11
    const { entity: v11_out } = useEntity({ euid: "ba8e9de3-670c-47da-b576-39cb9dac9f7e" });
    const { entity: v11_in } = useEntity({ euid: "a5fa0a7a-7588-4215-8457-4415d824afc4" });
    // Vanne V12
    const { entity: v12_out } = useEntity({ euid: "a2e5f8b1-c191-4e5d-9fd6-6e0635664e11" });
    const { entity: v12_in } = useEntity({ euid: "c54b634a-0375-43d6-89a6-e799af1d308d" });
    // Vanne V14
    const { entity: v14_out } = useEntity({ euid: "fc80d23c-0b6a-4de4-82cc-9cc69934697b" });
    const { entity: v14_in } = useEntity({ euid: "a82aa290-ee90-487e-a921-e4597aadfb96" });
    // Vanne V15
    const { entity: v15_out } = useEntity({ euid: "a7c4ab57-8777-4905-b48a-136d321d438a" });
    const { entity: v15_in } = useEntity({ euid: "0d756bb1-2280-4cd9-9dc0-599759a0205a" });
    // Vanne V16
    const { entity: v16_out } = useEntity({ euid: "b2cef0ae-a71b-4eb6-ae4e-d65eb080cfaa" });
    const { entity: v16_in } = useEntity({ euid: "2708134b-9fc3-4354-aca2-2900f5c8443b" });
    // Tubes
    const { entity: tubes } = useEntity({ euid: "e4adcce0-b38e-413a-8097-2bf4b079b374" });
    // Tube du bidon de 20L vers la pompe
    const { entity: tube_bidon20L_to_P1 } = useEntity({ euid: "84126552-9ba1-44dc-810c-e5763a90cd88" });
    // Tube de la pompe P1 vers prechauffeur
    const { entity: tube_P1_to_prechauffe } = useEntity({ euid: "4b183b2e-9cb8-46c6-a48e-a89eab69c242" });
    // Bobine de soutirage
    const { entity: soutirage_on } = useEntity({ euid: "4d51a2b8-7ba6-434f-8725-9d47c38108a3" });
    const { entity: soutirage_off } = useEntity({ euid: "8bcca0bb-7b80-4175-b935-1a50e78c38f6" });
    const { entity: soutirage_cycle } = useEntity({ euid: "cae5c9eb-5985-4c6b-b576-484092fba126" });
    
    // Gouutes
    const { entity: goutte_drop } = useEntity({ euid: "a9cf253e-956d-4bee-b93b-bb36da55bb12" });
    const { entity: goutte_drop_cycle_on } = useEntity({ euid: "6d527108-3749-449c-9c59-c836ed209c69" });
    const { entity: goutte_drop_cycle_off } = useEntity({ euid: "bc080600-5fa8-4826-87ab-7dce395d5f65" });
    const { entity: goutte_soutirage } = useEntity({ euid: "d7545006-5c6e-4f14-a9d9-d4dd42523d16" });
    const { entity: matterGoingDown } = useEntity({ euid: "05583fb6-3180-42ca-9d3b-3dfb7c13c903" });
    const { entity: stopMatterGoingDown } = useEntity({ euid: "cf152fca-b15c-40fe-b530-4c41fbe9c2e4" });
    const { entity: postPrechauffeurTube1_fill } = useEntity({ euid: "98dabe7f-367f-487d-afa8-095e22ddcb9c" });
    const { entity: postPrechauffeurTube1_V2 } = useEntity({ euid: "f26a04a5-8867-479d-8ded-0dc085bf68c1" });

    const { entity: complete_water_flow } = useEntity({ euid: "9b67bb27-1672-488a-a851-1549bbfb174a" });
    const { entity: vapeur_on } = useEntity({ euid: "cdaad75e-f04f-4607-adf0-9ba2e47c234b" });
    const { entity: liquide_falling_bidon_1L_V15_in } = useEntity({ euid: "dc423dd6-e543-4510-a1ff-2f0afa6d8201" });
    const { entity: liquide_falling_bidon_1L_V15_out } = useEntity({ euid: "4caeb794-371f-4560-817b-88376869a72c" });
    const { entity: liquide_falling_bidon_1L_V12_in } = useEntity({ euid: "7cc70a9b-1f98-4bcd-891e-e34ed5068245" });
    const { entity: liquide_falling_bidon_1L_V12_out } = useEntity({ euid: "fabd4d99-2334-4b8f-9a47-1c666f2b70ea" });
    
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
}