import * as React from 'react';
import {injectSlot} from '../utils/createSlot';
import {ScopeMap} from '../utils/useScope';
import { ISlotComponent } from '../utils/createSlot';

/**
 * Allows composition through children.
 */
interface ICompositionSlot {
  /**
   * Children with rules on passing (reads props, multiple, )
   */
  children?: any;
  /**
   * Elements or indexed children object passed for Compositioning
   */
  scope: any;
  /**
   * Composition out all slottable components, overrides include and exclude properties
   */
  all?: boolean;
  // grouped?: boolean;
}

const isSlotted = (
  child: any | ISlotComponent,
  ): child is ISlotComponent => child && child.type && child.type.displaySymbol;

interface ICompositionSubSlot extends ICompositionSlot {
  scope: React.Context<any>;
}

interface ICompositionSlotComponent extends React.FC<ICompositionSlot> {
  SubSlot: React.FunctionComponent<ICompositionSubSlot>;
}

const CompositionSlotFactory = (Element: React.FC<ICompositionSlot>): React.FC<ICompositionSubSlot> => (
  { scope: Context, ...props },
) => {
  return <Context.Consumer>{(value) => <Element {...props} scope={value} />}</Context.Consumer>;
};

const createCompositionSlot = (
    Element: keyof JSX.IntrinsicElements | React.ComponentType = React.Fragment,
  ) => {
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
          for (let i = 0; i < result.length; i++) {
            const El = result[i];
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
    return React.createElement(Element, {}, res);
  };
  CompositionSlotComponent.SubSlot = CompositionSlotFactory(CompositionSlotComponent);
  return CompositionSlotComponent;
};

const CompositionSlot: ICompositionSlotComponent = createCompositionSlot();

export default CompositionSlot;
