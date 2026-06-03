export class MachineParameter {
    key:string;
    label:string;
    description: string|undefined;
    value:string | number | boolean;
    /**
     * Valeur indiquant que le paramètre est correct. Cette valeur peut changer selon les détecteurs.
     * Exemple : 
     * LSL = détecteur de niveau minimum => 1 = niveau suffisant (valeur satisfaisante) / 0 = insuffisant (valeur insatisfaisante)
     * LSH = détecteur de remplissage max => 0 = pas rempli (valeur satisfaisante) / 1 = rempli (valeur insatisfaisante)
     */
    satisfyingValue? : boolean; 
    unitType: string | undefined;
    type:string;
    showInIHM: boolean = false;

  constructor(key : string,
    label: string,
    value : string | number | boolean,
    description : string | undefined,
    type : string,
    unitType: string | undefined,
    showInIHM: boolean | undefined,
    satisfyingValue? : boolean) {
    this.key = key;
    this.label = label;
    this.value = value;
    this.description = description;
    this.type = type;
    this.unitType = unitType;
    this.showInIHM = showInIHM ?? false;
    this.satisfyingValue = satisfyingValue;
  }
}