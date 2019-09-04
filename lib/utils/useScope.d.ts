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
export declare const isConditionsComponent: (entity: IConditionsComponent | ISlotComponent<any>) => entity is IConditionsComponent;
/**
 * Scope object. Slottable elements are tracked as Element.DisplaySymbol
 * Custom components as Element.DisplayName.
 */
declare class ScopeMap extends Map<symbol | string, ISortChildrenEl[]> {
    private lastIndex;
    constructor();
    /**
     * Injects element into the scope
     * @param child JSX element to inject
     */
    injectElement: (child: JSX.Element) => void;
    /**
     * Sorts elements by order of appearance
     * @param els children object to sort into children
     */
    sortEls(els: ISortChildrenEl[]): JSX.Element[];
    /**
     * Returns grouped elements, by order of appearance
     * @param els children object to sort into children
     */
    mapEls(els: ISortChildrenEl[]): JSX.Element[];
    /**
     * Tests whether object includes all conditional slots
     * @param arr conditional slots for inclusion
     */
    includes: (...arr: (IConditionsComponent | ISlotComponent<any>)[]) => boolean;
    /**
     * Tests whether object excludes all conditional slots
     * @param arr conditional slots for exclusion
     */
    excludes(...arr: TConditionalSlot[]): boolean;
    /**
     * Returns array of conditional slots included
     * @param arr conditional slots for inclusion
     */
    includeSlots: (arr: (IConditionsComponent | ISlotComponent<any>)[]) => ISortChildrenEl[];
    /**
     * Returns array of conditional slots without the excluded ones
     * @param arr conditional slots for exclusion
     * @param all include all elements including non-conditional slots
     */
    excludeSlots: (arr: (IConditionsComponent | ISlotComponent<any>)[], all?: boolean | undefined) => ISortChildrenEl[];
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
export default useScope;
