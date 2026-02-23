
import vannesDatas from "./assets/vannesValues.json";
export class VanneManager {
    public readonly vannesValues: VanneValue[] =  vannesDatas.map((data) => 
    new VanneValue(data.label, data.id, data.openAnimId, data.closeAnimId, data.glowAnimId, data.stopGlowAnimId)
);
}


export function getVannesValues() : VanneValue[] {
    return vannesDatas.map((data) => 
        new VanneValue(data.label, data.id, data.openAnimId, data.closeAnimId, data.glowAnimId, data.stopGlowAnimId)
    );
};

export class VanneValue{
    label: string;
    id: string;
    openAnimId: string;
    closeAnimId: string;
    glowAnimId: string;
    stopGlowAnimId: string | undefined;

    constructor(label: string,
    id: string,
    openAnimId: string,
    closeAnimId: string,
    glowAnimId: string,
    stopGlowAnimId: string | undefined)
    {
        this.label = label;
        this.id = id;
        this.openAnimId = openAnimId;
        this.closeAnimId= closeAnimId;
        this.glowAnimId = glowAnimId;
        this.stopGlowAnimId = stopGlowAnimId;
    }
}