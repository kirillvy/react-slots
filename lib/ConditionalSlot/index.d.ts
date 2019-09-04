import React from 'react';
import { TConditionalSlot } from '../utils/useScope';
export interface IConditionalSlotBase {
    children?: any;
    /**
     * Elements or indexed children object passed for filtering
     */
    scope?: any;
    /**
     * Array of slottable components for filtering out
     */
    excludes?: TConditionalSlot[];
    /**
     * Array of slottable components whitelisted for not being filtered. Overrides 'exclude'
     */
    includes?: TConditionalSlot[];
    /**
     * Truthy eval of conditions for implementations.
     */
    condition?: any;
}
export interface IConditionalSlot<T = {}> extends React.FC<IConditionalSlotBase & T> {
    If: IConditionalSlot;
    ElseIf: IConditionalSlot;
    Else: IConditionalSlot;
    displaySymbol: symbol;
    typeSymbol: symbol;
}
export declare function createDefaultConditionalSlot(Element?: React.ComponentType, typeSymbol?: symbol, parent?: IConditionalSlot): IConditionalSlot;
declare const ConditionalSlotElement: IConditionalSlot;
export default ConditionalSlotElement;
