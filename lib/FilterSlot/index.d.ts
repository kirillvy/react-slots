import * as React from 'react';
import { ISlotComponent } from '../index';
import { IConditionalSlot } from '../ConditionalSlot';
interface INonSlotted {
    /**
     * Elements or indexed children object passed for filtering
     */
    scope: any;
    /**
     * Array of slottable components for filtering out
     */
    exclude?: Array<ISlotComponent<any> | IConditionalSlot>;
    /**
     * Array of slottable components whitelisted for not being filtered. Overrides 'exclude'
     */
    include?: Array<ISlotComponent<any>>;
    /**
     * Filter out all slottable components, overrides include and exclude properties
     */
    all?: boolean;
    /**
     * Group all elements in order added.
     */
    grouped?: boolean;
}
interface INonSubSlotted extends INonSlotted {
    scope: React.Context<any>;
}
interface INonSlotComponent extends React.FC<INonSlotted> {
    SubSlot: React.FunctionComponent<INonSubSlotted>;
}
export declare const resObject: (res?: (ISlotComponent<any> | IConditionalSlot<{}>)[] | undefined) => {
    [x: string]: boolean;
};
declare const FilterSlot: INonSlotComponent;
export default FilterSlot;
