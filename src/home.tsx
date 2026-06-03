import { useState } from 'react';
import App from "./App";
import { useSearchParams } from 'react-router-dom';
import { Canvas, Livelink, useClients,  useEntity,  Viewport } from '@3dverse/livelink-react';
import { LoadingOverlay } from '@3dverse/livelink-react-ui';
import { ProjectConstants } from './projectConstants';
import Logo from './assets/Logo.jpg'
import TextInputModal from './modals/textInputModal';
import ExerciceChoice from './exercices/exerciceChoice';

let machineId = "";
const token = "public_wfVLwtMF9Rg0rp_k";

function Home() {
    const [appMode, setAppMode] = useState<number>(0);
    const [isIdModalOpen, setIsIdModalOpen] = useState(false);
    const [params] = useSearchParams();
    const idsession = params.get("idsession");
    const idclient = params.get("idclient");
    const idcamera = params.get("idcamera");

    function onInputModalValidated(machineIdInput: string){
        machineId = machineIdInput;
        setAppMode(ProjectConstants.APP_MODE_MAINTENANCE);
    }

    // Si un mode est sélectionné, afficher App
    if (appMode === ProjectConstants.APP_MODE_MAINTENANCE) {
        return <App appModeInput={appMode} sessionIdV={idsession} machineId={machineId} />;
    }
    else if (appMode === ProjectConstants.APP_MODE_EXERCICE) {
        return <ExerciceChoice />;
    }
    else if (appMode === ProjectConstants.APP_MODE_ANIMCONTINUE || appMode === ProjectConstants.APP_MODE_ANIMDISCONTINUE) {
        return <App appModeInput={appMode} sessionIdV={null} machineId={""}/>;
    }
    else if (idsession != undefined) {
        if (idclient != undefined)
        {
            return (
                <Livelink sessionId={idsession} token={token} LoadingPanel={LoadingOverlay}>
                    <AppLayout watchedClientId={idclient!} camera_entity_id={idcamera!} />
                </Livelink>
            )
        }
        else {
            return <App appModeInput={appMode} sessionIdV={idsession} machineId={machineId} />;
        }
    }
    // Sinon, afficher les boutons
    return (
        <>
        <div id="home">
            <img src={Logo} />
            <div>
                {/* <button onClick={() => setIsIdModalOpen(true) }>
                    Mode Support
                </button> */}
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
        <div>

        </div>

        {isIdModalOpen && (<TextInputModal 
            textInputModalDto={{
                onModalCancel:() => {setIsIdModalOpen(!isIdModalOpen)},
                onModalValidate: onInputModalValidated,
                text: "Id de la machine à écouter :",
            }}
        />
        )}
        
        </>
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