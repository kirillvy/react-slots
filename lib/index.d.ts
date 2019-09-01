import * as React from 'react';
import ConditionalSlot, { IConditionalSlot, IConditionalSlotBase } from './ConditionalSlot';
import useChildren from './utils/useChildren';
interface ISlot<T> {
    /**
     * Default children of element, if any. Otherwise, nothing will be shown.
     */
    children?: any;
    /**
     * Props that will always be rendered, no matter the scenario
     */
    props?: T;
    /**
     * default props to use when the default element is rendered
     */
    defaultProps?: JSX.IntrinsicAttributes & React.PropsWithChildren<T>;
    /**
     * props passed to the element from the component containing the slot
     */
    passedProps?: T;
    /**
     * Elements or indexed children object passed for filtering
     */
    scope: any;
    /**
     * Slottable component test
     */
    test?: <S = any>(props: S) => boolean;
    /**
     * Display all if multiple slots are passed
     */
    multiple?: boolean;
    /**
     * Components are composed through their immediate children instead of
     * children of element
     */
    withContext?: boolean;
    /**
     * fallback to use if slot is not used
     */
    fallback?: any;
    /**
     * default props to use with default element
     */
    fallbackProps?: JSX.IntrinsicAttributes & React.PropsWithChildren<T>;
    /**
     * Designate the children prop as the default element, the fallback element or both
     */
    childIs?: 'fallback' | 'default' | 'both';
    /**
     * Component is always rendered.
     */
    unconditional?: boolean;
}
interface IRenderAs {
    /**
     * Element injected for rendering instead of default. Any props will have to be compatible.
     */
    renderAs?: React.ComponentType | keyof JSX.IntrinsicElements;
}
interface ISubSlot<T> extends Partial<ISlot<T>> {
    scope: React.Context<any>;
}
export interface ISlotConditional<T> extends React.FunctionComponent<T> {
    displaySymbol: symbol;
    Conditional: IConditionalSlot<T>;
}
export interface ISubSlotConditional<T> extends React.FunctionComponent<T> {
    displaySymbol: symbol;
    Conditional: React.FC<T & IConditionalSlotBase>;
}
export interface ISlotComponent<T> extends React.FunctionComponent<T> {
    Context: React.Context<any>;
    displaySymbol: symbol;
    Slot: ISlotConditional<ISlot<T>>;
    SubSlot: ISubSlotConditional<ISubSlot<T>>;
    Before: IHeaderFooter;
    After: IHeaderFooter;
}
interface IOverloadCreateSlot {
    <T extends {}, S extends keyof JSX.IntrinsicElements>(Element?: React.ComponentType<T & Partial<JSX.IntrinsicElements[S]>>): ISlotComponent<T & Partial<JSX.IntrinsicElements[S]> & IRenderAs>;
    <S extends keyof JSX.IntrinsicElements, T extends {}>(Element?: React.ComponentType<T & Partial<JSX.IntrinsicElements[S]>>): ISlotComponent<T & Partial<JSX.IntrinsicElements[S]> & IRenderAs>;
    <T extends keyof JSX.IntrinsicElements>(Element: T | React.ComponentType<Partial<JSX.IntrinsicElements[T]>>): ISlotComponent<Partial<JSX.IntrinsicElements[T]> & IRenderAs>;
    <T extends {}>(Element?: React.ComponentType): ISlotComponent<T & IRenderAs>;
}
interface IHeaderFooter extends React.FunctionComponent {
    displaySymbol: symbol;
    typeSymbol: symbol;
    Conditional: IConditionalSlot;
}
export declare type IIndexedChildren = Map<symbol | string, ISortChildrenEl[]>;
export interface ISortChildrenEl {
    index: number;
    child: JSX.Element;
}
/**
 * Slot constructor
 * @param {React.ComponentType<any>} [Element=React.Fragment] - Element for slotting, default is fragment
 */
export declare const createSlot: IOverloadCreateSlot;
import FilterSlot from './FilterSlot';
export { FilterSlot as NonSlotted };
export { FilterSlot as FilterSlot, useChildren, ConditionalSlot };
export default createSlot;
