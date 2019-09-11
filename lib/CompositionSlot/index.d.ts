import * as React from 'react';
/**
 * Allows composition through children.
 */
interface ICompositionSlot {
    /**
     * Children with rules on passing (reads props, multiple, )
     */
    children?: any;
    /**
     * Elements or indexed children object passed for Compositioning
     */
    scope: any;
    /**
     * Composition out all slottable components, overrides include and exclude properties
     */
    all?: boolean;
}
interface ICompositionSubSlot extends ICompositionSlot {
    scope: React.Context<any>;
}
interface ICompositionSlotComponent extends React.FC<ICompositionSlot> {
    SubSlot: React.FunctionComponent<ICompositionSubSlot>;
}
declare const CompositionSlot: ICompositionSlotComponent;
export default CompositionSlot;
