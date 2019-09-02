# react-slots-library

react-slots-library is a library for managing React components as slots, with scoped, conditional and
multiple rendering. It can be used for creating reusable components and UI kits.

To begin, install with

```
npm i react-slots-library
```

## Component properties

The main component created by the createSlot function accepts and passes the same props as
the component or JSX element indicated.


Name | Type | Description
--- | --- | ---
renderAs | `React.ComponentType \| keyof JSX.IntrinsicElements` | Element injected for rendering instead of default. Any props will have to be compatible.

### Component.Slot

The slot consumes an array of children and filters for ones marked as the component

Name | Type | Description
--- | --- | ---
scope | `any \| IndexedChildren` | Elements passed for filtering, indexed using `useScope`
children? | `any` | Default children of element, if any.
defaultProps? | `JSX.IntrinsicAttributes & React.PropsWithChildren<T>` | default props to use with default element
passedProps? | `T` | props passed to the element from the component containing the slot
multiple? | `boolean` | Display all if multiple slots are passed
withContext? | `boolean` | Components are composed through their immediate children
fallback? | `any` | fallback to use if slot is not used
fallbackProps? | `JSX.IntrinsicAttributes & React.PropsWithChildren<T>` | default props to use with default element
childIs? | `'feedback' \| 'default' \| 'both'` | Designate the children prop as the default element, the fallback element or both

### Component.SubSlot

Same as Slot, but takes in a React Context perpetrated by the Slot with the withContext option.
All other props are passed into the Slot. The context of the SubSlot can be accessed from a Component.Slot
above it in the hierarchy by accessing Component.Context.

**Warning!** All SubSlot elements must be placed inside the Slot element propagating the context,
and its context must be enabled in the slot template. Otherwise, a critical React error will occur, as a
Context Consumer is created without a Context Provider above it in the hierarchy.


Name | Type | Description
--- | --- | ---
scope | `React.Context` | Elements passed for filtering

### FilterSlot

Equivalent of `{children}` for non-slottable elements. Can include a whitelist (include) or blacklist(exclude),
otherwise filters out all slottable elements.

Name | Type | Description
--- | --- | ---
scope | `any` | Elements passed for filtering
exclude | `Array<SlotComponent>` | Array of slottable components for filtering out
include | `Array<SlotComponent>` | Array of slottable components whitelisted for not being filtered. Overrides 'exclude'
all | `boolean` | Automatically include all non-slottable elements when doing include (on true)
or automatically exclude when doing exclude (on false)
grouped? | `boolean` | Groups elements by component type

### FilterSlot.SubSlot

Same as FilterSlot, but consumes a context from a slot with `withContext` enabled.

Name | Type | Description
--- | --- | ---
scope | any | Elements passed for filtering

### ConditionalSlot

Component which renders components under it only if the rules are followed. Can also act
as a declaration of an if-elseif-else block. Perpetuates a context that becomes the scope of its children.

Name | Type | Description
--- | --- | ---
scope? | `any` | Elements passed for filtering
excludes? | `Array<SlotComponent>` | Does not render if any of the excludes is in the scope.
includes? | `Array<SlotComponent>` | Does not render if any of the includes are not in the scope.
condition? | `any` | Truthy eval of conditions for implementations. Shorthand for `{ x === 5 && <ConditionalSlot /> }`

Also available by adding .Conditional to any Slot, SubSlot or FilterSlot element.

### ConditionalSlot.If

Made for convenience, same as rendering elements directly inside of a conditional block but can
be used to create a separate if block in an if-else block that can render its own if-else. Creating an
If element alongside non-conditional slots inside a Conditional Slot creates an if-else block that renders
alongside the pre-existing elements.

### ConditionalSlot.ElseIf

Same props as ConditionalSlot, but renders inside ConditionalSlot if the slot did not render. Can
be nested. Same behavior as if nesting a ConditionalSlot inside a ConditionalSlot.Else, but
it is possible to have multiple, the same way else-ifs work in JavaScript. Processed in
the order added.

### ConditionalSlot.Else

Component that renders if none of the elements have rendered. Must be the last child.

## Using slots

To begin using react-slots-library, import the slot creator and the children indexer.

```js
import { createSlot, useScope }  from 'react-slots-library';
```

Then create several slots for use in other components. The slot creator can accept elements and JSX intrinsic
elements. For Typescript, you can also annotate the slot with the props that it accepts. For styled-components and
custom components using intrinsic JSX element properties, you can pass in a combination of the component's props type
and the intrinsic component. Orer does not matter. By default, a React Fragment is created.

