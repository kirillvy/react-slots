import React from 'react';
import { ISlotComponentBase, IHeaderFooter, ISlotComponent, ISubSlotElement, ISubSlot, ISlotElement, ISlot } from '../utils/createSlot';
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
export declare function createDefaultConditionalSlot(Element?: React.ComponentType, typeSymbol?: symbol, parent?: IConditionalSlot): IConditionalSlot;
interface IHeaderFooterConditional extends IHeaderFooter {
    Conditional: IConditionalSlot;
}
interface ISlotConditional<T> extends ISlotElement<T> {
    displaySymbol: symbol;
    Conditional: IConditionalSlot<T & ISlot>;
}
interface ISubSlotConditional<T> extends ISubSlotElement<T> {
    Conditional: React.FC<ISubSlot<T>>;
}
interface IHeaderFooterConditional extends IHeaderFooter {
    Conditional: IConditionalSlot;
}
interface IConditionalSlotComponent<T = any> extends ISlotComponentBase<T> {
    Slot: ISlotConditional<T>;
    SubSlot: ISubSlotConditional<T>;
    Before: IHeaderFooterConditional;
    After: IHeaderFooterConditional;
}
interface IOverloadCreateConditionalSlot {
    (Element: keyof JSX.IntrinsicElements | React.ComponentType): IConditionalSlotComponent;
    <T extends keyof JSX.IntrinsicElements>(Element: T | React.ComponentType): IConditionalSlotComponent<Partial<JSX.IntrinsicElements[T]>>;
    <T extends {}>(Element?: React.ComponentType): IConditionalSlotComponent<T>;
    <S extends keyof JSX.IntrinsicElements, T extends {}>(Element?: React.ComponentType): IConditionalSlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
    <T extends {}, S extends keyof JSX.IntrinsicElements>(Element?: React.ComponentType): IConditionalSlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
}
export declare const createConditionalSlot: IOverloadCreateConditionalSlot;
declare const ConditionalSlotElement: IConditionalSlot;
export default ConditionalSlotElement;
