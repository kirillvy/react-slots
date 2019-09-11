---
title: Introducing CompositionSlot
author: Kirill Vysokolov
# authorURL: http://twitter.com/
authorFBID: 100003639822089
---

CompositionSlot is a method tailored for forms coming in slottr 0.4, which allows you to compose forms and process
events inside the template.

To begin using the slot, import it:

`import { CompositionSlot } from 'slottr';`

You can also create your own with the method createCompositionSlot().

<!--truncate-->

Inside the CompositionSlot you can pass in the slots you want to see in the scope (including context with CompositionSlot.SubSlot).

Inside the `props` prop you can pass in event triggers to create events to process in the form.

```tsx
<CompositionSlot scope={scope}>
  <CardInput.Slot
    props={{onInput: (e) => console.log(e.currentTarget.value, e.currentTarget.name)}}
    scope={[]}
  />
  <CardCheckBox.Slot 
    props={{onInput: (e) => console.log(e.currentTarget.checked, e.currentTarget.name)}}
    scope={[]}
  />
  <CardContextCard.Slot scope={[]} withContext={true}>
    <CardLabel.SubSlot scope={CardContextCard.Context} />
    <CardInput.SubSlot
      scope={CardContextCard.Context}
      props={{onInput: (e) => console.log(e.currentTarget.value, e.currentTarget.name)}}
    />
  </CardContextCard.Slot>
</CompositionSlot>
```

For simple components that use callbacks, you can also use Context:

```tsx
const CardInput = createSlot('input');

<form onSubmit={(e) => {
  e.preventDefault();
  onSubmit(data);
}}>
  <CompositionSlot scope={scope}>
    <ContextCard.Slot scope={[]} withContext={true}>
      <CardLabel.SubSlot scope={CardContextCard.Context} />
      <CardInput.SubSlot
        scope={CardContextCard.Context}
        props={{onInput: (e) => console.log(e.currentTarget.value, e.currentTarget.name)}}
      />
    </ContextCard.Slot>
  </CompositionSlot>
  <input type="submit" value="Submit" />
</form>
```

On the top level, simply pass in the name, placeholder and other props you need.

```tsx
<CompositionForm onSubmit={(data) => ...}>
  <ContextCard>
    <CardLabel>
      Name: <Tooltip text={'Input your first and last name'}>
    </CardLabel>
    <CardInput
      name={'name'}
      placeholder={'Enter name...'}
      required={true}
    />
  </ContextCard.Slot>
  <ContextCard>
    <CardLabel>
      Email: <Tooltip text={'Enter a valid email'}>
    </CardLabel>
    <CardInput
      name={'email'}
      placeholder={'Enter email...'}
    />
  </ContextCard.Slot>
</CompositionSlot>
```

In addition, I made the renderIn property for when you need to wrap a Slot component in a different component.
This is useful for simple elements that may require a variable wrapper, for example in a list.

You can designate a default render in by passing a second prop with the component or JSX default component name:

```ts
export const ContainedCard = createConditionalSlot('div', Container);
export const ContainedSpan = createConditionalSlot(Element, 'div');
```

To cancel the container, pass a `false` prop to renderIn:

```tsx
<ContainedCard renderIn={false} />
```

In addition, any Slottable component can be passed a `renderIn` to make a container. It can be manipulated through
`renderInProps`:

```tsx
<UnContainedCard />
<UnContainedCard renderIn={Container} renderInProps={{name: 'Enter name:'}} />
<UnContainedCard />
<UnContainedCard />
```

For complex labels that may require extension it's better to use withContext or design separate components that
propagate the input events through callbacks or to use withContext, if reusability is not needed.
