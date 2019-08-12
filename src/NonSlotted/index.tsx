import * as React from 'react';
import {ISlotComponent} from '../index';

interface INonSlotted {
  /**
   * Elements passed for filtering
   */
  scope: any;
  /**
   * Array of slottable components for filtering out
   */
  exclude?: Array<ISlotComponent<any>>;
  /**
   * Array of slottable components whitelisted for not being filtered. Overrides 'exclude'
   */
  include?: Array<ISlotComponent<any>>;
  /**
   * Filter out all slottable components, overrides include and exclude properties
   */
  all?: boolean;
}

interface INonSubSlotted extends INonSlotted {
  scope: React.Context<any>;
}

interface INonSlotComponent extends React.FC<INonSlotted> {
  SubSlot: React.FunctionComponent<INonSubSlotted>;
}

const NonSlotFactory = (Element: React.FC<INonSlotted>): React.FC<INonSubSlotted> => (
  { scope: Context, ...props },
) => {
  return <Context.Consumer>{(value) => <Element {...props} scope={value.props.children}/>}</Context.Consumer>;
};

const NonSlottedComponent = ({ scope, exclude, include, all }: INonSlotted) => {
  const SlottedChild: React.ReactElement[] = [];
  const childrenCount = React.Children.count(scope);
  const ignoreSlot = (child: JSX.Element, i?: number) => {
    if (!React.isValidElement(child)) {
      if (child !== undefined) {
        SlottedChild.push(child);
      }
      return;
    }
    if (child.type.hasOwnProperty('Slot')) {
      if (include === undefined && exclude === undefined) {
        return;
      }
      if (include !== undefined) {
        if (include.every((el: any) => el !== child.type)) {
          return;
        }
      }
      if (exclude !== undefined &&
        exclude.some((el: any) => el === child.type)) {
        return;
      }
    }
    if (i !== undefined) {
      SlottedChild.push(React.cloneElement(child, { key: i }));
    } else {
      SlottedChild.push(child);
    }
  };
  if (childrenCount === 1) {
    ignoreSlot(React.Children.only(scope));
  } else if (childrenCount > 1) {
      React.Children.forEach(scope, ignoreSlot);
  }
  if (SlottedChild.length === 0) {
    return null;
  }
  return <>{SlottedChild}</>;
};

NonSlottedComponent.SubSlot = NonSlotFactory(NonSlottedComponent);

const NonSlotted: INonSlotComponent = NonSlottedComponent;

export default NonSlotted;
