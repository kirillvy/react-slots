import * as React from 'react';

import ConditionalSlot, {
  IConditionalSlot, IConditionalSlotBase, createConditionalSlot,
} from './ConditionalSlot';

interface ISlot<T> {
  /**
   * Default children of element, if any. Otherwise, nothing will be shown.
   */
  children?: any;
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

export interface ISlotConditional<T> extends React.FunctionComponent<T> {
  displaySymbol: symbol;
  Conditional: IConditionalSlot<T>;
}

export interface ISlotComponent<T> extends React.FunctionComponent<T> {
  Context: React.Context<any>;
  displaySymbol: symbol;
  Slot: ISlotConditional<ISlot<T>>;
  SubSlot: ISlotConditional<ISubSlot<T>>;
}

interface IOverloadCreateSlot {
  <T extends {}, S extends keyof JSX.IntrinsicElements>(
    Element?: React.ComponentType<T & Partial<JSX.IntrinsicElements[S]>>,
  ): ISlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
  <S extends keyof JSX.IntrinsicElements, T extends {}>(
    Element?: React.ComponentType<T & Partial<JSX.IntrinsicElements[S]>>,
  ): ISlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
  <T extends keyof JSX.IntrinsicElements>(
    Element: T | React.ComponentType<Partial<JSX.IntrinsicElements[T]>>,
  ): ISlotComponent<Partial<JSX.IntrinsicElements[T]>>;
  <T extends {}>(Element?: React.ComponentType): ISlotComponent<T>;
}

export interface IIndexedChildren {
  [x: string]: ISortChildrenEl[];
}

export interface ISortChildrenEl {
  index: number;
  child: JSX.Element;
}

type SlotType<T = {}, S = {}> =
  T extends {} ? S extends keyof JSX.IntrinsicElements ? T & Partial<JSX.IntrinsicElements[S]> : T :
  T extends keyof JSX.IntrinsicElements ? S extends {} ? S & Partial<JSX.IntrinsicElements[T]> :
   Partial<JSX.IntrinsicElements[T]> : any;

const SlotFactory = <T extends {}>(Element: ISlotComponent<T>): React.FC<ISlot<T>> => (
  { scope, children: defaultElement, multiple = false, defaultProps, passedProps, withContext,
    fallback, fallbackProps, childIs },
) => {
  let childrenObj = scope as IIndexedChildren;
  if (typeof scope !== 'object' || scope.$$isSlottedChildren === undefined) {
    childrenObj = useChildren(scope);
  }
  const injectSlot = (child: JSX.Element, i?: number) => {
    if (withContext === true  && defaultElement !== undefined) {
      if (childIs === 'feedback') {
        return null;
      }
      if (Element.Context.Provider === undefined) {
        return null;
      }
      const contextChildren = React.cloneElement(child, {...passedProps });
      return React.cloneElement(child, { key: i, ...passedProps }, (
      <Element.Context.Provider
        key={i}
        value={useChildren(contextChildren.props.children)}
      >
      {defaultElement}
      </Element.Context.Provider>
      ));
    }
    const props: any = child.props;
    if (props.hasOwnProperty('children')) {
      return React.cloneElement(child, { key: i, ...passedProps });
    } else {
      return React.cloneElement(child, { key: i, ...defaultProps, ...passedProps }, defaultElement);
    }
  };
  const res = childrenObj[Element.displaySymbol as any];
  if (res === undefined) {
    if ((childIs === 'feedback' || childIs === 'both') && defaultElement !== undefined) {
      return React.cloneElement(defaultElement, fallbackProps);
    }
    if (fallback !== undefined) {
      return React.cloneElement(fallback, fallbackProps);
    }
    return null;
  } else {
    if (multiple === true) {
      const element = res.reduce((prev, {index, child}) => {
        const el = injectSlot(child, index);
        if (el !== null) {
          prev.push(el);
        }
        return prev;
      }, [] as Array<React.FunctionComponentElement<any>>);
      return <>{element}</>;
    } else {
      const {child} = res[0];
      return injectSlot(child);
    }
  }
};

const SubSlotFactory = <T extends {}>(Element: ISlotComponent<T>): React.FC<ISubSlot<T>> => (
  { scope: Context, ...props },
) => {
  return <Context.Consumer>{(value) => <Element.Slot {...props} scope={value}/>}</Context.Consumer>;
};

/**
 * Slot constructor
 * @param {React.ComponentType<any>} [Element=React.Fragment] - Element for slotting, default is fragment
 */
export const createSlot: IOverloadCreateSlot = <T extends {} = {}, S extends {} = {}>(
  Element: React.ComponentType | keyof JSX.IntrinsicElements = React.Fragment,
  ) => {
    type CurType = SlotType<T, S>;
    const SlottedElement = (
      ({ children, ...props }: any) => React.createElement(Element, props, children)
      ) as ISlotComponent<CurType>;
    SlottedElement.Context = React.createContext(null);
    SlottedElement.displaySymbol = Symbol();
    SlottedElement.Slot = SlotFactory<CurType>(SlottedElement) as ISlotConditional<ISlot<CurType>>;
    SlottedElement.Slot.displaySymbol = Symbol();
    SlottedElement.Slot.Conditional = createConditionalSlot(SlottedElement.Slot as React.ComponentType);
    SlottedElement.SubSlot = SubSlotFactory<CurType>(SlottedElement) as ISlotConditional<ISubSlot<CurType>>;
    SlottedElement.SubSlot.displaySymbol = Symbol();
    SlottedElement.SubSlot.Conditional = createConditionalSlot(SlottedElement.SubSlot as React.ComponentType);
    if (typeof Element !== 'string') {
      SlottedElement.defaultProps = Element.defaultProps;
      SlottedElement.contextTypes = Element.contextTypes;
      SlottedElement.Slot.displayName = `${Element.displayName}.Slot`;
      SlottedElement.propTypes = Element.propTypes;
      if (Element.displayName === undefined) {
        SlottedElement.Slot.displayName = 'Subcomponent.Slot';
      }
    } else {
      SlottedElement.Slot.displayName = `${Element}.Slot`;
      SlottedElement.displayName = `${SlottedElement.displayName}.SlottedElement`;
      if (Element === undefined) {
        SlottedElement.Slot.displayName = 'Subcomponent.Slot';
        SlottedElement.displayName = `Subcomponent.SlottedElement`;
      }
    }
    SlottedElement.SubSlot.displayName = 'SubSlot';
    SlottedElement.SubSlot.displayName = 'SubSlot';
    return SlottedElement;
};

/**
 * Indexes React children for faster access by Slot components
 * @param scope - react children, in any format
 */
export const useChildren = (scope: any): IIndexedChildren => {
  if (scope === undefined || scope.length === 0) {
    return {};
  }
  const childrenCount = React.Children.count(scope);
  const result: IIndexedChildren = {};
  const injectSlot = (child: JSX.Element, index: number) => {
    let childType = 'rest';
    if (React.isValidElement(child) && child.type !== undefined) {
      const obj: any = child.type;
      if (obj.hasOwnProperty('displayName')) {
        childType = obj.displayName || 'rest';
      }
      if (obj.hasOwnProperty('displaySymbol')) {
        childType = obj.displaySymbol;
      }
    }
    if (result[childType] === undefined) {
      result[childType] = [];
    }
    result[childType].push({index, child});
  };
  if (childrenCount === 1) {
    injectSlot(scope, 0);
  } else if (childrenCount > 1) {
      React.Children.forEach(scope, injectSlot);
  }
  result.$$isSlottedChildren = [];
  return result;
};

import NonSlotted from './NonSlotted';
export { NonSlotted };
export { ConditionalSlot };

export default createSlot;
