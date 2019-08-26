import React from 'react';
import {IIndexedChildren, ISortChildrenEl} from '..';

/**
 * Indexes React children for faster access by Slot components
 * @param scope - react children, in any format
 */
const useChildren = (scope: any): IIndexedChildren => {
  if (
    typeof scope === 'object' &&
    scope.get !== undefined &&
    scope.get('$$isSlottedChildren') !== undefined
  ) {
    return scope as IIndexedChildren;
  }
  if (scope === undefined || scope.length === 0) {
    return new Map();
  }
  const childrenCount = React.Children.count(scope);
  const result = new Map<symbol | string, ISortChildrenEl[]>();
  const injectSlot = (child: JSX.Element, index: number) => {
    let childType = 'string';
    if (React.isValidElement(child) && child.type !== undefined) {
      const obj: any = child.type;
      if (obj.hasOwnProperty('displayName')) {
        childType = obj.displayName || 'string';
      } else {
        childType = obj;
      }
      if (obj.hasOwnProperty('displaySymbol')) {
        childType = obj.displaySymbol;
      }
    }
    const resultGet = result.get(childType);
    if (resultGet === undefined) {
      result.set(childType, [{index, child}]);
    } else {
      resultGet.push({index, child});
      result.set(childType, resultGet);
    }
  };
  if (childrenCount === 1) {
    injectSlot(scope, 0);
  } else if (childrenCount > 1) {
      React.Children.forEach(scope, injectSlot);
  }
  result.set('$$isSlottedChildren', []);
  return result;
};

export default useChildren;
