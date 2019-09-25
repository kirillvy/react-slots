import React from 'react';
import { ISlotComponentBase, IHeaderFooter, ISubSlotElement, ISubSlot, ISlotElement, ISlot } from '../utils/createSlot';
import { IConditionalSlot } from '.';
interface IHeaderFooterConditional extends IHeaderFooter {
    Conditional: IConditionalSlot;
}
export interface ISlotConditional<T> extends ISlotElement<T> {
    displaySymbol: symbol;
    Conditional: IConditionalSlot<T & ISlot>;
}
interface ISubSlotConditional<T> extends ISubSlotElement<T> {
    Conditional: React.FC<ISubSlot<T>>;
}
interface IHeaderFooterConditional extends IHeaderFooter {
    Conditional: IConditionalSlot;
}
export interface IConditionalSlotComponent<T = any> extends ISlotComponentBase<T> {
    Slot: ISlotConditional<T>;
    SubSlot: ISubSlotConditional<T>;
    Before: IHeaderFooterConditional;
    After: IHeaderFooterConditional;
}
interface IOverloadCreateConditionalSlot {
    (Element: keyof JSX.IntrinsicElements | React.ComponentType<any>): IConditionalSlotComponent;
    <T extends keyof JSX.IntrinsicElements>(Element: T | React.ComponentType<any>): IConditionalSlotComponent<Partial<JSX.IntrinsicElements[T]>>;
    <T extends {}>(Element?: React.ComponentType<any>): IConditionalSlotComponent<T>;
    <S extends keyof JSX.IntrinsicElements, T extends {}>(Element?: React.ComponentType<any>): IConditionalSlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
    <T extends {}, S extends keyof JSX.IntrinsicElements>(Element?: React.ComponentType<any>): IConditionalSlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
}
declare const createConditionalSlot: IOverloadCreateConditionalSlot;
export { createConditionalSlot as default };
