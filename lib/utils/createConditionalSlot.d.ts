import React from 'react';
import { ISlotComponentBase, IHeaderFooter, ISubSlotElement, ISubSlot, ISlotElement, ISlot } from './createSlot';
import { IConditionalSlot } from '../ConditionalSlot';
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
declare const createConditionalSlot: IOverloadCreateConditionalSlot;
export default createConditionalSlot;
