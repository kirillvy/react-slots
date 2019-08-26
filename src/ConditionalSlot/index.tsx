import React from 'react';
import { ISlotComponent, IIndexedChildren } from '../index';
import useChildren from '../utils/useChildren';
import FilterSlot from '../FilterSlot';

export interface IConditionalSlotBase {
  children?: any;
  /**
   * Elements or indexed children object passed for filtering
   */
  scope?: any;
  /**
   * Array of slottable components for filtering out
   */
  excludes?: TConditionalSlotArray;
  /**
   * Array of slottable components whitelisted for not being filtered. Overrides 'exclude'
   */
  includes?: TConditionalSlotArray;
  /**
   * Truthy eval of conditions for implementations.
   */
  condition?: any;
}

type TConditionalSlotArray = Array<ISlotComponent<any> | IConditionsComponent>;

export interface IConditionsComponent {
  /**
   * Slottable component for filtering
   */
  slot: ISlotComponent<any>;
  /**
   * Slottable component test
   */
  test: <T = any>(props: T) => boolean;
}

export interface IConditionalSlot<T = {}> extends React.FC<IConditionalSlotBase & T> {
  If: IConditionalSlot;
  ElseIf: IConditionalSlot;
  Else: IConditionalSlot;
  displaySymbol: symbol;
  typeSymbol: symbol;
}

const elDisplay = Symbol();
const IF = Symbol();
const ELSEIF = Symbol();
const ELSE = Symbol();

export const isConditionsComponent = (
  entity: ISlotComponent<any> | IConditionsComponent | IConditionalSlot,
  ): entity is IConditionsComponent => {
  return (entity as IConditionsComponent).test !== undefined;
};

export const evalSlots = (arr: TConditionalSlotArray, childrenObj: IIndexedChildren) => {
  return arr.every((el) => {
    if (isConditionsComponent(el)) {
      const {slot, test} = el;
      if (React.isValidElement(slot)) {
        return childrenObj.get(slot.displaySymbol) !== undefined && test(slot.props) === true;
      }
      return false;
    }
    return childrenObj.get(el.displaySymbol) !== undefined;
  });
};

const slotEvalIf = ({scope, excludes, includes, condition}: IConditionalSlotBase) => {
  let childrenObj = scope as IIndexedChildren;
  if (typeof childrenObj !== 'object' || childrenObj.get === undefined) {
    childrenObj = useChildren(scope);
  }
  const include = scope && includes ? evalSlots(includes, childrenObj) : true;
  const exclude = scope && excludes ? evalSlots(excludes, childrenObj) : true;
  const conditional = condition !== undefined ? Boolean(condition) : true;
  return include && exclude && conditional;
};

export function createConditionalSlot(
  Element: React.ComponentType = React.Fragment,
  typeSymbol: symbol = IF,
  parent?: IConditionalSlot,
  ): IConditionalSlot {
  function ConditionalSlot(props: IConditionalSlotBase) {
    const {children, scope, excludes, includes, condition, ...newProps} = props;
    const elProps = Element === React.Fragment ? {} : {scope, ...newProps};
    const scopeObj = useChildren(children);
    const evalResult = parent === undefined ? slotEvalIf({scope, excludes, includes, condition}) : true;
    const obj = scopeObj.get(ConditionalSlot.displaySymbol);
    let res: React.ReactNode = null;
    let [onIf, pastIf] = [false, false];
    if (obj !== undefined) {
      for (let i = 0; i < obj.length; i++) {
        const cur: any = obj[i].child;
        const valid = slotEvalIf(cur.props);
        if (valid) {
          res = cur;
        }
        if (
          onIf === false
          && pastIf === false
          && cur.type.typeSymbol === ConditionalSlot.If.typeSymbol
          ) {
          onIf = true;
          if (valid) {
            break;
          }
          continue;
        }
        if (cur.type.typeSymbol === ConditionalSlot.ElseIf.typeSymbol) {
          pastIf = true;
          if (valid) {
            break;
          }
          continue;
        }
        if (cur.type.typeSymbol === ConditionalSlot.Else.typeSymbol) {
          res = cur;
          break;
        }
      }
    }
    if (evalResult) {
      if (onIf && res !== null && res !== undefined) {
        return React.createElement(Element, elProps,
          <FilterSlot key={0} scope={children} exclude={[ConditionalSlot]} />,
          res,
        );
      }
      return React.createElement(Element, elProps,
        <FilterSlot key={0} scope={children} exclude={[ConditionalSlot]} />,
      );
    }
    if (res !== null && onIf === false) {
      return React.createElement(Element, elProps,
        res,
      );
    }
    return null;
  }
  ConditionalSlot.displaySymbol = elDisplay;
  ConditionalSlot.typeSymbol = typeSymbol;
  if (parent === undefined) {
    const If = createConditionalSlot(React.Fragment, IF, ConditionalSlot);
    const Else = createConditionalSlot(React.Fragment, ELSEIF, ConditionalSlot);
    const ElseIf = createConditionalSlot(React.Fragment, ELSE, ConditionalSlot);
    ConditionalSlot.If = If;
    ConditionalSlot.ElseIf = Else;
    ConditionalSlot.Else = ElseIf;
  } else {
    setTimeout(() => {
      ConditionalSlot.If = parent.If;
      ConditionalSlot.ElseIf = parent.Else;
      ConditionalSlot.Else = parent.ElseIf;
    }, 0);
  }
  return ConditionalSlot;
}

const ConditionalSlotElement: IConditionalSlot = createConditionalSlot();

export default ConditionalSlotElement;
