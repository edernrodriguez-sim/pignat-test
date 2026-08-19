import { Client, Entity } from "@3dverse/livelink";
import { DOM3DEntityAnchor } from "@3dverse/livelink-react";
import { useState, useEffect } from "react";
import AvatarIcon from "./avatarIcon";

const Avatar3D = ({ client, username_input }: { client: Client, username_input: string }) => {
    const [clientCameraEntity, setClientCameraEntity] = useState<Entity | null>(
        null,
    );

    useEffect(() => {
        client
            .getCameraEntities()
            .then(cameraEntities => setClientCameraEntity(cameraEntities[0]));
    }, [client]);

    if (!clientCameraEntity) {
        return null;
    }

    return (
        <DOM3DEntityAnchor
            key={client.id}
            scaleFactor={0.0025}
            entity={clientCameraEntity}
        >
            <AvatarIcon client={client} username={username_input} />
        </DOM3DEntityAnchor>
    );
};

export default Avatar3D;