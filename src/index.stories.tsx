import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import { createSlot, useScope, FilterSlot, ConditionalSlot } from '.';

/**
 * imports of README file
 */
import Readme from './README.md';

/**
 * imports of component
 */
const stories = storiesOf('Components', module);

export const CardContextCard = createSlot();
export const CardTopText = createSlot();
export const CardBottomText = createSlot<'div'>('div');

const Card: React.FC = ({ children }) => {
  const scope = useScope(children);
  return (
    <div>
      <ConditionalSlot condition={true} excludes={[]} scope={scope}>
        hello1
    <ConditionalSlot.If condition={true} scope={scope}>
          hello2
    </ConditionalSlot.If>
        <ConditionalSlot.ElseIf condition={false} scope={scope}>
          hello3
    </ConditionalSlot.ElseIf>
        <ConditionalSlot.ElseIf condition={false} scope={scope}>
          hello4
    </ConditionalSlot.ElseIf>
        <ConditionalSlot.Else>
          hello5
    </ConditionalSlot.Else>
      </ConditionalSlot>
      <div>
        <CardContextCard.Slot scope={scope} withContext={true}>
          conditional card
        <CardTopText.SubSlot scope={CardContextCard.Context} multiple={true} />
        </CardContextCard.Slot>
      </div>
      <div>
        <CardBottomText.Slot scope={scope} />
      </div>
      nonslotted grouped:
    <FilterSlot scope={children} include={[CardBottomText]} all={true} grouped={true} />
      nonslotted ungrouped:
    <FilterSlot scope={children} include={[CardBottomText]} all={true} grouped={false} />
    </div>
  );
};

const Card2: React.FC = ({ children }) => (
  <Card>
    {children}
    <CardContextCard.Before>
      Text before conditional card
    </CardContextCard.Before>
  </Card>
);

stories.add(
  'Card component',
  withReadme(Readme, () => (
    <>f
    <Card2>
        xzzxvv
      <div>ggg</div>
        <CardContextCard>
          <CardTopText.After>
            <p>yes card here</p>
          </CardTopText.After>
          <CardTopText>
            <p>Name of the Card</p>
          </CardTopText>
          <CardTopText>
            <p>Name of the Card 2</p>
          </CardTopText>
          <CardTopText onClick={() => alert('hello')}>
            <p>Name of the Card 3</p>
          </CardTopText>
          <CardTopText.Before>
            <p>no card here</p>
          </CardTopText.Before>
          <CardTopText>
            <p>Name of the Card 4</p>
          </CardTopText>
        </CardContextCard>
        <CardBottomText.Before>
          Text before Description of the Card
        </CardBottomText.Before>
        <CardBottomText>
          <p>Description of the Card</p>
        </CardBottomText>
        afsfsakj
    </Card2>
    </>
  )),
);
