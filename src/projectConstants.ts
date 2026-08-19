export class ProjectConstants {
    static readonly UNITTYPE_VANNE = "vanne"
    static readonly APP_MODE_MAINTENANCE = 1;
    static readonly APP_MODE_EXERCICE = 2;
    static readonly APP_MODE_ANIMCONTINUE = 3;
    static readonly APP_MODE_ANIMDISCONTINUE = 4;
    static readonly SHARE_TYPE_ACTIVE = "0";
    static readonly SHARE_TYPE_PASSIVE = "1";
    /**
     * Clé de détection du type de paramètre de machine
     * Permet de détecter quel est le paramètre pour en déterminer l'unité 
     * (ex si le nom contient TT comme TT01 alors c'est une température : Unité = °c)
     */
    static readonly MACHINE_PARAM_UNIT_DETECTION_TEMPERATURE = "TT";
    
    /** Clés des éléments de la machine */
    static readonly MACHINE_PARAM_N_SERIE_KEY = "N_SERIE";
    static readonly MACHINE_PARAM_LSL03 = "LSL03";
    static readonly MACHINE_PARAM_LSL04 = "LSL04";
    /** Bouton de la modale de paramètre générale */
    static readonly IHM_KEYS_PARAM_CONFIRM_BUTTON_ID = "parameterEditModalConfirmBtn";
    /** Boutons de la modale de régulation */
    static readonly IHM_KEYS_REGULATOR_AUTO_BUTTON_ID = "regulator-auto-btn";
    static readonly IHM_KEYS_REGULATOR_PV_INPUT_ID = "PV_input";
    static readonly IHM_KEYS_REGULATOR_SP_INPUT_ID = "SP_input";
    static readonly IHM_KEYS_REGULATOR_OP_INPUT_ID = "OP_input";
    static readonly IHM_KEYS_REGULATOR_OP_MAN_INPUT_ID = "OP_MAN_input";
    static readonly IHM_KEYS_BASIC_INPUT_ID = "parameter_modal_basic_input_id";
    /** Boutons de la modale booléen */
    static readonly IHM_KEYS_BOOL_BUTTON_ON_ID = "ihm_bool_modal_on_button";
    static readonly IHM_KEYS_BOOL_BUTTON_OFF_ID = "ihm_bool_modal_off_button";
    /** Boutons de la modale reflux */
    static readonly IHM_KEYS_REFLUX_BUTTON_REFLUX_ID = "parameter-reflux-reflux-button";
    static readonly IHM_KEYS_REFLUX_BUTTON_CYCLE_ID = "parameter-reflux-cycle-button";
    static readonly IHM_KEYS_REFLUX_INPUT_ID = "parameter-reflux-input";

    /** Boutons de l'IHM permettant d'afficher les modales */
    static readonly IHM_KEYS_FIC02_BUTTON_ID = "FIC02";
    static readonly IHM_KEYS_P1_BUTTON_ID = "P1";
    static readonly IHM_KEYS_H1_BUTTON_ID = "H1";
    static readonly IHM_KEYS_TTC06_BUTTON_ID = "TTC06";
    static readonly IHM_KEYS_EV_MODE_BUTTON_ID = "EV_MODE";
    static readonly IHM_KEYS_H2_BUTTON_ID = "H2";
    static readonly IHM_KEYS_DPIC01_BUTTON_ID = "DPIC01";
    static readonly IHM_KEYS_P1_SP_REEL_BUTTON_ID = "P1_SP_REEL";

    /**
     * Mode de connexion MQTT (lu depuis la variable d'environnement Vite) :
     *  - "mqtt"   → WebSocket direct vers le broker  (npm run dev:mqtt)
     *  - "bridge" → Backend Express intermédiaire    (npm run dev:bridge)
     */
    static readonly CONNECTION_MODE: "mqtt" | "bridge" =
        (import.meta.env.VITE_CONNECTION_MODE as "mqtt" | "bridge") ?? "mqtt";

    /** URL du broker WebSocket (mode mqtt) */
    static readonly BROKER_WS_URL: string =
        import.meta.env.VITE_BROKER_WS_URL ?? "ws://localhost:8080";

    /** URL du backend Express WebSocket (mode bridge) */
    static readonly BRIDGE_WS_URL: string =
        import.meta.env.VITE_BRIDGE_WS_URL ?? "ws://localhost:3001/ws";
        
    static readonly MQTT_ID_TAGNAME = "N_SERIE";
}