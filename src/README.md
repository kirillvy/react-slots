# Компонент Slot

## Общее описание

Используйте компонент Slot для организованной композиции элементов

## Свойства компонента

Название | Тип данных | Пример
--- | --- | ---
type | `React.FС` | `createSlot`
defaultElement? | `JSX.Element` | `<span>привет</span>`


## Применение компонента

Чтобы начать икользовать Slot, импортируйте его и его конструктор

```js
import {createSlot } from '../../../../ui_system/src/components/Slot';
```

Затем создайте несколько нужных слотов для экспорта. В конструктор слота можно отправить конструктор элемента.

```js
export const CardTopText = createSlot();
export const CardBottomText = createSlot();
```

После этого их можно вставлять в элемент через Slot:

```js
<CardWrap>
    <CardTopWrap>
        <CardTopText.Slot children={children} />
    </CardTopWrap>
    <CardBottomWrap>
        <CardBottomText.Slot children={children} />
    </CardBottomWrap>
</CardWrap>
```

В файле, использующем слоты, импортируйте и их, и компонент:

```js
import Card, { CardTopText, CardBottomText } from '../Card';
```

Затем вставьте их в элемент:

```js
    <Card>
      <CardTopText>
        <P>Name of the Card</P>
      </CardTopText>
      <CardBottomText>
        <P>Description of the Card</P>
      </CardBottomText>
    </Card>
```