Each createSlot output is unique and tied to the variable name (Symbol) it is declared as.

```js
export const CardTopText = createSlot();
export const CardBottomText = createSlot();
export const CardImage = createSlot<'div'>(div);
export const CardActions = createSlot<ICustomComponent>(MyCustomComponent);
export const CardFlair = createSlot<'div', {color: 'red' | 'green'}>(MyStyledComponent);
export const CardWarning = createSlot<{color: 'red' | 'green'}, 'span'>(MyCustomJSXComponent);
```

Now they can be inserted into the template element through the .Slot property. Make sure to include the scope.

```jsx
const Card = ({children}) => {
  const scope = useScope(children);
  return <div>
    <div>
        <CardTopText.Slot scope={scope} />
        <CardFlair.Slot scope={scope} />
    </div>
    <div>
        <CardBottomText.Slot scope={scope} />
    </div>
  </div>;
};
```

In the component using the slots, import them and the component.

```js
import Card, { CardTopText, CardBottomText } from '../Card';
```

Then insert them into the element. The slotted elements **must** be the primary children of the element
and not inserted into other elements in the hierarchy. Otherwise they will be rendered as ordinary elements.

```jsx
const CustomCard = () => (
  <Card>
    <CardTopText>
      <p>Name of the Card</p>
    </CardTopText>
    <CardBottomText>
      <p>Description of the Card</p>
    </CardBottomText>
  </Card>;
);
```

The result will be rendered as 

```html
<div>
  <div>
      <p>Name of the Card</p>
  </div>
  <div>
      <p>Name of the Card</p>
  </div>
</div>
```

To render multiple components in one slot, enable to `multiple` prop.

```jsx
export const SingleComment = createSlot<'div'>(div);

const CommentList = ({children}) => {
  const scope = useScope(children);
  return (
    <div>
      <div>Comments:</div>
      <SingleComment.Slot scope={scope} multiple={true} />
    </div>
  );
};
```

This will allow you to insert any number of components of that type.

```jsx
<CommentList>
  <SingleComment>
    Hello.
  </SingleComment>
  <SingleComment>
    Nice job!.
  </SingleComment>
  <SingleComment>
    Using slots.
  </SingleComment>
</CommentList>
```

And each one will be rendered as a separate one.
```html
<div>
  <div>Comments:</div>
  <div>
    Hello.
  </div>
  <div>
    Nice job!.
  </div>
  <div>
    Using slots.
  </div>
</div>
```

## Composition and Inheritance

There are two ways two allow slots to render other slots. The first is by creating child components that also
contain slots. 

```jsx
import {Name, Email, Message, Comment} from './Comment.style';

export const CommentName = createSlot<'div'>(Name);
export const CommentEmail = createSlot<'div'>(Email);
export const CommentMessage = createSlot<'div'>(Message);

const CommentComponent = ({ children, ...props}) => {
  const scope = useScope(children);
  return (
  <Comment {...props}>
    <div>
      <CommentName.Slot scope={scope} />
      <CommentEmail.Slot scope={scope} />
    </div>
    <CommentMessage.Slot scope={scope} />
  </Comment>
  );
};


export const SingleComment = createSlot<'div'>(CommentComponent);

const CommentList = ({children}) => {
  const scope = useScope(children);
  return (
  <div>
    <div>Comments:</div>
    <SingleComment.Slot scope={scope} multiple={true} />
  </div>
);
```
The second is by writing them directly as subslots to do that, you will need to use the
`withContext` option.

```jsx
import {Name, Email, Message, Comment} from './Comment.styles'

export const CommentName = createSlot<'div'>(Name);
export const CommentEmail = createSlot<'div'>(Email);
export const CommentMessage = createSlot<'div'>(Message);
export const SingleComment = createSlot<'div'>(Comment);

const Comment = ({children}) => {
  const scope = useScope(children);
  return (
  <>
    <div>
      <CommentName.Slot scope={scope} />
      <CommentEmail.Slot scope={scope} />
    </div>
    <CommentMessage.Slot scope={scope} />
  </>
  );
};

const InheritanceCommentList = ({children}) => {
  const scope = useScope(children);
  return (
  <div>
    <div>Comments:</div>
    <SingleComment.Slot scope={scope} multiple={true} />
  </div>
  )
}

const CompositionCommentList = ({children}) => {
  const scope = useScope(children);
  return (
  <div>
    <div>Comments:</div>
    <SingleComment.Slot scope={scope} multiple={true} withContext={true}>
      <div>
        <CommentName.SubSlot scope={SingleComment.Context} />
        <CommentEmail.SubSlot scope={SingleComment.Context} />
      </div>
      <CommentMessage.SubSlot scope={SingleComment.Context} />
    </SingleComment.Slot>
  </div>
  );
};
```

