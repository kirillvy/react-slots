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
     * Use the default element as the fallback
     */
    fallbackOnDefault?: boolean;
}
interface ISubSlot<T> extends Partial<ISlot<T>> {
    scope: React.Context<any>;
}
interface ISlotComponentCtx<T> extends React.FunctionComponent<T> {
    Context: React.Context<any>;
}
interface ISlotComponentSlot<T> extends ISlotComponentCtx<T> {
    Slot: React.FunctionComponent<ISlot<T>>;
}
interface ISlotComponent<T> extends ISlotComponentSlot<T> {
    SubSlot: React.FunctionComponent<ISubSlot<T>>;
}
interface IOverloadCreateSlot {
    <T extends {}, S extends keyof JSX.IntrinsicElements>(Element?: React.ComponentType<T & Partial<JSX.IntrinsicElements[S]>>): ISlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
    <S extends keyof JSX.IntrinsicElements, T extends {}>(Element?: React.ComponentType<T & Partial<JSX.IntrinsicElements[S]>>): ISlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
    <T extends keyof JSX.IntrinsicElements>(Element: T | React.ComponentType<Partial<JSX.IntrinsicElements[T]>>): ISlotComponent<{
        children?: any;
    } & Partial<JSX.IntrinsicElements[T]>>;
    <T extends {}>(Element?: React.ComponentType): ISlotComponent<T>;
}
interface INonSlotted {
    scope: any;
    slots: Array<ISlotComponent<any>>;
}
interface INonSubSlotted extends INonSlotted {
    scope: React.Context<any>;
}
interface INonSlotComponent extends React.FC<INonSlotted> {
    SubSlot: React.FunctionComponent<INonSubSlotted>;
}
/**
 * Slot constructor
 * @param {React.ComponentType<any>} [Element=React.Fragment] - Element for slotting, default is fragment
 */
export declare const createSlot: IOverloadCreateSlot;
export declare const NonSlotted: INonSlotComponent;
export default createSlot;
