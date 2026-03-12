import { useState } from 'react';
import App from "./App";
import { useSearchParams } from 'react-router-dom';
import { Canvas, Livelink, useClients,  Viewport } from '@3dverse/livelink-react';
import { LoadingOverlay } from '@3dverse/livelink-react-ui';
// import { useMqttListener } from './useMqttListener';
import { ProjectConstants } from './projectConstants';

function Home() {
    const token = "public_wfVLwtMF9Rg0rp_k";
    const [appMode, setAppMode] = useState<number>(0);
    const [params] = useSearchParams();
    const idsession = params.get("idsession");
    const idclient = params.get("idclient");
    console.log("idsession");
    console.log(idsession);




    // useMqttListener();




    //const { clients } = useClients();
    // Si un mode est sélectionné, afficher App
    if (appMode !== 0) {
        console.log(1);
        return <App appModeInput={appMode} />;
    }
    else if (idsession != undefined) {
        console.log(2);
        return (
            <Livelink sessionId={idsession} token={token} LoadingPanel={LoadingOverlay}>
                <AppLayout watchedClientId={idclient!} />
            </Livelink>
        )
    }

        console.log(3);
    // Sinon, afficher les boutons
    return (
        <div id="home">
            <img src="/src/assets/Logo.jpg" />
            <div>
                <button onClick={() => setAppMode(ProjectConstants.APP_MODE_MAINTENANCE)}>
                    Mode Support
                </button>
                <button onClick={() => setAppMode(ProjectConstants.APP_MODE_EXERCICE)}>
                    Mode Exercice
                </button>
                
                <button onClick={() => setAppMode(ProjectConstants.APP_MODE_ANIMCONTINUE)}>
                    Animation Continue
                </button>
                
                <button onClick={() =>  setAppMode(ProjectConstants.APP_MODE_ANIMDISCONTINUE)}>
                    Animation Discontinue
                </button>
            </div>
        </div>
    );
}

export default Home;



const AppLayout  = ({ watchedClientId }: { watchedClientId: string }) => {
    
    const { clients } = useClients();
    const parent = clients.find(c => c.id == watchedClientId);
    console.log("clients");
    console.log(clients);
    console.log("parent");
    console.log(parent);
    if (parent == null || parent == undefined)
        return null;

    return (
        <Canvas className="w-full h-hull bg-black">
            <Viewport className="w-full h-full" client={parent} />
        </Canvas>
    );
}