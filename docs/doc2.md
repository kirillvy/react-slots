---
id: doc2
title: Component properties
sidebar_label: Component properties
---

Whitelist and blacklist options are also available if you wish to use some slottable components as
non-slotted children. By default, the whitelist (`include`) includes only the listed slottable elements, 
and the blacklist (`exclude`) includes all elements except the explicitly excluded slottable ones.
However, you can include or exclude the non-slottable elements using the `all` flag.

## Default, fallback and passed props

By default, only the props applied to the Slottable component are applied. However, it is also possible
to pass props to the component from the Slot, for example, if you want specific props to be passed
to the component if the default element is displayed. For this, you can use the `defaultProps`. These
will be enacted each time the default element is displayed.

You may also want to pass props if the default element is not displayed, and the prop's children are
displayed instead. For this, use the `passedProps`. They will be applied in all cases, except the special
case where the slot has no children, but is still rendered (for example, it controls the rendering of
a component already defined in the template). In that case, the passed props will override the
default props.

Lastly, separate props may be applied to the component through the `fallbackProps` prop.

## Conditional Rendering, Defaults and Fallbacks

By default, if a slot is inserted with no children, it will be diplayed as the element the slot
is made from. This means that you can pass props into it and receive callbacks like any other component.

You can also designate a default element if no children are passed to it through the children prop,
as well as a fallback element to use if the slotted element is not included at all.

If a slottable element is not included, all of the slot element's children will not be displayed either,
allowing for a sort of conditional rendering dependent on the rendering of the parent slot.
However, it is more semantic to use native JSX conditional rendering on the top level.

You can use the `childIs` property to designate, whether the default `children` prop is rendered as
solely the default element, solely the fallback element or both, to avoid needlessly using the feedback prop.

In addition, use defaultProps in the Element.Slot element to pass default props, passedProps to forward props
from other places (overrides defaultProps) and fallBack props to pass props designated for the fallback component.


## Conditional Slots

Sometimes, you may want to render content based on whether or not certain conditions apply.
For most parameters, JSX is sufficient. However, you may also want to apply certain slots
only if other slots are passed, or only if they are not passed. For this, use conditional slots.

There are two types of conditional slots, purely conditional and regular slots with conditions. If you only
want to render one slot, you can use Element.Slot.Conditional (or Element.SubSlot.Conditional,
depending on your use case), to reduce the amount of layering in your JSX.

Like the FilterSlot component, the ConditionalSlot component has `include` and `exclude` props, which
accept arrays of slotted components. In addition, you can pass arrays of conditions into the `conditions`
prop as shorthand.
