import type { Client } from "@3dverse/livelink";
import { DOM3DOverlay, LivelinkContext, useClients } from "@3dverse/livelink-react";
import { useContext, useState, useEffect } from "react";
import AvatarList from "./avatarList";
import PiPViewport from "./pipViewport";
import Avatar3D from "./avatar3D";

function Avatars() {
    const { instance } = useContext(LivelinkContext);
    const { clients } = useClients();
    const [watchedClient, setWatchedClient] = useState<Client | null>(null);

    useEffect(() => {
        if (watchedClient && !clients.includes(watchedClient)) {
            setWatchedClient(null);
        }
    }, [clients, watchedClient]);

    if (!instance) {
        return null;
    }

    return (
        <>
            <DOM3DOverlay>
                {clients.map(client => (
                    <Avatar3D key={client.id} client={client} />
                ))}
            </DOM3DOverlay>
            <AvatarList
                clients={clients}
                watchedClient={watchedClient}
                setWatchedClient={setWatchedClient}
            />
            <PiPViewport watchedClient={watchedClient} />
        </>
    );
}

export default Avatars;