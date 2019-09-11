import React from 'react';
import { ISortChildrenEl, ISlotComponent } from './createSlot';

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

export type TConditionalSlot = ISlotComponent<any> | IConditionsComponent;

/**
 * Scope object. Slottable elements are tracked as Element.DisplaySymbol
 * Custom components as Element.DisplayName.
 */
export class ScopeMap extends Map<symbol | string, ISortChildrenEl[]> {
  public static isConditionsComponent = (
    entity: ISlotComponent<any> | IConditionsComponent,
    ): entity is IConditionsComponent => {
    return (entity as IConditionsComponent).test !== undefined;
  }
  /**
   * Reduces conditions to an object.
   */
  public static reduceConds = (arr: TConditionalSlot[]) => arr.reduce((prevV, val) => {
    const key = ScopeMap.isConditionsComponent(val) ? val.slot.displaySymbol : val.displaySymbol as any;
    prevV[key] = val;
    return prevV;
  }, {} as { [x: string]: TConditionalSlot })

  /**
   * Sorts elements by order of appearance
   * @param els children object to sort into children
   */
  public static sortElements(els: ISortChildrenEl[]): JSX.Element[] {
    return els.sort((a, b) => a.index - b.index).map((el) => el.child);
  }
  /**
   * Returns grouped elements, by order of appearance
   * @param els children object to sort into children
   */
  public static mapElements(els: ISortChildrenEl[]): JSX.Element[] {
    return els.map((el) => el.child);
  }
  private lastIndex = -1;
  private children: any;
  constructor(childrenProp?: any) {
    super();
    if (!childrenProp) {
      return;
    }
    const mapArr = (arr: any[]) => arr.reduce((prev, el) => {
        if (el instanceof Array && el.length) {
          prev.push(...mapArr(el));
        } else {
          prev.push(el);
        }
        return prev;
      },
      [] as any[]);
    this.children = mapArr([childrenProp]);
    const childrenCount = React.Children.count(this.children);
    if (childrenCount === 1) {
      this.injectElement(this.children);
    } else if (childrenCount > 1) {
        React.Children.forEach(childrenProp, this.injectElement);
    }
  }
  /**
   * Injects element into the scope
   * @param child JSX element to inject
   */
  public scopeChildren = () => this.children;
  public injectElement = (child: JSX.Element) => {
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
    const resultGet = this.get(childType);
    const index = this.pushLastIndex();
    if (resultGet === undefined) {
      this.set(childType, [{index, child}]);
    } else {
      resultGet.push({index, child});
      this.set(childType, resultGet);
    }
  }
  /**
   * Tests whether object includes all conditional slots
   * @param arr conditional slots for inclusion
   */
  public includes = (...arr: TConditionalSlot[]) => {
    return arr.every(this.evalSlot(true));
  }
  /**
   * Tests whether object excludes all conditional slots
   * @param arr conditional slots for exclusion
   */
  public excludes(...arr: TConditionalSlot[]) {
    return !arr.some(this.evalSlot());
  }
  /**
   * Returns array of conditional slots included
   * @param arr conditional slots for inclusion
   */
  public includeSlots = (arr: TConditionalSlot[]) => {
    return arr.reduce(this.filterSlot(), [] as ISortChildrenEl[]);
  }
  /**
   * Returns array of conditional slots without the excluded ones
   * @param arr conditional slots for exclusion
   * @param all include all elements including non-conditional slots
   */
  public excludeSlots = (arr: TConditionalSlot[], all?: boolean) => {
    const prev: ISortChildrenEl[] = [];
    const vals = ScopeMap.reduceConds(arr);
    this.forEach((val, key) => {
      if (typeof key !== 'symbol' && all !== true) {
        return;
      }
      const cond = vals[key as any];
      if (cond) {
        this.filterSlot(true)(prev, cond);
      } else {
        prev.push(...val);
      }
    });
    return prev;
  }
  /**
   * Returns all non-slot elements in scope
   */
  public nonSlotted = () => {
    const prev: ISortChildrenEl[] = [];
    this.forEach((val, key) => {
      if (typeof key !== 'symbol') {
        prev.push(...val);
      }
    });
    return prev;
  }
  /**
   * controls index on insert
   */
  private pushLastIndex = () => {
    this.lastIndex += 1;
    return this.lastIndex;
  }
  /**
   * filters slots by params
   */
  private filterSlot = (exclude?: boolean) => (prev: ISortChildrenEl[], el: TConditionalSlot) => {
    if (ScopeMap.isConditionsComponent(el)) {
      const { slot, test } = el;
      const objConditions = this.get(slot.displaySymbol);
      if (objConditions !== undefined) {
        if (exclude) {
          prev.push(...objConditions.filter((elem) => !test(elem.child.props)));
        } else {
          prev.push(...objConditions.filter((elem) => test(elem.child.props)));
        }
      }
      return prev;
    }
    const obj = this.get(el.displaySymbol);
    if (obj !== undefined && exclude !== true) {
      prev.push(...obj);
    }
    return prev;
  }
  /**
   * evals slots by params
   */
  private evalSlot = (includes?: boolean) => (el: TConditionalSlot) => {
    if (ScopeMap.isConditionsComponent(el)) {
      const {slot, test} = el;
      const obj = this.get(slot.displaySymbol);
      if (includes) {
        return obj !== undefined && obj.every((elem) => test(elem.child.props)) === true;
      }
      return obj !== undefined && obj.some((elem) => test(elem.child.props)) === true;
    }
    return this.has(el.displaySymbol);
  }
}
/**
 * Creates scope object for work with slots
 * @param scope - React Children prop
 */
const useScope = (scope: any): ScopeMap => {
  if (scope instanceof ScopeMap) {
    return scope;
  }
  if (scope === undefined || scope.length === 0) {
    return new ScopeMap();
  }
  const result = new ScopeMap(scope);
  return result;
};

export {useScope as default};
