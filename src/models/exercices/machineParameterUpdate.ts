export class MachineParameterUpdate {
    key: string = "";
    value : string | number | boolean;

    /**
     *
     */
    constructor(_key: string, _value: string | number | boolean) {
        this.key = _key;
        this.value = _value;
    }
}