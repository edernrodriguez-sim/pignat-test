import { useState } from 'react';
import App from "./App";
import { useSearchParams } from 'react-router-dom';
import { Canvas, Livelink, useClients,  useEntity,  Viewport } from '@3dverse/livelink-react';
import { LoadingOverlay } from '@3dverse/livelink-react-ui';
// import { useMqttListener } from './useMqttListener';
import { ProjectConstants } from './projectConstants';
import Logo from './assets/Logo.jpg'

function Home() {
    const token = "public_wfVLwtMF9Rg0rp_k";
    const [appMode, setAppMode] = useState<number>(0);
    const [params] = useSearchParams();
    const idsession = params.get("idsession");
    const idclient = params.get("idclient");
    const idcamera = params.get("idcamera");

    // useMqttListener();

    // Si un mode est sélectionné, afficher App
    if (appMode !== 0) {
        return <App appModeInput={appMode} />;
    }
    else if (idsession != undefined) {
        return (
            <Livelink sessionId={idsession} token={token} LoadingPanel={LoadingOverlay}>
                <AppLayout watchedClientId={idclient!} camera_entity_id={idcamera!} />
            </Livelink>
        )
    }
    // Sinon, afficher les boutons
    return (
        <div id="home">
            <img src={Logo} />
            <div>
                {/* <button onClick={() => setAppMode(ProjectConstants.APP_MODE_MAINTENANCE)}>
                    Mode Support
                </button> */}
                {/* <button onClick={() => setAppMode(ProjectConstants.APP_MODE_EXERCICE)}>
                    Mode Exercice
                </button> */}
                
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



const AppLayout  = ({ watchedClientId,camera_entity_id }: { watchedClientId: string, camera_entity_id: string }) => {
    
    const { clients } = useClients();
    const { entity: camera } = useEntity({ euid: camera_entity_id });
    const parent = clients.find(c => c.id == watchedClientId);
    if (parent == null || parent == undefined)
        return null;

    return (
        <Canvas className="w-full h-hull bg-black">
            <Viewport className="w-full h-full"  cameraEntity={camera} />
        </Canvas>
    );
}