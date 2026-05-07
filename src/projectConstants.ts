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
}