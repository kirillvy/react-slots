import * as React from 'react';
import { ISortChildrenEl } from '../utils/createSlot';
import useScope, {TConditionalSlot} from '../utils/useScope';

interface IFilterSlot {
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

interface IFilterSubSlot extends IFilterSlot {
  scope: React.Context<any>;
}

interface IFilterSlotComponent extends React.FC<IFilterSlot> {
  SubSlot: React.FunctionComponent<IFilterSubSlot>;
}

const FilterSlotFactory = (Element: React.FC<IFilterSlot>): React.FC<IFilterSubSlot> => (
  { scope: Context, ...props },
) => {
  return <Context.Consumer>{(value) => <Element {...props} scope={value} />}</Context.Consumer>;
};

const FilterSlotComponent = ({ scope, exclude, include, grouped, all }: IFilterSlot) => {
  const childrenObj = useScope(scope);
  let prev = [] as ISortChildrenEl[];
  if (exclude) {
    prev = childrenObj.excludeSlots(exclude, all);
  } else if (include) {
    prev = childrenObj.includeSlots(include);
    if (all) {
      prev.push(...childrenObj.nonSlotted());
    }
  }
  if (grouped === true) {
    return <>{childrenObj.mapElements(prev)}</>;
  }
  return <>{childrenObj.sortElements(prev)}</>;
};

FilterSlotComponent.SubSlot = FilterSlotFactory(FilterSlotComponent);

const FilterSlot: IFilterSlotComponent = FilterSlotComponent;

export default FilterSlot;
