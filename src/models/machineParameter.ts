export class MachineParameter {
    key:string;
    label:string;
    value:string | number;
    unitType: string | undefined;
    type:string;
    showInIHM: boolean = false;
  constructor(key : string,
    label: string,
    value : string | number,
    type : string,
    unitType: string | undefined,
    showInIHM: boolean | undefined) {
    this.key = key;
    this.label = label;
    this.value = value;
    this.type = type;
    this.unitType = unitType;
    this.showInIHM = showInIHM ?? false;
  }
}