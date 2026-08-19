import { useState } from 'react';
import App from "./App";
import { useSearchParams } from 'react-router-dom';
import { Canvas, Livelink, useClients,  useEntity,  Viewport } from '@3dverse/livelink-react';
import { LoadingOverlay } from '@3dverse/livelink-react-ui';
import { ProjectConstants } from './projectConstants';
import Logo from './assets/Logo.jpg'
import TextInputModal from './modals/textInputModal';
import ExerciceChoice from './exercices/exerciceChoice';

let machineId = 0;
const token = "public_wfVLwtMF9Rg0rp_k";

function Home() {
    const [appMode, setAppMode] = useState<number>(0);
    const [isIdModalOpen, setIsIdModalOpen] = useState(false);
    const [params] = useSearchParams();
    const idsession = params.get("idsession");
    const idclient = params.get("idclient");
    const idcamera = params.get("idcamera");
    const [username, setUsername] = useState("");

    function onInputModalValidated(machineIdInput: string){
        try {
            machineId = Number(machineIdInput);
        } catch (error) {
            console.log("Impossible de parser le code inséré : " + machineIdInput);
            console.log(error);
        }
        
        setAppMode(ProjectConstants.APP_MODE_MAINTENANCE);
    }

    function backToHome(){
        setAppMode(0);
    }

    // Si un mode est sélectionné, afficher App
    if (appMode === ProjectConstants.APP_MODE_MAINTENANCE) {
        return <App appModeInput={appMode} sessionIdV={idsession} machineId={machineId} />;
    }
    else if (appMode === ProjectConstants.APP_MODE_EXERCICE) {
        return <ExerciceChoice backToHome={backToHome}  />;
    }
    else if (appMode === ProjectConstants.APP_MODE_ANIMCONTINUE || appMode === ProjectConstants.APP_MODE_ANIMDISCONTINUE) {
        return <App appModeInput={appMode} sessionIdV={null} machineId={0}/>;
    }
    // S'il y a un idsession c'est qu'on est invité
    else if (idsession != undefined) {
        // S'il y a un idclient alors on est un spectateur passif
        if (idclient != undefined)
        {
            return (
                <Livelink sessionId={idsession} token={token} LoadingPanel={LoadingOverlay}>
                    <AppLayout watchedClientId={idclient!} camera_entity_id={idcamera!} />
                </Livelink>
            )
        }
        // Sinon on est un spectateur actif
        else {
            if (username.trim().length <= 0)
            {
                // On récupère un nom d'utilisateur pour différencier les icônes pour les partages 
                return (
                    <TextInputModal 
                        textInputModalDto={{
                        onModalCancel:() => {},
                        onModalValidate: (value) => {setUsername(value)},
                        text: "Entrez votre nom :",
                    }}
                    />
                )
            }
            else {

                return <App appModeInput={appMode} sessionIdV={idsession} machineId={machineId} username={username}  />;
            }
        }
    }
    // Sinon, afficher les boutons
    return (
        <>
        <div id="home">
            <img src={Logo} />
            <div>
                <button onClick={() => setIsIdModalOpen(true) }>
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