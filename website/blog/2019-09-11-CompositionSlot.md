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

```tsx
<CompositionSlot scope={scope}>
  <CardBottomText.Slot
    props={{onInput: (e) => console.log(e.currentTarget.value, e.currentTarget.name)}}
    scope={[]}
  />
  <CardTopText.Slot scope={[]} />
  <CardContextCard.Slot scope={[]} withContext={true}>
    <CardTopText.SubSlot scope={CardContextCard.Context} multiple={true} />
  </CardContextCard.Slot>
</CompositionSlot>
```