import React from 'react';
import createSlot, { ISlotComponentBase, IHeaderFooter, SlotType,
  ISubSlotElement, ISubSlot, ISlotElement, ISlot } from '../utils/createSlot';
import {IConditionalSlot, createDefaultConditionalSlot} from '.';

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
  (Element: keyof JSX.IntrinsicElements | React.ComponentType): IConditionalSlotComponent;
  <T extends keyof JSX.IntrinsicElements>(
    Element: T | React.ComponentType,
  ): IConditionalSlotComponent<Partial<JSX.IntrinsicElements[T]>>;
  <T extends {}>(Element?: React.ComponentType): IConditionalSlotComponent<T>;
  <S extends keyof JSX.IntrinsicElements, T extends {}>(
    Element?: React.ComponentType,
  ): IConditionalSlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
  <T extends {}, S extends keyof JSX.IntrinsicElements>(
    Element?: React.ComponentType,
  ): IConditionalSlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
}
const ConditionalSubSlotFactory = <T extends {}>(Element: IConditionalSlotComponent): React.FC<ISubSlot<T>> => (
  { scope: Context, ...props },
) => {
  return <Context.Consumer>{(value) => <Element.Slot.Conditional {...props} scope={value}/>}</Context.Consumer>;
};

const createConditionalSlot: IOverloadCreateConditionalSlot = <T extends {} = {}, S extends {} = {}>(
  Element: React.ComponentType | keyof JSX.IntrinsicElements = React.Fragment,
  ) => {
  type CurType = SlotType<T, S>;
  const SlottedElement = createSlot(Element) as IConditionalSlotComponent<CurType>;
  SlottedElement.Slot.Conditional = createDefaultConditionalSlot(
    SlottedElement.Slot as React.ComponentType) as IConditionalSlot<CurType & ISlot<any>>;
  SlottedElement.SubSlot.Conditional = ConditionalSubSlotFactory<CurType>(SlottedElement);
  SlottedElement.Before.Conditional = createDefaultConditionalSlot(SlottedElement.Before as React.ComponentType);
  SlottedElement.Before.Conditional.displaySymbol = SlottedElement.Before.displaySymbol;
  SlottedElement.After.Conditional = createDefaultConditionalSlot(SlottedElement.After as React.ComponentType);
  SlottedElement.After.Conditional.displaySymbol = SlottedElement.After.displaySymbol;
  return SlottedElement;
};

export {createConditionalSlot as default};
