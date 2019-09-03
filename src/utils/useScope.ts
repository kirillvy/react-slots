import React from 'react';
import { ISortChildrenEl, ISlotComponent } from './createSlot';
import { IConditionalSlot } from '../ConditionalSlot';

/**
 * Indexes React children for faster access by Slot components
 * @param scope - react children, in any format
 */

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

type TConditionalSlot = ISlotComponent<any> | IConditionsComponent;
type TConditionalSlotArray = Array<ISlotComponent<any> | IConditionsComponent>;

export const isConditionsComponent = (
  entity: ISlotComponent<any> | IConditionsComponent | IConditionalSlot,
  ): entity is IConditionsComponent => {
  return (entity as IConditionsComponent).test !== undefined;
};

class ScopeMap extends Map<symbol | string, ISortChildrenEl[]> {
  public includes(...arr: TConditionalSlotArray) {
    return this.evalSlots(arr);
  }
  public excludes(...arr: TConditionalSlotArray) {
    return !this.evalSlots(arr);
  }
  private evalSlots(arr: TConditionalSlot[]) {
    return arr.every((el) => {
      if (isConditionsComponent(el)) {
        const {slot, test} = el;
        if (React.isValidElement(slot)) {
          return this.get(slot.displaySymbol) !== undefined && test(slot.props) === true;
        }
        return false;
      }
      return this.get(el.displaySymbol) !== undefined;
    });
  }
}
// function ScopeMap() { };
// ScopeMap.prototype = new Map;
// ScopeMap.prototype.add = ScopeMap.prototype.push

const useScope = (scope: any): ScopeMap => {
  if (scope instanceof ScopeMap) {
    return scope;
  }
  if (scope === undefined || scope.length === 0) {
    return new ScopeMap();
  }
  const childrenCount = React.Children.count(scope);
  const result = new ScopeMap();
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

export default useScope;
