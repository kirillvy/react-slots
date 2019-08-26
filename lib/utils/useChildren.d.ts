import { ISortChildrenEl } from '..';
/**
 * Indexes React children for faster access by Slot components
 * @param scope - react children, in any format
 */
declare const useChildren: (scope: any) => Map<string | symbol, ISortChildrenEl[]>;
export default useChildren;
