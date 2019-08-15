import * as React from 'react';
import {ISlotComponent, ISortChildren, useChildren, ISortChildrenEl} from '../index';

interface INonSlotted {
  /**
   * Elements passed for filtering
   */
  scope: any;
  /**
   * Array of slottable components for filtering out
   */
  exclude?: Array<ISlotComponent<any>>;
  /**
   * Array of slottable components whitelisted for not being filtered. Overrides 'exclude'
   */
  include?: Array<ISlotComponent<any>>;
  /**
   * Filter out all slottable components, overrides include and exclude properties
   */
  all?: boolean;
}

interface INonSubSlotted extends INonSlotted {
  scope: React.Context<any>;
}

interface INonSlotComponent extends React.FC<INonSlotted> {
  SubSlot: React.FunctionComponent<INonSubSlotted>;
}

const NonSlotFactory = (Element: React.FC<INonSlotted>): React.FC<INonSubSlotted> => (
  { scope: Context, ...props },
) => {
  return <Context.Consumer>{(value) => <Element {...props} scope={value}/>}</Context.Consumer>;
};

const NonSlottedComponent = ({ scope, exclude, include, all }: INonSlotted) => {
  let childrenObj = scope as ISortChildren;
  if (typeof childrenObj !== 'object' || childrenObj.$$isSlottedChildren === undefined) {
    childrenObj = useChildren(scope);
  }
  const resObject = (res?: Array<ISlotComponent<any>>) => res === undefined ? {} : res.reduce((prev, el) => {
    let childType = '';
    childType = el.displaySymbol as any;
    if (prev[childType] === undefined) {
      prev[childType] = true;
    }
    return prev;
  }, {} as { [x: string]: boolean});
  const includeEls = resObject(include);
  const excludeEls = resObject(exclude);
  const ignoreSlot = (el: symbol) => {
    if (include) {
      if (includeEls[el as any]) {
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
  console.log(childrenObj);
  const children = Object.getOwnPropertySymbols(childrenObj).reduce((prev, cur) => {
    const res = ignoreSlot(cur);
    if (res === true) {
      return prev.concat(childrenObj[cur as any]);
    }
    return prev;
  }, childrenObj.rest || [] as ISortChildrenEl[])
  .sort((a, b) => a.index - b.index)
  .map((el) => el.child);
  return <>{children}</>;
};

NonSlottedComponent.SubSlot = NonSlotFactory(NonSlottedComponent);

const NonSlotted: INonSlotComponent = NonSlottedComponent;

export default NonSlotted;
