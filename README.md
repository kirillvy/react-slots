# Компонент react-slots
# react-slots

## Общее описание

react-slots is a library for managing React components as slots, with scoped, conditional and
multiple rendering. It can be used for creating reusable components and UI kits.

## Component properties

The main component created by the createSlot function accepts and passes the same props as
the component or JSX element indicated.

### Component.Slot

The slot consumes an array of children and filters for ones marked as the component

Name | Type | Description
--- | --- | ---
scope | `any` | Elements passed for filtering
children? | `any` | Default children of element, if any.
defaultProps? | `JSX.IntrinsicAttributes & React.PropsWithChildren<T>` | default props to use with default element
passedProps? | `T` | props passed to the element from the component containing the slot
multiple? | `boolean` | Display all if multiple slots are passed
withContext? | `boolean` | Components are composed through their immediate children
fallback? | `any` | fallback to use if slot is not used
fallbackProps? | `JSX.IntrinsicAttributes & React.PropsWithChildren<T>` | default props to use with default element
fallbackOnDefault? | `boolean` | Use the default element as the fallback

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

### NonSlotted

Equivalent of `{children}`, but filters out all slotted elements passed into it. Must include all elements
that you want to skip or it will display them.

Name | Type | Description
--- | --- | ---
scope | any | Elements passed for filtering
slots | Array<ISlotComponent<any>> | slots to exclude

### NonSlotted.SubSlot

Same as NonSlotted, but consumes a context from a slot with `withContext` enabled.

Name | Type | Description
--- | --- | ---
scope | any | Elements passed for filtering

## Применение компонента
## Using slots

Чтобы начать икользовать Slot, импортируйте его конструктор
To begin using react-slots, import the slot creator.

```js
import * as createSlot from 'react-slots';
```

Затем создайте несколько нужных слотов для экспорта. В конструктор слота можно отправить конструктор элемента.

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

После этого их можно вставлять в элемент через Slot:
Now they can be inserted into the template element through the .Slot property. Make sure to include the scope.

```jsx
const Card = () => (
  <div>
    <div>
        <CardTopText.Slot scope={children} />
        <CardFlair scope={children} />
    </div>
    <div>
        <CardBottomText.Slot scope={children} />
    </div>
  </div>
);
```

В файле, использующем слоты, импортируйте и их, и компонент:
In the component using the slots, import them and the component.

```js
import Card, { CardTopText, CardBottomText } from '../Card';
```

Затем вставьте их в элемент:
Then insert them into the element. The slotted elements **must** be the primary children of the element
and not inserted into other elements in the hierarchy. Otherwise they will be rendered as ordinary elements.

```jsx
<Card>
  <CardTopText>
    <p>Name of the Card</p>
  </CardTopText>
  <CardBottomText>
    <p>Description of the Card</p>
  </CardBottomText>
</Card>
```

The result eill be rendered as 

```jsx
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

const CommentList = () => (
  <div>
    <div>Comments:</div>
    <SingleComment.Slot scope={children} multiple={true} />
  </div>
);
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
```jsx
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

const CommentComponent = ({ children, ...props}) => (
  <Comment {...props}>
    <div>
      <CommentName.Slot scope={children} />
      <CommentEmail.Slot scope={children} />
    </div>
    <CommentMessage.Slot scope={children} />
  </Comment>
);


export const SingleComment = createSlot<'div'>(CommentComponent);

const CommentList = () => (
  <div>
    <div>Comments:</div>
    <SingleComment.Slot scope={children} multiple={true} />
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

const Comment = () => (
  <>
    <div>
      <CommentName.Slot scope={children} />
      <CommentEmail.Slot scope={children} />
    </div>
    <CommentMessage.Slot scope={children} />
  </>
);

const CommentList = () => (
  <div>
    <div>Comments:</div>
    <SingleComment.Slot scope={children} multiple={true} withContext={true}>
      <div>
        <CommentName.SubSlot scope={SingleComment.Context} />
        <CommentEmail.SubSlot scope={SingleComment.Context} />
      </div>
      <CommentMessage.SubSlot scope={SingleComment.Context} />
    </SingleComment.Slot>
  </div>
);
```

Both will allow you to make insert slots one into another:

```jsx
<CommentList>
  <SingleComment>
    <CommentName>
      Tony
    </CommentName>
    <CommentEmail>
      nopanic@email.xyz
    </CommentEmail>
    <CommentMessage>
      Hello.
    </CommentMessage>
  </SingleComment>
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
  <SingleComment>
    <CommentName>
      Silvio
    </CommentName>
    <CommentEmail>
      bad@bing.co
    </CommentEmail>
    <CommentMessage>
      Using slots.
    </CommentMessage>
  </SingleComment>
</CommentList>
```

And each one will be rendered as a separate one.

```jsx
<div>
  <div>Comments:</div>
  <div class="Comment-123xyz">
    <div>
      <div class="Name-123xyz">
        Tony
      </div>
      <div class="Email-123xyz">
        nostress@duckduckgo.xyz
      </div>
    </div>
    <div class="Message-123xyz">
      Hello.
    </div>
  </div>
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
  <div class="Comment-123xyz">
    <div>
      <div class="Name-123xyz">
        Silvio
      </div>
      <div class="Email-123xyz">
        bad@bing.co
      </div>
    </div>
    <div class="Message-123xyz">
      Using slots.
    </div>
  </div>
</div>
```

## Conditional Rendering, Defaults and Fallbacks

By default, if a slot is inserted with no children, it will be diplayed as the element the slot
is made from. This means that you can pass props into it and receive callbacks like any other component.

You can also designate a default element if no children are passed to it through the children prop,
as well as a fallback element to use if the slotted element is not included at all.

If a slot's element is not included, all of the slot element's children will not be displayed either,
allowing for a sort of conditional rendering.


## Reusing Slots

Once created, you can reuse slots in any part of your project. It's best to avoid nesting the same 
slotted element inside itself, as this can lead to unpredictable behavior when using context.

## Roadmap to 1.0

Plans:
- Full examples
- Test coverage for ordinary and edge cases
- Passing props other than children through Context API.