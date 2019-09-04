import * as React from 'react';
export interface ISlot<T = any> {
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
declare type TAny = any;
interface IRenderAs extends TAny {
    /**
     * Element injected for rendering instead of default. Any props will have to be compatible.
     */
    renderAs: React.ComponentType | keyof JSX.IntrinsicElements;
}
export interface ISubSlot<T> extends Partial<ISlot<T>> {
    scope: React.Context<any>;
}
export interface ISlotElement<T> extends React.FunctionComponent<ISlot<T>> {
    displaySymbol: symbol;
}
export interface ISubSlotElement<T> extends React.FunctionComponent<ISubSlot<T>> {
    displaySymbol: symbol;
}
export interface ISlotComponentBase<T = any> extends React.FunctionComponent<T | IRenderAs | {
    children?: any;
}> {
    Context: React.Context<any>;
    displaySymbol: symbol;
}
export interface ISlotComponent<T = any> extends ISlotComponentBase<T> {
    Slot: ISlotElement<T>;
    SubSlot: ISlotElement<T>;
    Before: IHeaderFooter;
    After: IHeaderFooter;
}
interface IOverloadCreateSlot {
    (Element: keyof JSX.IntrinsicElements | React.ComponentType): ISlotComponent;
    <T extends keyof JSX.IntrinsicElements>(Element: T | React.ComponentType): ISlotComponent<Partial<JSX.IntrinsicElements[T]>>;
    <T extends {}>(Element?: React.ComponentType): ISlotComponent<T>;
    <S extends keyof JSX.IntrinsicElements, T extends {}>(Element?: React.ComponentType): ISlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
    <T extends {}, S extends keyof JSX.IntrinsicElements>(Element?: React.ComponentType): ISlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
}
export interface IHeaderFooter extends React.FunctionComponent {
    displaySymbol: symbol;
    typeSymbol: symbol;
}
export interface ISortChildrenEl {
    index: number;
    child: JSX.Element;
}
export declare type SlotType<T = {}, S = {}> = T extends {} ? S extends keyof JSX.IntrinsicElements ? T & Partial<JSX.IntrinsicElements[S]> : T : T extends keyof JSX.IntrinsicElements ? S extends {} ? S & Partial<JSX.IntrinsicElements[T]> : Partial<JSX.IntrinsicElements[T]> : any;
/**
 * Slot constructor
 * @param {React.ComponentType<any>} [Element=React.Fragment] - Element for slotting, default is fragment
 */
declare const createSlot: IOverloadCreateSlot;
export default createSlot;
