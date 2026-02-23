export class MachineMapping {
    public labelToId: Map<string,string>;
    public idToLabel: Map<string,string>;

    constructor(input: Array<{id: string, label: string}>){
        this.labelToId = new Map();
        this.idToLabel = new Map();

        input.forEach((data) => {
            this.labelToId.set(data.label,data.id);
            this.idToLabel.set(data.id,data.label);
        })
    }

    getLabelByIdIfExists(id:string) : string | undefined {
        return this.idToLabel.get(id)!;
    }

    getIdByLabelIfExists(label:string) : string | undefined {
        return this.labelToId.get(label)!;
    }

    hasLabelKey(label:string) : boolean {
        return this.labelToId.has(label);
    }
    

    hasIdKey(id:string) : boolean {
        return this.idToLabel.has(id);
    }
}