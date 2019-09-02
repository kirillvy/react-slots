import * as React from 'react';
import { ISlotComponent, IIndexedChildren, ISortChildrenEl } from '../index';
import useScope from '../utils/useScope';
import {
  IConditionalSlot,
  IConditionsComponent,
  isConditionsComponent,
} from '../ConditionalSlot';

interface IFilterSlot {
  /**
   * Elements or indexed children object passed for filtering
   */
  scope: any;
  /**
   * Array of slottable components for filtering out
   */
  exclude?: Array<ISlotComponent<any> | IConditionalSlot | IConditionsComponent>;
  /**
   * Array of slottable components whitelisted for not being filtered. Overrides 'exclude'
   */
  include?: Array<ISlotComponent<any> | IConditionsComponent>;
  /**
   * Filter out all slottable components, overrides include and exclude properties
   */
  all?: boolean;
  /**
   * Group all elements in order added.
   */
  grouped?: boolean;
}

interface IFilterSubSlot extends IFilterSlot {
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

export const resObject = (res?: Array<ISlotComponent<any> | IConditionalSlot | IConditionsComponent>) => {
  if (res === undefined) {
    return {};
  }
  return res.reduce((prev, el) => {
    if (isConditionsComponent(el)) {
      const { slot, test } = el;
      if (React.isValidElement(slot)) {
        const childType: string = slot.displaySymbol as any;
        prev[childType] = (childType !== undefined && test(slot.props) === true);
      }
    } else {
      const childType: string = el.displaySymbol as any;
      if (prev[childType] === undefined) {
        prev[childType] = true;
      }
    }
    return prev;
  }, {} as { [x: string]: boolean });
};

const FilterSlotComponent = ({ scope, exclude, include, grouped, all }: IFilterSlot) => {
  const childrenObj = useScope(scope);
  const includeEls = resObject(include);
  const excludeEls = resObject(exclude);
  const ignoreSlot = (el: symbol | string) => {
    if (include) {
      if (includeEls[el as any]) {
        return true;
      }
      if (typeof el !== 'symbol' && all === true) {
        return true;
      }
      return false;
    }
    if (exclude) {
      if (excludeEls[el as any]) {
        return false;
      }
      return true;
    }
  };
  const prev: ISortChildrenEl[] = [];
  childrenObj.forEach((value, key) => {
    const res = ignoreSlot(key);
    if (res === true) {
      prev.push(...value);
    }
  });
  if (grouped === true) {
    return <>{prev.map((el) => el.child)}</>;
  }
  const children: JSX.Element[] = prev.sort((a, b) => a.index - b.index)
    .map((el) => el.child);
  return <>{children}</>;
};

FilterSlotComponent.SubSlot = FilterSlotFactory(FilterSlotComponent);

const FilterSlot: IFilterSlotComponent = FilterSlotComponent;

export default FilterSlot;
