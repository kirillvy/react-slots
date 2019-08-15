import * as React from 'react';
interface ISlot<T> {
    /**
     * Default children of element, if any. Otherwise, nothing will be shown.
     */
    children?: any;
    /**
     * default props to use with default element
     */
    defaultProps?: JSX.IntrinsicAttributes & React.PropsWithChildren<T>;
    /**
     * props passed to the element from the component containing the slot
     */
    passedProps?: T;
    /**
     * Elements passed for filtering
     */
    scope: any;
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
    childIs?: 'feedback' | 'default' | 'both';
}
interface ISubSlot<T> extends Partial<ISlot<T>> {
    scope: React.Context<any>;
}
interface ISlotComponentCtx<T> extends React.FunctionComponent<T> {
    Context: React.Context<any>;
    displaySymbol: symbol;
}
interface ISlotComponentSlot<T> extends ISlotComponentCtx<T> {
    Slot: React.FunctionComponent<ISlot<T>>;
}
export interface ISlotComponent<T> extends ISlotComponentSlot<T> {
    SubSlot: React.FunctionComponent<ISubSlot<T>>;
}
interface IOverloadCreateSlot {
    <T extends {}, S extends keyof JSX.IntrinsicElements>(Element?: React.ComponentType<T & Partial<JSX.IntrinsicElements[S]>>): ISlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
    <S extends keyof JSX.IntrinsicElements, T extends {}>(Element?: React.ComponentType<T & Partial<JSX.IntrinsicElements[S]>>): ISlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
    <T extends keyof JSX.IntrinsicElements>(Element: T | React.ComponentType<Partial<JSX.IntrinsicElements[T]>>): ISlotComponent<Partial<JSX.IntrinsicElements[T]>>;
    <T extends {}>(Element?: React.ComponentType): ISlotComponent<T>;
}
export interface ISortChildren {
    [x: string]: ISortChildrenEl[];
}
export interface ISortChildrenEl {
    index: number;
    child: JSX.Element;
}
/**
 * Slot constructor
 * @param {React.ComponentType<any>} [Element=React.Fragment] - Element for slotting, default is fragment
 */
export declare const createSlot: IOverloadCreateSlot;
import NonSlotted from './NonSlotted/index';
export declare const useChildren: (scope: any) => ISortChildren;
export { NonSlotted };
export default createSlot;
