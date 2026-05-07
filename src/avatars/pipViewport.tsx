import { Client } from "@3dverse/livelink";
import { Canvas, Viewport } from "@3dverse/livelink-react";


const PiPViewport = ({ watchedClient }: { watchedClient: Client | null }) => {
    
    if (!watchedClient) {
        return null;
    }

    return (
        <Canvas className="absolute top-20 w-1/3 h-2/6 right-8 border border-tertiary rounded-lg shadow-2x">
            <Viewport className="w-full h-full" 
            client={watchedClient} />
        </Canvas>
    );

    
};

export default PiPViewport;