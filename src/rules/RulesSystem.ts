import type { MachineParameter } from "../models/machineParameter";

    // Systeme de règle permettant de faire des schémas de vérification
    interface BaseRule {
        name: string;
        errorMessage: string;
        isBlockingForStart: boolean; // Défini si cette règle peu bloquer le démarrage
        sessionType: LaunchType[];
    }

    export type Rule = BaseRule & (
    | { rule: "isTrue";      tagName: string }
    | { rule: "isFalse";     tagName: string }
    | { rule: "equals";      tagName: string; expectedValue: string }
    | { rule: "greaterThan"; tagName: string; expectedValue: number }
    | { rule: "lessThan";    tagName: string; expectedValue: number }
    | { rule: "onlyOneTrue"; tagName: string[] }
    | { rule: "and";         rules: Rule[] }
    | { rule: "or";          rules: Rule[] }
    );

    export type RuleResult =
    | { name: string, result: string, errorMessage: string, launchType: LaunchType[] }

    export enum LaunchType {
        Continu = 'continu',
        Discontinu = 'discontinu',
        Remplissage = 'remplissage',
        All = 'all'
    }

export class RulesSystem {

    testRule(rule: Rule, params: MachineParameter[]): boolean {
    switch (rule.rule) {
        // Vérification si la valeur du paramètre est égale à vrai
        case "isTrue": {
        return this.testBooleanValues(true, this.getValue(params, rule.tagName));
        }
        case "isFalse": {
        return this.testBooleanValues(false, this.getValue(params, rule.tagName));
        }

        case "equals": {
        return this.getValue(params, rule.tagName) === rule.expectedValue;
        }
        case "greaterThan": {
        return this.getValueNumber(params, rule.tagName)! > rule.expectedValue;
        }
        case "lessThan": {
        return this.getValueNumber(params, rule.tagName)! < rule.expectedValue;
        }

        case "onlyOneTrue": {
        const values = rule.tagName.map(k => this.getValue(params, k) == true);
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
    getValue(params: MachineParameter[], key: string): string | number | boolean | undefined {

        return params.find(p => p.key === key)?.value;
    }

    /**
     * Test d'une valeur en string ou booleen par rapport à un autre booleen.
     * @param expectedValue Valeur booléenne obligatoire.
     * @param value Valeur pouvant être booléenne,string ou int et qui sera testé.
     * @returns Vrai si les 2 valeurs sont similaires (True & True) ou (False & "False") par exemple
     */
    testBooleanValues(expectedValue: boolean, value: string | boolean | number | undefined){
        if (typeof(value) === "boolean")
        {
            return expectedValue === value;
        }
        else if (typeof(value) === "string")
        {
            if ((expectedValue && value.toLocaleLowerCase() === "true")
                || (!expectedValue && value.toLocaleLowerCase() === "false"))
                return true
        }
        else if (typeof(value) === "number")
        {
            if ((expectedValue && value === 1)
                || (!expectedValue && value === 0))
                return true
        }
        
        return false;
    }

    getValueNumber(params: MachineParameter[], key: string): number | undefined {
        const resultInString = params.find(p => p.key === key)?.value;
        if (resultInString !== undefined){
            const resultInInt = +resultInString;
            return resultInInt;
        }
        return resultInString;
    }

    
    
    testRulesForMachineParameters(rules: Rule[], params: MachineParameter[])
    : RuleResult[] {
        return rules.map(rule => ({
            name: rule.name,
            result: this.testRule(rule, params) ? "Succès" : "Echec",
            errorMessage: rule.errorMessage,
            launchType: rule.sessionType
        }));
    }

}