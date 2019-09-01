import * as React from 'react';
import { ISlotComponent } from '../index';
import { IConditionalSlot, IConditionsComponent } from '../ConditionalSlot';
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
export declare const resObject: (res?: (IConditionalSlot<{}> | ISlotComponent<any> | IConditionsComponent)[] | undefined) => {
    [x: string]: boolean;
};
declare const FilterSlot: IFilterSlotComponent;
export default FilterSlot;
