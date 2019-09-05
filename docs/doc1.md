---
id: doc1
title: Getting Started
sidebar_label: Getting started
---

To begin, install with

```
npm i slottr
```
## Using slots

To begin using slottr, import the slot creator and the children indexer.

```js
import createSlot, { useScope }  from 'slottr';
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
import createSlot, { FilterSlot } from 'slottr';
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