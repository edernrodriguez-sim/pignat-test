export class ProjectConstants {
    static readonly UNITTYPE_VANNE = "vanne"
    static readonly APP_MODE_MAINTENANCE = 1;
    static readonly APP_MODE_EXERCICE = 2;
    static readonly APP_MODE_ANIMCONTINUE = 3;
    static readonly APP_MODE_ANIMDISCONTINUE = 4;

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