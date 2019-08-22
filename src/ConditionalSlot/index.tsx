import React, { useState } from 'react';
import {ISlotComponent, IIndexedChildren, useChildren} from '../index';
import FilterSlot from '../FilterSlot';
import {ISlotConditional} from '..';

export interface IConditionalSlotBase {
  children?: any;
  /**
   * Elements or indexed children object passed for filtering
   */
  scope?: any;
  /**
   * Array of slottable components for filtering out
   */
  excludes?: Array<ISlotComponent<any>>;
  /**
   * Array of slottable components whitelisted for not being filtered. Overrides 'exclude'
   */
  includes?: Array<ISlotComponent<any>>;
  /**
   * Truthy eval of conditions for implementations.
   */
  condition?: any;
}

export interface IConditionalSlot<T = {}> extends React.FC<IConditionalSlotBase & T> {
  If: IConditionalSlot;
  ElseIf: IConditionalSlot;
  Else: IConditionalSlot;
  displaySymbol: symbol;
  typeSymbol: symbol;
}

const elDisplay = Symbol();

const evalIf = ({scope, excludes, includes, condition}: IConditionalSlotBase) => {
  let childrenObj = scope as IIndexedChildren;
  if (typeof childrenObj !== 'object' || childrenObj.get === undefined) {
    childrenObj = useChildren(scope);
  }
  const include = scope && includes ? includes.every((el) => childrenObj.get(el.displaySymbol) !== undefined) : true;
  const exclude = scope && excludes ? excludes.every((el) => childrenObj.get(el.displaySymbol) === undefined) : true;
  const conditional = condition !== undefined ? Boolean(condition) : true;
  return include && exclude && conditional;
};

export function createConditionalSlot(
  Element: React.ComponentType = React.Fragment, parent?: IConditionalSlot,
  ): IConditionalSlot {
  function ConditionalSlot(props: IConditionalSlotBase) {
    const {children, scope, excludes, includes, condition, ...newProps} = props;
    const elProps = Element === React.Fragment ? {} : {scope, ...newProps};
    const scopeObj = useChildren(children);
    const evalResult = parent === undefined ? evalIf({scope, excludes, includes, condition}) : true;
    const obj = scopeObj.get(ConditionalSlot.displaySymbol);
    let res: React.ReactNode = null;
    let [onIf, pastIf] = [false, false];
    if (obj !== undefined) {
      for (let i = 0; i < obj.length; i++) {
        const cur: any = obj[i].child;
        const valid = evalIf(cur.props);
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
  ConditionalSlot.typeSymbol = Symbol();
  if (parent === undefined) {
    const If = createConditionalSlot(React.Fragment, ConditionalSlot);
    const Else = createConditionalSlot(React.Fragment, ConditionalSlot);
    const ElseIf = createConditionalSlot(React.Fragment, ConditionalSlot);
    ConditionalSlot.If = If;
    ConditionalSlot.ElseIf = Else;
    ConditionalSlot.Else = ElseIf;
  } else {
    ConditionalSlot.If = parent.If;
    ConditionalSlot.ElseIf = parent.Else;
    ConditionalSlot.Else = parent.ElseIf;
  }
  return ConditionalSlot;
}

const ConditionalSlotElement: IConditionalSlot = createConditionalSlot();

export default ConditionalSlotElement;
