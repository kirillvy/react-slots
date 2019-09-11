/// <reference types="react" />
import { ISortChildrenEl } from './createSlot';
import { IConditionsComponent, TConditionalSlot } from './useScope';
export declare class ScopeUtils {
    static isConditionsComponent: (entity: TConditionalSlot) => entity is IConditionsComponent;
    /**
     * Reduces conditions to an object.
     */
    static reduceConds: (arr: TConditionalSlot[]) => {
        [x: string]: TConditionalSlot;
    };
    /**
     * Sorts elements by order of appearance
     * @param els children object to sort into children
     */
    static sortElements(els: ISortChildrenEl[]): JSX.Element[];
    /**
     * Returns grouped elements, by order of appearance
     * @param els children object to sort into children
     */
    static mapElements(els: ISortChildrenEl[]): JSX.Element[];
}
export { ScopeUtils as default };
