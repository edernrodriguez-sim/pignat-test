import mqtt from "mqtt";
import { useEffect } from "react";

export function useMqttListener(){
    //const brokerUrl = "ws://localhost:8080";
    // const brokerUrl = "ws://test.mosquitto.org:8080";








    useEffect(() => {
        const client = mqtt.connect("ws://localhost:8080", {
            clientId: `react_${Math.random().toString(16).slice(2)}`,
            clean: true,
            reconnectPeriod: 1000,
        });

        // client.on("connect", () => client.subscribe("ton/topic"));
        client.on("connect", () => {
            console.log("✅ Connecté au broker");
            client.subscribe("machine/data")
        }
        );

        client.on("message", (topic, payload) => {
        console.log("📨 Message reçu sur topic:", topic);
        console.log("📨 Payload brut:", payload.toString());
        
        const data = JSON.parse(payload.toString());
        console.log("📨 Records:", data.Records);
        });

    //     client.on("message", (_, payload) => {
    //         console.log("message");
    //     const data = JSON.parse(payload.toString());

    //     const records = data.Records;
    //     console.log(records);

    // });
    client.on("close", () => console.log("🔴 Connexion fermée"));
client.on("offline", () => console.log("📴 Client offline"));
client.on("error", (err) => console.error("❌ Erreur :", err.message));
    client.on("disconnect", () => console.log("⚠️ Déconnecté"));
    return () => { client.end(); }; // cleanup au démontage
    
    }, []);
    return null;
}