import type { Entity } from "@3dverse/livelink"

/**
 * Cette classe contient toutes les animations utilisables
 */
export interface AnimationEntities {
    screen_glow: Entity | null
    // Bac de rétention
    bac_de_retention: Entity | null
    bac_de_retention_out: Entity | null
    bac_de_retention_in: Entity | null
    // BIDONS
    // Bidon de 10L sous la Vanne V12
    bidon_10L_V12_out: Entity | null
    bidon_10L_V12_in: Entity | null
    // Bidon de 10L sous la Vanne V15
    bidon_10L_V15_out: Entity | null
    bidon_10L_V15_in: Entity | null
    // Bidon de 1L au dessus de la Vanne V15
    fill_bidon_1L_V15: Entity | null
    empty_bidon_1L_V15: Entity | null
    // Bidon de 1L au dessus de la Vanne V12
    fill_bidon_1L_V12: Entity | null
    empty_bidon_1L_V12: Entity | null
    liquide_falling_bidon_1L_V15_in: Entity | null
    liquide_falling_bidon_1L_V15_out: Entity | null
    liquide_falling_bidon_1L_V12_in: Entity | null
    liquide_falling_bidon_1L_V12_out: Entity | null
    fill_bidon_10L_V15: Entity | null
    fill_bidon_10L_V12: Entity | null
    // Bidon de 20L
    bidon_20L_out: Entity | null
    bidon_20L_in: Entity | null
    bidon_20L_flexible_out: Entity | null
    bidon_20L_flexible_in: Entity | null
    // Cloches
    bells_on: Entity | null
    hide_bells_bulles: Entity | null
    show_bells_bulles_one_by_one: Entity | null
    // Bouchon
    bouchon_in: Entity | null
    bouchon_out: Entity | null
    // Bouilleur
    fill_bouilleur_continu: Entity | null
    fill_bouilleur_discontinu: Entity | null
    heat_boiler: Entity | null
    bouilleur_bullage: Entity | null
    boilerEmptying: Entity | null
    show_bulles_bouilleur: Entity | null
    hide_bulles_bouilleur: Entity | null
    // Tuyaux inferieurs V8
    tuyau_inf_bouilleur_V8: Entity | null;
    tuyau_inf_V8_bidon_V12: Entity | null;
    // Préchauffeur
    prechauffeur_fill: Entity | null
    prechauffeur_fill_horizon_bottom: Entity | null
    prechauffeur_fill_horizon_top: Entity | null
    prechauffeur_fill_vert_2: Entity | null
    // Tuyau vertical parallèle au préchauffeur
    prechauffeur_parallel_fill: Entity | null
    // Tuyau horizontal à la sortie de la pompe juste avant le préchauffeur 
    prechauffeur_horizontal_entry_fill: Entity | null
    // Tuyau horizontal en haut du préchauffeur
    prechauffeur_horizontal_end_fill: Entity | null
    // Tuyau vertical à la sortie de la pompe juste avant le préchauffeur
    postPrechauffeurTube1_fill: Entity | null
    postPrechauffeurTube1_V2: Entity | null
    // TUBES
    // Tube du bidon de 20L vers la pompe
    tube_bidon20L_to_P1: Entity | null
    // Tube de la pompe P1 vers prechauffeur
    tube_P1_to_prechauffe: Entity | null
    // Autre
    tubes: Entity | null
    matterGoingDown: Entity | null
    stopMatterGoingDown: Entity | null
    // Vannes
    // Vanne V2
    v2_in: Entity | null
    v2_out: Entity | null
    v2_glow: Entity | null
    v2_stopGlow: Entity | null
    // Vanne V3
    v3_in: Entity | null
    v3_out: Entity | null
    // Vanne V4
    v4_in: Entity | null
    v4_out: Entity | null
    // Vanne V5
    v5_in: Entity | null
    v5_out: Entity | null
    // Vanne V6
    v6_in: Entity | null
    v6_out: Entity | null
    // Vanne V7
    v7_in: Entity | null
    v7_out: Entity | null
    // Vanne V8
    v8_out: Entity | null
    v8_in: Entity | null
    // Vanne V9
    v9_out: Entity | null
    v9_in: Entity | null
    // Vanne V11
    v11_out: Entity | null
    v11_in: Entity | null
    // Vanne V12
    v12_out: Entity | null
    v12_in: Entity | null
    // Vanne V14
    v14_out: Entity | null
    v14_in: Entity | null
    // Vanne V15
    v15_out: Entity | null
    v15_in: Entity | null
    // Vanne V16
    v16_out: Entity | null
    v16_in: Entity | null
    // Soupape
    soupape_on: Entity | null
    soupape_off: Entity | null
    // Gouttes
    goutte_drop: Entity | null
    goutte_drop_cycle_on: Entity | null
    goutte_drop_cycle_off: Entity | null
    goutte_soutirage: Entity | null
    // Soutirage
    soutirage_on: Entity | null
    soutirage_off: Entity | null
    soutirage_cycle: Entity | null
    // circuit d'eau
    complete_water_flow: Entity | null
    // vapeur
    vapeur_on: Entity | null
    
}