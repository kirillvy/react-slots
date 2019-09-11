import React from 'react';
import useScope, { TConditionalSlot, ScopeMap } from '../utils/useScope';

export interface IConditionalSlotBase {
  children?: any;
  /**
   * Elements or indexed children object passed for filtering
   */
  scope?: any;
  /**
   * Array of slottable components for filtering out
   */
  excludes?: TConditionalSlot[];
  /**
   * Array of slottable components whitelisted for not being filtered. Overrides 'exclude'
   */
  includes?: TConditionalSlot[];
  /**
   * Truthy eval of conditions for implementations.
   */
  condition?: any;
}

export interface IConditionalSubSlot extends IConditionalSlotBase {
  scope: React.Context<any>;
}

interface IOverloadCreateConditional {
  (
    Element: keyof JSX.IntrinsicElements | React.ComponentType,
  ): IConditionalSlot;
  <T extends keyof JSX.IntrinsicElements>(
    Element: T | React.ComponentType,
  ): IConditionalSlot<Partial<JSX.IntrinsicElements[T]>>;
  <T extends {}>(Element: React.ComponentType): IConditionalSlot<T>;
  <S extends keyof JSX.IntrinsicElements, T extends {}>(
    Element: React.ComponentType,
  ): IConditionalSlot<T & Partial<JSX.IntrinsicElements[S]>>;
  <T extends {}, S extends keyof JSX.IntrinsicElements>(
    Element: React.ComponentType,
  ): IConditionalSlot<T & Partial<JSX.IntrinsicElements[S]>>;
}

export interface IConditionalSlot<T = {}> extends React.FC<IConditionalSlotBase & T> {
  If: IConditionalSlot;
  ElseIf: IConditionalSlot;
  Else: IConditionalSlot;
  SubSlot: React.FC<IConditionalSubSlot & T>;
  displaySymbol: symbol;
  typeSymbol: symbol;
}

const SubSlotFactory = <T extends {}>(
  Element: IConditionalSlot,
  ): React.FC<IConditionalSubSlot & T> => (
  { scope: Context, ...props },
) => {
  return <Context.Consumer>{(value) => <Element {...props} scope={value}/>}</Context.Consumer>;
};

const elDisplay = Symbol();
const IF = Symbol();
const ELSEIF = Symbol();
const ELSE = Symbol();

const slotEvalIf = ({scope, excludes, includes, condition}: IConditionalSlotBase) => {
  const childrenObj = useScope(scope);
  const include = (scope && includes) ? childrenObj.includes(...includes) : true;
  const exclude = (scope && excludes) ? childrenObj.excludes(...excludes) : true;
  const conditional = condition !== undefined ? Boolean(condition) : true;
  return include && exclude && conditional;
};

export function createDefaultConditionalSlot(
  Element: keyof JSX.IntrinsicElements | React.ComponentType = React.Fragment,
  typeSymbol: symbol = IF,
  parent?: IConditionalSlot,
  ): IConditionalSlot {
  function ConditionalSlot(props: IConditionalSlotBase) {
    const {children, scope, excludes, includes, condition, ...newProps} = props;
    const elProps = Element === React.Fragment ? {} : {scope, ...newProps};
    const scopeObj = useScope(children);
    const evalResult = parent === undefined ? slotEvalIf({scope, excludes, includes, condition}) : true;
    const obj = scopeObj.get(ConditionalSlot.displaySymbol);
    let res: React.ReactNode = null;
    let [onIf, pastIf] = [false, false];
    if (obj !== undefined) {
      for (const i of obj) {
        const cur: any = i.child;
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
      const prev = scopeObj.excludeSlots([ConditionalSlot as any], true);
      if (onIf && res !== null && res !== undefined) {
        return React.createElement(Element, elProps,
          ScopeMap.mapElements(prev),
          res,
        );
      }
      return React.createElement(Element, elProps,
        ScopeMap.mapElements(prev),
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
    const If = createDefaultConditionalSlot(React.Fragment, IF, ConditionalSlot);
    const Else = createDefaultConditionalSlot(React.Fragment, ELSEIF, ConditionalSlot);
    const ElseIf = createDefaultConditionalSlot(React.Fragment, ELSE, ConditionalSlot);
    ConditionalSlot.If = If;
    ConditionalSlot.ElseIf = Else;
    ConditionalSlot.Else = ElseIf;
    // @ts-ignore
    ConditionalSlot.SubSlot = SubSlotFactory(ConditionalSlot);
  } else {
    setTimeout(() => {
      ConditionalSlot.If = parent.If;
      ConditionalSlot.ElseIf = parent.Else;
      ConditionalSlot.Else = parent.ElseIf;
      ConditionalSlot.SubSlot = SubSlotFactory(parent);
    }, 0);
  }
  return ConditionalSlot;
}
const ConditionalSlotElement: IConditionalSlot = createDefaultConditionalSlot();

export const createConditionalElement: IOverloadCreateConditional = (
  Element: keyof JSX.IntrinsicElements | React.ComponentType,
  ) => createDefaultConditionalSlot(Element, IF);

export {ConditionalSlotElement as default};
