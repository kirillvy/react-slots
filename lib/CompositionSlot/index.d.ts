import * as React from 'react';
/**
 * Allows composition through children.
 */
export interface ICompositionSlot {
    /**
     * Children with rules on passing (reads props, multiple, )
     */
    children?: any;
    /**
     * Elements or indexed children object passed for Compositioning
     */
    scope: any;
    /**
     * Include all non-slottable elements
     */
    all?: boolean;
}
export interface ICompositionSubSlot extends ICompositionSlot {
    scope: React.Context<any>;
}
interface ICompositionSlotComponent<T = {}> extends React.FC<ICompositionSlot & T> {
    SubSlot: React.FunctionComponent<ICompositionSubSlot>;
}
declare const CompositionSlot: ICompositionSlotComponent;
export default CompositionSlot;
