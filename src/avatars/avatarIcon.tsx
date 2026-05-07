import type { Client } from "@3dverse/livelink";
import Avatar from "boring-avatars";

const AvatarIcon = ({ client }: { client: Client }) => {
    return (
        <div  title={client.username}>
            {/* <p>{index}</p> */}
            <Avatar
                colors={["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"]}
                name={client.id}
                size={40}
                variant="beam"
            />
        </div>
    );
};

export default AvatarIcon;