Both will allow you to make insert slots one into another:

```jsx
<CommentList>
  <SingleComment>
    <CommentName>
      Christopher
    </CommentName>
    <CommentEmail>
      loylecapo@holly.wood
    </CommentEmail>
    <CommentMessage>
      Nice job!
    </CommentMessage>
  </SingleComment>
</CommentList>
```

And each one will be rendered as a separate one.

```html
<div>
  <div>Comments:</div>
  <div class="Comment-123xyz">
    <div>
      <div class="Name-123xyz">
        Christopher
      </div>
      <div class="Email-123xyz">
        loylecapo@holly.wood
      </div>
    </div>
    <div class="Message-123xyz">
      Nice job!
    </div>
  </div>
</div>
```

## Rendering non-slotted components

To designate a place to render all components intended as non-slottable children, import the 
FilterSlot component. 

```js
import createSlot, { FilterSlot } from 'react-slots-library';
```

Then insert it where you would like to process non-slottable children, as you would a slot:

```jsx

const CommentList = ({children}) => {
  const scope = useScope(children);
  return (
  <div>
    <FilterSlot scope={scope} />
    <SingleComment.Slot scope={scope} multiple={true} withContext={true}>
      <div>
        <CommentName.SubSlot scope={SingleComment.Context} />
        <CommentEmail.SubSlot scope={SingleComment.Context} />
      </div>
      <CommentMessage.SubSlot scope={SingleComment.Context} />
    </SingleComment.Slot>
  </div>
);
```

Non-slotted components can similarly be inserted as context-dependent limited scope subslots
through the FilterSlot.SubSlot component.

```jsx

const CommentList = ({children}) => {
  const scope = useScope(children);
  return (
  <div>
    <div><FilterSlot scope={scope} /></div>
    <SingleComment.Slot scope={scope} multiple={true} withContext={true}>
      <div><FilterSlot.SubSlot scope={SingleComment.Context} /></div>
      <div>
        <CommentName.SubSlot scope={SingleComment.Context} />
        <CommentEmail.SubSlot scope={SingleComment.Context} />
      </div>
      <CommentMessage.SubSlot scope={SingleComment.Context} />
    </SingleComment.Slot>
  </div>
);
```

Rendering a component with non-slotted components:

```jsx
<CommentList>
  Comments:
  <SingleComment>
    Comment #1:
    <CommentName>
      Christopher
    </CommentName>
    <CommentEmail>
      loylecapo@holly.wood
    </CommentEmail>
    <CommentMessage>
      Nice job!
    </CommentMessage>
  </SingleComment>
</CommentList>
```

In their designated place:

```html
<div>
  <div>Comments:</div>
  <div class="Comment-123xyz">
    <div>Comment #1:</div>
    <div>
      <div class="Name-123xyz">
        Christopher
      </div>
      <div class="Email-123xyz">
        loylecapo@holly.wood
      </div>
    </div>
    <div class="Message-123xyz">
      Nice job!
    </div>
  </div>
</div>
```

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

## Reusing Slots and Extending Components

Once created, you can reuse slots in any part of your project. It's best to avoid nesting the same 
slotted element inside itself, as this can lead to unpredictable behavior when using context.

## Changelog

- 0.1
  - Performance optimizations, optional pre-indexing by useScope function.
  - clarifications on flags for non-slotted elements.
  - clarifications on default, fallback and passed props.
- 0.2 (feature addition lock for 1.0)
  - Conditional rendering slots
  - Unordered and ordered group slots

## Roadmap to 1.0

- 0.3 (preparation for 1.0)
  - Complete test coverage and full examples
  - Package optimizations
  - Documentation
- 1.0
  - breaking changes 
    - Mandatory pre-indexing with useScope
- 1.1
  - Advanced filtering for conditional slots and non-slotted components.
  - NonSlotted (now FilterSlot) is deprecated

Plans:
- Full examples
- Test coverage for ordinary and edge cases
- Passing props other than children through Context API (unique global and component-level slots).
- Caching, priority and garbage collection for global slots.
- Package optimizations (tree-shaking)


## Branches

With the milestones defined, the branches to work on the project are the following:

M1/general

Milestone 1, general master branch for the group of improvements.

M1/14, milestone 1, issue 14 (issues based with this feature or group of features)

M0/15, no milestone, issue 15 (general issue with the work of the library not linked to any milestone).
