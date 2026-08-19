import type { Client } from "@3dverse/livelink";
import { LivelinkContext, useClients } from "@3dverse/livelink-react";
import { useContext, useState, useEffect } from "react";
import AvatarList from "./avatarList";
import PiPViewport from "./pipViewport";

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