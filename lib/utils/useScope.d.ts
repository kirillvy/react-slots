/// <reference types="react" />
import { ISortChildrenEl, ISlotComponent } from './createSlot';
/**
 * Indexes React children for faster access by Slot components
 * @param scope - react children, in any format
 */
export interface IConditionsComponent {
    /**
     * Slottable component for filtering
     */
    slot: ISlotComponent<any>;
    /**
     * Slottable component test
     */
    test: <T = any>(props: T) => boolean;
}
export declare type TConditionalSlot = ISlotComponent<any> | IConditionsComponent;
/**
 * Scope object. Slottable elements are tracked as Element.DisplaySymbol
 * Custom components as Element.DisplayName.
 */
export declare class ScopeMap extends Map<symbol | string, ISortChildrenEl[]> {
    static isConditionsComponent: (entity: ISlotComponent<any> | IConditionsComponent) => entity is IConditionsComponent;
    /**
     * Reduces conditions to an object.
     */
    static reduceConds: (arr: (ISlotComponent<any> | IConditionsComponent)[]) => {
        [x: string]: ISlotComponent<any> | IConditionsComponent;
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
    private lastIndex;
    private children;
    constructor(childrenProp?: any);
    /**
     * Injects element into the scope
     * @param child JSX element to inject
     */
    scopeChildren: () => any;
    /**
     * inject JSX element into scope object
     */
    injectElement: (child: JSX.Element) => void;
    /**
     * Tests whether object includes all conditional slots
     * @param arr conditional slots for inclusion
     */
    includes: (...arr: (ISlotComponent<any> | IConditionsComponent)[]) => boolean;
    /**
     * Tests whether object excludes all conditional slots
     * @param arr conditional slots for exclusion
     */
    excludes(...arr: TConditionalSlot[]): boolean;
    /**
     * Returns array of conditional slots included
     * @param arr conditional slots for inclusion
     */
    includeSlots: (arr: (ISlotComponent<any> | IConditionsComponent)[]) => ISortChildrenEl[];
    /**
     * Returns array of conditional slots without the excluded ones
     * @param arr conditional slots for exclusion
     * @param all include all elements including non-conditional slots
     */
    excludeSlots: (arr: (ISlotComponent<any> | IConditionsComponent)[], all?: boolean | undefined) => ISortChildrenEl[];
    /**
     * Returns all non-slot elements in scope
     */
    nonSlotted: () => ISortChildrenEl[];
    /**
     * controls index on insert
     */
    private pushLastIndex;
    /**
     * filters slots by params
     */
    private filterSlot;
    /**
     * evals slots by params
     */
    private evalSlot;
}
/**
 * Creates scope object for work with slots
 * @param scope - React Children prop
 */
declare const useScope: (scope: any) => ScopeMap;
export { useScope as default };
