import React from 'react';
import { ISlotComponent } from '../index';
export interface IConditionalSlotBase {
    children?: any;
    /**
     * Elements or indexed children object passed for filtering
     */
    scope?: any;
    /**
     * Array of slottable components for filtering out
     */
    excludes?: TConditionalSlotArray;
    /**
     * Array of slottable components whitelisted for not being filtered. Overrides 'exclude'
     */
    includes?: TConditionalSlotArray;
    /**
     * Truthy eval of conditions for implementations.
     */
    condition?: any;
}
declare type TConditionalSlotArray = Array<ISlotComponent<any> | IConditionsComponent>;
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
export interface IConditionalSlot<T = {}> extends React.FC<IConditionalSlotBase & T> {
    If: IConditionalSlot;
    ElseIf: IConditionalSlot;
    Else: IConditionalSlot;
    displaySymbol: symbol;
    typeSymbol: symbol;
}
export declare const isConditionsComponent: (entity: ISlotComponent<any> | IConditionalSlot<{}> | IConditionsComponent) => entity is IConditionsComponent;
export declare const evalSlots: (arr: (ISlotComponent<any> | IConditionsComponent)[], childrenObj: Map<string | symbol, import("..").ISortChildrenEl[]>) => boolean;
export declare function createConditionalSlot(Element?: React.ComponentType, typeSymbol?: symbol, parent?: IConditionalSlot): IConditionalSlot;
declare const ConditionalSlotElement: IConditionalSlot;
export default ConditionalSlotElement;
