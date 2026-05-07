import type { Client } from "@3dverse/livelink";
import AvatarIcon from "./avatarIcon";

const AvatarList = ({
    clients,
    watchedClient,
    setWatchedClient,
}: {
    clients: Array<Client>;
    watchedClient: Client | null;
    setWatchedClient: (client: Client | null) => void;
}) => {
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
                        <AvatarIcon client={client} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AvatarList;