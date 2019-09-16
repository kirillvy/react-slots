import * as React from 'react';
import {injectSlot} from '../utils/createSlot';
import {ScopeMap} from '../utils/useScope';
import { ISlotComponent } from '../utils/createSlot';

/**
 * Allows composition through children.
 */
export interface ICompositionSlot {
  /**
   * Children with rules on passing (reads props, multiple, )
   */
  children?: any;
  /**
   * Elements or indexed children object passed for Compositioning
   */
  scope: any;
  /**
   * Include all non-slottable elements
   */
  all?: boolean;
  /**
   * [planned] - group by type in order of appearance. Currently not implemented,
   * but will be if cases are found.
   */
  // grouped?: boolean;
}

const isSlotted = (
  child: any | ISlotComponent,
  ): child is ISlotComponent => child && child.type && child.type.displaySymbol;

export interface ICompositionSubSlot extends ICompositionSlot {
  scope: React.Context<any>;
}

interface ICompositionSlotComponent<T = {}> extends React.FC<ICompositionSlot & T> {
  SubSlot: React.FunctionComponent<ICompositionSubSlot>;
}

const CompositionSlotFactory = (Element: React.FC<ICompositionSlot>): React.FC<ICompositionSubSlot> => (
  { scope: Context, ...props },
) => {
  return <Context.Consumer>{(value) => <Element {...props} scope={value} />}</Context.Consumer>;
};

interface IOverloadCreateCompositionSlot {
  (Element: keyof JSX.IntrinsicElements | React.ComponentType): ICompositionSlotComponent;
  <T extends keyof JSX.IntrinsicElements>(
    Element: T | React.ComponentType,
  ): ICompositionSlotComponent<Partial<JSX.IntrinsicElements[T]>>;
  <T extends {}>(Element?: React.ComponentType): ICompositionSlotComponent<T>;
  <S extends keyof JSX.IntrinsicElements, T extends {}>(
    Element?: React.ComponentType,
  ): ICompositionSlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
  <T extends {}, S extends keyof JSX.IntrinsicElements>(
    Element?: React.ComponentType,
  ): ICompositionSlotComponent<T & Partial<JSX.IntrinsicElements[S]>>;
}
const createCompositionSlot: IOverloadCreateCompositionSlot = (
    Element: keyof JSX.IntrinsicElements | React.ComponentType = React.Fragment,
  ) => {
  const createdElement = React.createElement(Element);
  const CompositionSlotComponent = ({ scope, all, children }: ICompositionSlot) => {
    const childrenArr = Array.isArray(children) ? children : [children];
    const childrenObj = childrenArr.reduce((prev, el) => {
      if (el.type && el.type.displaySymbol) {
        if (!prev[el.type.displaySymbol]) {
          prev[el.type.displaySymbol] = [];
        }
        prev[el.type.displaySymbol].push(el);
      }
      return prev;
    },
    {} as {[name: string]: any[]});
    const res: JSX.Element[] = [];
    const filterElement = (child: JSX.Element, key?: number) => {
      if (isSlotted(child) && child.type && child.type.Slot) {
        const result = childrenObj[child.type.Slot.displaySymbol];
        if (result) {
          for (const El of result) {
            const slotted = injectSlot(child.type, El.props)(child, key);
            if (slotted) {
              res.push(slotted);
            }
          }
        }
      } else if (all) {
        res.push(child);
      }
    };
    let scopeObj = scope;
    if (scope instanceof ScopeMap) {
      scopeObj = scope.scopeChildren();
    }
    const childrenCount = React.Children.count(scopeObj);
    if (childrenCount === 1) {
      filterElement(scopeObj);
    } else if (childrenCount > 1) {
        React.Children.forEach(scopeObj, filterElement);
    }
    return React.cloneElement(createdElement, {}, res);
  };
  CompositionSlotComponent.SubSlot = CompositionSlotFactory(CompositionSlotComponent);
  return CompositionSlotComponent;
};

const CompositionSlot: ICompositionSlotComponent = createCompositionSlot();

export default CompositionSlot;
