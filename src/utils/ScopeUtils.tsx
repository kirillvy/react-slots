import { ISortChildrenEl, ISlotComponent } from './createSlot';
import {IConditionsComponent, TConditionalSlot} from './useScope';

export class ScopeUtils {
  public static isConditionsComponent = (
    entity: ISlotComponent<any> | IConditionsComponent,
    ): entity is IConditionsComponent => {
    return (entity as IConditionsComponent).test !== undefined;
  }
  /**
   * Reduces conditions to an object.
   */
  public static reduceConds = (arr: TConditionalSlot[]) => arr.reduce((prevV, val) => {
    const key = ScopeUtils.isConditionsComponent(val) ? val.slot.displaySymbol : val.displaySymbol as any;
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
}

export {ScopeUtils as default};
