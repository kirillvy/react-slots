---
id: doc4
title: Slottable components
sidebar_label: Slottable components
---

The main component created by the createSlot function accepts and passes the same props as
the component or JSX element indicated.

## Component

Name | Type | Description
--- | --- | ---
renderAs | `React.ComponentType<any> ⎮ keyof JSX.IntrinsicElements` | Element injected for rendering instead of default. Any props will have to be compatible.

## Component.Slot

The slot consumes an array of children and filters for ones marked as the component

Name | Type | Description
--- | --- | ---
scope | `any ⎮ ScopeMap` | Elements passed for filtering, indexed using `useScope`
children? | `any` | Default children of element, if any.
defaultProps? | `JSX.IntrinsicAttributes & React.PropsWithChildren<T>` | default props to use with default element
passedProps? | `T` | props passed to the element from the component containing the slot
multiple? | `boolean` | Display all if multiple slots are passed
withContext? | `boolean` | Components are composed through their immediate children
fallback? | `any` | fallback to use if slot is not used
fallbackProps? | `JSX.IntrinsicAttributes & React.PropsWithChildren<T>` | default props to use with default element
childIs? | `'feedback' ⎮ 'default' ⎮ 'both'` | Designate the children prop as the default element, the fallback element or both


### Component.SubSlot

Same as Slot, but takes in a React Context propagated by the Slot with the withContext option.
All other props are passed into the Slot. The context of the SubSlot can be accessed from a Component.Slot
above it in the hierarchy by accessing Component.Context.

**Warning!** All SubSlot elements must be placed inside the Slot element propagating the context,
and its context must be enabled in the slot template. Otherwise, a critical React error will occur, as a
Context Consumer is created without a Context Provider above it in the hierarchy.


Name | Type | Description
--- | --- | ---
scope | `React.Context` | Elements passed for filtering
