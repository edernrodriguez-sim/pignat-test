import type { MachineParameter } from "./models/machineParameter";

    // Systeme de règle permettant de faire des schémas de vérification
    export type Rule =
    | { name: string, rule: "isTrue"; params: string, errorMessage: string }
    | { name: string, rule: "isFalse"; params: string, errorMessage: string }
    | { name: string, rule: "equals"; params: string; value: string, errorMessage: string }
    | { name: string, rule: "greaterThan"; params: string; value: number, errorMessage: string }
    | { name: string, rule: "lessThan"; params: string; value: number, errorMessage: string }
    | { name: string, rule: "onlyOneTrue"; params: string[], errorMessage: string }
    | { name: string, rule: "and"; rules: Rule[], errorMessage: string }
    | { name: string, rule: "or"; rules: Rule[], errorMessage: string };

    export type RuleResult =
    | { name: string, result: string, errorMessage: string }

export class RulesSystem {

    testRule(rule: Rule, params: MachineParameter[]): boolean {
    switch (rule.rule) {
        // Vérification si la valeur du paramètre est égale à vrai
        case "isTrue": {
        return this.getValueString(params, rule.params) === "true";
        }
        case "isFalse": {
        return this.getValueString(params, rule.params) === "false";
        }

        case "equals": {
        return this.getValueString(params, rule.params) === rule.value;
        }
        case "greaterThan": {
        return this.getValueNumber(params, rule.params)! > rule.value;
        }
        case "lessThan": {
        return this.getValueNumber(params, rule.params)! < rule.value;
        }

        case "onlyOneTrue": {
        const values = rule.params.map(k => this.getValueString(params, k) === "true");
        return values.filter(v => v).length === 1;
        }

        case "and": {
        return rule.rules.every(r => this.testRule(r, params));
        }

        case "or": {
        return rule.rules.some(r => this.testRule(r, params));
        }
    }
    }

    // Récupération d'une valeur en fonction de sa clé
    // params : Liste des paramètres à filtrer
    // key : Clé de l'élément à récupérer
    getValueString(params: MachineParameter[], key: string): string | number | undefined {
        return params.find(p => p.key === key)?.value;
    }

    getValueNumber(params: MachineParameter[], key: string): number | undefined {
        const resultInString = params.find(p => p.key === key)?.value;
        if (resultInString !== undefined){
            const resultInInt = +resultInString;
            return resultInInt;
        }
        return resultInString;
    }

}