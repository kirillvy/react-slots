import * as React from 'react';

import useScope from './useScope';

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
  scope?: any;
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
  noHeaders?: boolean;
}

type TAny = any;
type ElType<T> = ISlotComponent<T> | ISlotComponentExtended<T>;

interface IRenderAs extends TAny {
  renderIn?: React.ComponentType<any> | keyof JSX.IntrinsicElements | false;
  /**
   * Props passed into next level component
   */
  renderInProps?: any;
  /**
   * Element injected for rendering instead of default. Any props will have to be compatible.
   */
  renderAs?: React.ComponentType<any> | keyof JSX.IntrinsicElements;
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

export interface ISlotComponentBase<T = any> extends React.FunctionComponent<T | IRenderAs | { children?: any }> {
  Context: React.Context<any>;
  ContextProvider: React.FunctionComponentElement<React.ProviderProps<any>>;
  displaySymbol: symbol;
}

export interface ISlotComponent<T = any> extends ISlotComponentBase<T> {
  Slot: ISlotElement<T>;
  SubSlot: ISubSlotElement<T>;
  Before: IHeaderFooter;
  After: IHeaderFooter;
}

export interface ISlotElementExtended<T> extends ISlotComponent<ISlot<T>> {
  displaySymbol: symbol;
}

export interface ISlotComponentExtended<T = any> extends ISlotComponentBase<T> {
  Slot: ISlotElementExtended<T>;
  SubSlot: ISubSlotElement<T>;
  Before: IHeaderFooter;
  After: IHeaderFooter;
}

interface IOverloadCreateSlot {
  (
    Element: keyof JSX.IntrinsicElements | React.ComponentType<any>,
    renderIn?: React.ComponentType<any> | keyof JSX.IntrinsicElements,
  ): ISlotComponent;
  <T extends keyof JSX.IntrinsicElements>(
    Element: T | React.ComponentType<any>,
    renderIn?: React.ComponentType<any> | keyof JSX.IntrinsicElements,
  ): ISlotComponent<Partial<JSX.IntrinsicElements[T]>>;
  <T extends {}>(
    Element?: React.ComponentType<any>,
    renderIn?: React.ComponentType<any> | keyof JSX.IntrinsicElements,
  ): ISlotComponent<T>;
  <S extends keyof JSX.IntrinsicElements, T extends {}>(
    Element?: React.ComponentType<any>,
    renderIn?: React.ComponentType<any> | keyof JSX.IntrinsicElements,
  ): ISlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
  <T extends {}, S extends keyof JSX.IntrinsicElements>(
    Element?: React.ComponentType<any>,
    renderIn?: React.ComponentType<any> | keyof JSX.IntrinsicElements,
  ): ISlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
}

interface IOverloadCreateLayeredSlot {
  (
    Element: keyof JSX.IntrinsicElements | React.ComponentType<any>,
    renderIn: React.ComponentType<any> | keyof JSX.IntrinsicElements,
  ): ISlotComponentExtended;
  <T extends keyof JSX.IntrinsicElements>(
    Element: T | React.ComponentType<any>,
    renderIn: React.ComponentType<any> | keyof JSX.IntrinsicElements,
  ): ISlotComponentExtended<Partial<JSX.IntrinsicElements[T]>>;
  <T extends {}>(
    Element: React.ComponentType<any>,
    renderIn: React.ComponentType<any> | keyof JSX.IntrinsicElements,
  ): ISlotComponentExtended<T>;
  <S extends keyof JSX.IntrinsicElements, T extends {}>(
    Element: React.ComponentType<any>,
    renderIn: React.ComponentType<any> | keyof JSX.IntrinsicElements,
  ): ISlotComponentExtended<T & Partial<JSX.IntrinsicElements[S]>>;
  <T extends {}, S extends keyof JSX.IntrinsicElements>(
    Element: React.ComponentType<any>,
    renderIn: React.ComponentType<any> | keyof JSX.IntrinsicElements,
  ): ISlotComponentExtended<T & Partial<JSX.IntrinsicElements[S]>>;
}

export interface IHeaderFooter extends React.FunctionComponent {
  displaySymbol: symbol;
  typeSymbol: symbol;
}

export interface ISortChildrenEl {
  index: number;
  child: JSX.Element;
}

export type SlotType<T = {}, S = {}> =
  T extends {} ? S extends keyof JSX.IntrinsicElements ? T & Partial<JSX.IntrinsicElements[S]> : T :
  T extends keyof JSX.IntrinsicElements ? S extends {} ? S & Partial<JSX.IntrinsicElements[T]> :
  Partial<JSX.IntrinsicElements[T]> : any;

export const injectSlot = <T extends {}>(
  Element: ElType<T>, slotProps: ISlot<T>,
) => {
  return (child: JSX.Element, i?: number) => {
    const { children: defaultElement, defaultProps, passedProps, withContext, props, childIs } = slotProps;
    if (withContext === true && defaultElement !== undefined) {
      if (childIs === 'fallback') {
        return null;
      }
      if (Element.Context.Provider === undefined) {
        return null;
      }
      const contextChildren = React.cloneElement(child, { ...props, ...passedProps });
      return React.cloneElement(child, { key: i, ...props, ...passedProps }, (
        React.cloneElement(
          Element.ContextProvider,
          {
            key: i,
            value: useScope(contextChildren.props.children),
          },
          defaultElement,
        )
      ));
    }
    const childProps: any = child.props;
    if (child.props === undefined) {
      return child;
    }
    if (childProps.hasOwnProperty('children')) {
      return React.cloneElement(child, { key: i, ...props, ...passedProps });
    }
    return React.cloneElement(child, { key: i, ...props, ...defaultProps, ...passedProps }, defaultElement);
  };
};

const SlotFactory = <T extends {}>(
  Element: ElType<T>,
): React.FC<ISlot<T>> => (
  slotProps,
  ) => {
    const { scope, children: defaultElement, multiple = false,
      fallback, fallbackProps, childIs, test, noHeaders } = slotProps;
    const childrenObj = useScope(scope);
    const res = childrenObj.get(Element.displaySymbol);
    const headersList = childrenObj.get(Element.Before.displaySymbol) || [];
    const footersList = childrenObj.get(Element.After.displaySymbol) || [];
    const headers = headersList.map((el) => el.child);
    const footers = footersList.map((el) => el.child);
    if (res === undefined) {
      if ((childIs === 'fallback' || childIs === 'both') && defaultElement !== undefined) {
        return React.cloneElement(defaultElement, fallbackProps);
      }
      if (fallback) {
        return React.cloneElement(fallback, fallbackProps);
      }
      return <>{headers}{footers}</>;
    }
    if (multiple === true) {
      let element = res.reduce((prev, { index, child }) => {
        const el = injectSlot(Element, slotProps)(child, index);
        if (el !== null) {
          prev.push(el);
        }
        return prev;
      }, [] as Array<React.FunctionComponentElement<any>>);
      if (test !== undefined) {
        element = element.filter((el) => test(el.props));
      }
      return <>{headers}{element}{footers}</>;
    }
    const { child: childObj } = res[0];
    const result = injectSlot(Element, slotProps)(childObj);
    if (noHeaders && result === null) {
      return result;
    }
    return <>{headers}{result}{footers}</>;
  };

const SubSlotFactory = <T extends {}>(Element: ElType<T>): React.FC<ISubSlot<T>> => (
  { scope: Context, ...props },
) => {
  const scope = React.useContext(Context);
  return Element.Slot({ ...props, scope });
};

const SlottableElement: (
  defaultElement?: React.ComponentType<any> | keyof JSX.IntrinsicElements,
  renderInParam?: React.ComponentType<any> | keyof JSX.IntrinsicElements,
) => React.FC<IRenderAs> = (defaultElement = React.Fragment, renderInParam) => {
  const ElDefault = React.createElement(defaultElement);
  const RenderedIn = renderInParam ? React.createElement(renderInParam) : undefined;
  return (
    { children, renderAs, renderIn, renderInProps, ...props },
  ) => {
    const el = renderAs ? React.createElement(renderAs, props, children) :
      React.cloneElement(ElDefault, props, children);
    if (renderIn) {
      return React.createElement(renderIn, renderInProps, el);
    }
    if (RenderedIn && renderIn !== false) {
      return React.cloneElement(RenderedIn, renderInProps, el);
    }
    return el;
  };
};

/**
 * Slot constructor
 * @param {React.ComponentType<any>} [Element=React.Fragment] - Element for slotting, default is fragment
 */
const createSlot: IOverloadCreateSlot = <T extends {} = {}, S extends {} = {}>(
  Element: React.ComponentType<any> | keyof JSX.IntrinsicElements = React.Fragment,
  renderIn?: React.ComponentType<any> | keyof JSX.IntrinsicElements,
) => {
  type CurType = SlotType<T, S>;
  const SlottedElement = SlottableElement(Element, renderIn) as ISlotComponent<CurType>;
  SlottedElement.Context = React.createContext(null);
  SlottedElement.ContextProvider = React.createElement(SlottedElement.Context.Provider);
  SlottedElement.displaySymbol = Symbol();
  SlottedElement.Before = SlottableElement() as IHeaderFooter;
  SlottedElement.Before.displaySymbol = Symbol();
  SlottedElement.After = SlottableElement() as IHeaderFooter;
  SlottedElement.After.displaySymbol = Symbol();
  SlottedElement.Slot = SlotFactory<CurType>(SlottedElement) as any;
  SlottedElement.Slot.displaySymbol = Symbol();
  SlottedElement.SubSlot = SubSlotFactory<CurType>(SlottedElement) as ISubSlotElement<CurType>;
  SlottedElement.SubSlot.displaySymbol = Symbol();
  if (typeof Element !== 'string') {
    SlottedElement.defaultProps = Element.defaultProps;
    SlottedElement.contextTypes = Element.contextTypes;
  }
  SlottedElement.Slot.displayName = 'Subcomponent.Slot';
  SlottedElement.displayName = `Subcomponent.SlottedElement`;
  SlottedElement.SubSlot.displayName = 'Subcomponent.SubSlot';
  return SlottedElement;
};

export const createLayeredSlot: IOverloadCreateLayeredSlot = <T extends {} = {}, S extends {} = {}>(
  Element: React.ComponentType<any> | keyof JSX.IntrinsicElements = React.Fragment,
  renderIn: React.ComponentType<any> | keyof JSX.IntrinsicElements,
) => {
  type CurType = SlotType<T, S>;
  const SlottedElement = createSlot(Element, renderIn) as ISlotComponentExtended<CurType>;
  SlottedElement.Slot = createSlot(SlottedElement.Slot);
  return SlottedElement;
};

export { createSlot as default };
