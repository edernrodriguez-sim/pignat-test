import { useState } from 'react';
import App from "./App";

function Home() {
    const [isDebugMode, setIsDebugMode] = useState<boolean | undefined>(undefined);

    // Si un mode est sélectionné, afficher App
    if (isDebugMode !== undefined) {
        return <App isDebugModeInput={isDebugMode} />;
    }

    // Sinon, afficher les boutons
    return (
        <div id="home">
            <img src="/src/assets/Logo.jpg" />
            <div>
                <button onClick={() => setIsDebugMode(true)}>
                    Mode Support
                </button>
                <button onClick={() => setIsDebugMode(false)}>
                    Mode Exercice
                </button>
            </div>
        </div>
    );
}

export default Home;