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
interface IConditionalSubSlot extends IConditionalSlotBase {
    scope: React.Context<any>;
}
interface IOverloadCreateConditional {
    (Element: keyof JSX.IntrinsicElements | React.ComponentType): IConditionalSlot;
    <T extends keyof JSX.IntrinsicElements>(Element: T | React.ComponentType): IConditionalSlot<Partial<JSX.IntrinsicElements[T]>>;
    <T extends {}>(Element: React.ComponentType): IConditionalSlot<T>;
    <S extends keyof JSX.IntrinsicElements, T extends {}>(Element: React.ComponentType): IConditionalSlot<T & Partial<JSX.IntrinsicElements[S]>>;
    <T extends {}, S extends keyof JSX.IntrinsicElements>(Element: React.ComponentType): IConditionalSlot<T & Partial<JSX.IntrinsicElements[S]>>;
}
export interface IConditionalSlot<T = {}> extends React.FC<IConditionalSlotBase & T> {
    If: IConditionalSlot;
    ElseIf: IConditionalSlot;
    Else: IConditionalSlot;
    SubSlot: React.FC<IConditionalSubSlot & T>;
    displaySymbol: symbol;
    typeSymbol: symbol;
}
export declare function createDefaultConditionalSlot(Element?: keyof JSX.IntrinsicElements | React.ComponentType, typeSymbol?: symbol, parent?: IConditionalSlot): IConditionalSlot;
declare const ConditionalSlotElement: IConditionalSlot;
export declare const createConditionalElement: IOverloadCreateConditional;
export { ConditionalSlotElement as default };
