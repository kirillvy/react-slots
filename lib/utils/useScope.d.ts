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
declare type TConditionalSlotArray = Array<ISlotComponent<any> | IConditionsComponent>;
export declare const isConditionsComponent: (entity: IConditionalSlot<{}> | IConditionsComponent | ISlotComponent<any>) => entity is IConditionsComponent;
declare class ScopeMap extends Map<symbol | string, ISortChildrenEl[]> {
    includes(...arr: TConditionalSlotArray): boolean;
    excludes(...arr: TConditionalSlotArray): boolean;
    private evalSlots;
}
declare const useScope: (scope: any) => ScopeMap;
export default useScope;
