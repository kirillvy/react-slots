import React from 'react';
import createSlot, { ISlotComponentBase, IHeaderFooter, SlotType, ISlotComponent,
  ISubSlotElement, ISubSlot, ISlotElement, ISlot } from '../utils/createSlot';
import useScope, {TConditionalSlot} from '../utils/useScope';
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

const slotEvalIf = ({scope, excludes, includes, condition}: IConditionalSlotBase) => {
  const childrenObj = useScope(scope);
  const include = (scope && includes) ? childrenObj.includes(...includes) : true;
  const exclude = (scope && excludes) ? childrenObj.excludes(...excludes) : true;
  const conditional = condition !== undefined ? Boolean(condition) : true;
  return include && exclude && conditional;
};

export function createDefaultConditionalSlot(
  Element: React.ComponentType = React.Fragment,
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
          <FilterSlot key={0} scope={scopeObj} exclude={[ConditionalSlot as any]} all={true} />,
          res,
        );
      }
      return React.createElement(Element, elProps,
        <FilterSlot key={0} scope={scopeObj} exclude={[ConditionalSlot as any]} all={true} />,
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
  } else {
    setTimeout(() => {
      ConditionalSlot.If = parent.If;
      ConditionalSlot.ElseIf = parent.Else;
      ConditionalSlot.Else = parent.ElseIf;
    }, 0);
  }
  return ConditionalSlot;
}

interface IHeaderFooterConditional extends IHeaderFooter {
  Conditional: IConditionalSlot;
}

interface ISlotConditional<T> extends ISlotElement<T> {
  displaySymbol: symbol;
  Conditional: IConditionalSlot<T & ISlot>;
}

interface ISubSlotConditional<T> extends ISubSlotElement<T> {
  Conditional: React.FC<ISubSlot<T>>;
}

interface IHeaderFooterConditional extends IHeaderFooter {
  Conditional: IConditionalSlot;
}

interface IConditionalSlotComponent<T = any> extends ISlotComponentBase<T> {
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

export const createConditionalSlot: IOverloadCreateConditionalSlot = <T extends {} = {}, S extends {} = {}>(
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

const ConditionalSlotElement: IConditionalSlot = createDefaultConditionalSlot();

export default ConditionalSlotElement;
