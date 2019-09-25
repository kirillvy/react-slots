import * as React from 'react';
import { TConditionalSlot } from '../utils/useScope';
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
declare type TCreateFilterSlot = (Element?: keyof JSX.IntrinsicElements | React.ComponentType<any>) => IFilterSlotComponent;
export declare const createFilterSlot: TCreateFilterSlot;
declare const DefaultFilterSlot: IFilterSlotComponent;
export { DefaultFilterSlot as default };
