import type { Client } from "@3dverse/livelink";
import AvatarIcon from "./avatarIcon";
import { useEntities } from "@3dverse/livelink-react";

const AvatarList = ({
    clients,
    watchedClient,
    setWatchedClient
}: {
    clients: Array<Client>;
    watchedClient: Client | null;
    setWatchedClient: (client: Client | null) => void;
}) => {
    // Récupération de toutes les caméras présentes dans la session
    const { entities } = useEntities({ mandatory_components: ["camera"] }, [
        "camera"
    ]);
    // Création d'un dictionnaire comprenant les ids et nom d'utilisateur car chaque caméra user
    // a un nom au format idUser_username
    var table = entities.map(function (item) {
        if (item.debug_name?.value.includes("_"))
        {
            const splitted = item.debug_name?.value.split("_");
            return {key: splitted[0], value: splitted[1].length > 0 ? splitted[1] : "MainUser"}
        }
        else {
            return null;
        }
    });

    return (
        <div className="absolute left-4 top-4">
            <div className="avatar-group flex gap-1 rtl:space-x-reverse">
                {clients.map((client) => (
                    <button
                        key={client.id}
                        onClick={() =>
                            setWatchedClient(
                                client !== watchedClient ? client : null,
                            )
                        }
                        className={`
                            border-2 rounded-full
                            ${client === watchedClient ? " border-accent" : "border-transparent"}
                        `}
                    >
                        <AvatarIcon client={client} username={table.find(t => t?.key === client.id)?.value ?? "Unknown"} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AvatarList;