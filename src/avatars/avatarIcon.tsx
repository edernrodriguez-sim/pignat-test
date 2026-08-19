import type { Client } from "@3dverse/livelink";
import Avatar from "boring-avatars";

const AvatarIcon = ({ client, username }: { client: Client, username:string }) => {
    // Affichage du username custom récupéré dans avatarList.tsx
    return (
        <div  title={username}>
            <Avatar
                colors={["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"]}
                name={client.id}
                size={40}
                variant="beam"
            />
            <div style={{
                textAlign: "center",
                color: "white",
                textShadow: "#111111 0px 0 10px"
            }}>{username}</div>
        </div>
    );
};

export default AvatarIcon;