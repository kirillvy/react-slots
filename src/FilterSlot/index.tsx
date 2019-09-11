import * as React from 'react';
import { ISortChildrenEl, ISlotComponent } from '../utils/createSlot';
import useScope, {TConditionalSlot, ScopeMap } from '../utils/useScope';

export interface IFilterSlot {
  /**
   * Elements or indexed children object passed for filtering
   */
  scope: any;
  /**
   * Array of slottable components for filtering out
   */
  exclude?: TConditionalSlot[];
  /**
   * Array of slottable components whitelisted for not being filtered. Overrides 'exclude'
   */
  include?: TConditionalSlot[];
  /**
   * Filter out all slottable components, overrides include and exclude properties
   */
  all?: boolean;
  /**
   * Group all elements in order added.
   */
  grouped?: boolean;
}

export interface IFilterSubSlot extends IFilterSlot {
  scope: React.Context<any>;
}

interface IFilterSlotComponent extends React.FC<IFilterSlot> {
  SubSlot: React.FunctionComponent<IFilterSubSlot>;
}

const FilterSlotFactory = (Element: React.FC<IFilterSlot>): React.FC<IFilterSubSlot> => (
  { scope: Context, ...props },
) => {
  return <Context.Consumer>{(value) => <Element {...props} scope={value} />}</Context.Consumer>;
};

const isSlotted = (
  child: any | ISlotComponent,
  ): child is ISlotComponent => child && child.type && child.type.displaySymbol;

export const createFilterSlot = (
  Element: keyof JSX.IntrinsicElements | React.ComponentType = React.Fragment,
) =>  {
  const FilterSlot = ({ scope, exclude, include, grouped, all }: IFilterSlot) => {
    if (grouped === true) {
      const childrenObject = useScope(scope);
      let prev = [] as ISortChildrenEl[];
      if (exclude) {
        prev = childrenObject.excludeSlots(exclude, all);
      } else if (include) {
        prev = childrenObject.includeSlots(include);
        if (all) {
          prev.push(...childrenObject.nonSlotted());
        }
      }
      const x = ScopeMap.mapElements(prev);
      return React.createElement(Element, {}, x);
    }
    let childrenObj = scope;
    const res: JSX.Element[] = [];
    if (scope instanceof ScopeMap) {
      childrenObj = scope.scopeChildren();
    }
    const includeSlots = include && ScopeMap.reduceConds(include);
    const excludeSlots = exclude && ScopeMap.reduceConds(exclude);
    const filterElement = (child: JSX.Element) => {
      const checkSlot = (x: TConditionalSlot | undefined, included: boolean) => {
        if (x === undefined) {
          return;
        }
        if (ScopeMap.isConditionsComponent(x)) {
          if (x.test(child.props) === included) {
            return res.push(child);
          }
          return;
        }
        if (included) {
          res.push(child);
        }
      };
      if (isSlotted(child)) {
        if (excludeSlots) {
          checkSlot(excludeSlots[child.type.displaySymbol as any], false);
        } else if (includeSlots) {
          checkSlot(includeSlots[child.type.displaySymbol as any], true);
        }
        return;
      }
      if (all) {
        res.push(child);
      }
    };
    const childrenCount = React.Children.count(childrenObj);
    if (childrenCount === 1) {
      filterElement(childrenObj);
    } else if (childrenCount > 1) {
        React.Children.forEach(childrenObj, filterElement);
    }
    return React.createElement(Element, {}, res);
  };
  FilterSlot.SubSlot = FilterSlotFactory(FilterSlot);
  return FilterSlot;
};

const DefaultFilterSlot: IFilterSlotComponent = createFilterSlot();

export {DefaultFilterSlot as default};
