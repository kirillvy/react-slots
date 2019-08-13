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
}

interface ISlotComponentSlot<T> extends ISlotComponentCtx<T> {
  Slot: React.FunctionComponent<ISlot<T>>;
}

export interface ISlotComponent<T> extends ISlotComponentSlot<T> {
  SubSlot: React.FunctionComponent<ISubSlot<T>>;
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

type SlotType<T = {}, S = {}> =
  T extends {} ? S extends keyof JSX.IntrinsicElements ? T & Partial<JSX.IntrinsicElements[S]> : T :
  T extends keyof JSX.IntrinsicElements ? S extends {} ? S & Partial<JSX.IntrinsicElements[T]> :
   Partial<JSX.IntrinsicElements[T]> : any;

const SlotFactory = <T extends {}>(Element: ISlotComponentCtx<T>): React.FC<ISlot<T>> => (
  { scope, children: defaultElement, multiple = false, defaultProps, passedProps, withContext,
    fallback, fallbackProps, childIs },
) => {
  const SlottedChild: React.ReactElement[] = [];
  if (scope === undefined || scope.length === 0) {
    return null;
  }
  const childrenCount = React.Children.count(scope);
  const injectSlot = (child: JSX.Element, i?: number) => {
    if (!React.isValidElement(child)) {
      return;
    }
    if (child.type === Element) {
      if (withContext === true  && defaultElement !== undefined) {
        if (childIs === 'feedback') {
          return;
        }
        if (Element.Context.Provider === undefined) {
          return;
        }
        SlottedChild.push(React.cloneElement(child, { key: i, ...defaultProps, ...passedProps }, (
        <Element.Context.Provider
          key={i}
          value={React.cloneElement(child, {...passedProps })}
        >
        {defaultElement}
        </Element.Context.Provider>
        )));
        return;
      }
      const props: any = child.props;
      if (props.hasOwnProperty('children')) {
        SlottedChild.push(React.cloneElement(child, { key: i, ...defaultProps, ...passedProps }));
      } else {
        SlottedChild.push(React.cloneElement(child, { key: i, ...defaultProps, ...passedProps }, defaultElement));
      }
    }
  };

  if (childrenCount === 1) {
    injectSlot(React.Children.only(scope));
  } else if (childrenCount > 1) {
      React.Children.forEach(scope, injectSlot);
  }
  if (SlottedChild.length === 0) {
    if (fallback !== undefined) {
      return React.cloneElement(fallback, fallbackProps);
    }
    if ((childIs === 'feedback' || childIs === 'both') && defaultElement !== undefined) {
      return React.cloneElement(defaultElement, fallbackProps);
    }
    return null;
  }
  if (multiple === true) {
    return <>{SlottedChild}</>;
  }
  return SlottedChild[0];
};

const SubSlotFactory = <T extends {}>(Element: ISlotComponentSlot<T>): React.FC<ISubSlot<T>> => (
  { scope: Context, ...props },
) => {
  return <Context.Consumer>{(value) => <Element.Slot {...props} scope={value.props.children}/>}</Context.Consumer>;
};

/**
 * Slot constructor
 * @param {React.ComponentType<any>} [Element=React.Fragment] - Element for slotting, default is fragment
 */
export const createSlot: IOverloadCreateSlot = <T extends {} = {}, S extends {} = {}>(
  Element: React.ComponentType | keyof JSX.IntrinsicElements = React.Fragment,
  ) => {
    type CurType = SlotType<T, S>;
    const SlottedElement = ({ children, ...props }: any) => React.createElement(Element, props, children);
    SlottedElement.Context = React.createContext(null);
    SlottedElement.Slot = SlotFactory<CurType>(SlottedElement as ISlotComponentCtx<CurType>);
    SlottedElement.SubSlot = SubSlotFactory<CurType>(SlottedElement as ISlotComponentSlot<CurType>);
    const result = SlottedElement as ISlotComponent<CurType>;
    if (typeof Element !== 'string') {
      result.defaultProps = Element.defaultProps;
      result.contextTypes = Element.contextTypes;
      result.Slot.displayName = `${Element.displayName}.Slot`;
      result.propTypes = Element.propTypes;
      if (Element.displayName === undefined) {
        result.Slot.displayName = 'Subcomponent.Slot';
      }
    } else {
      result.Slot.displayName = `${Element}.Slot`;
      if (Element === undefined) {
        result.Slot.displayName = 'Subcomponent.Slot';
      }
    }
    result.displayName = 'SlottedElement';
    result.SubSlot.displayName = 'SubSlot';
    return result;
};
import NonSlotted from './NonSlotted/index';

export {NonSlotted};

export default createSlot;
