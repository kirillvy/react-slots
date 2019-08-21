import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import {createSlot, NonSlotted} from '.';
import ConditionalSlot from './ConditionalSlot';

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
export const CardBottomText = createSlot();

const Card: React.FC = ({children}) => (
  <div>
    <ConditionalSlot condition={true} excludes={[CardBottomText]} scope={children}>
      hello1
      <ConditionalSlot.If condition={false} scope={children}>
        hello2
      </ConditionalSlot.If>
      <ConditionalSlot.ElseIf condition={false} scope={children}>
        hello3
      </ConditionalSlot.ElseIf>
      <ConditionalSlot.ElseIf condition={false} scope={children}>
        hello4
      </ConditionalSlot.ElseIf>
      <ConditionalSlot.Else>
        hello5
      </ConditionalSlot.Else>
    </ConditionalSlot>
    <div>
      <CardContextCard.Slot.Conditional condition={true} scope={children} withContext={true}>
          conditional card
          <CardTopText.SubSlot scope={CardContextCard.Context} multiple={true} />
      </CardContextCard.Slot.Conditional>
    </div>
    <div>
        <CardBottomText.Slot scope={children} />
    </div>
    nonslotted:
    <NonSlotted scope={children} include={[CardBottomText]} all={true} />
  </div>
);

stories.add(
  'Card component',
  withReadme(Readme, () => (
    <>f
    <Card>
      xzzxvv
      <CardContextCard>
        <CardTopText>
          <p>Name of the Card</p>
        </CardTopText>
        <CardTopText>
          <p>Name of the Card 2</p>
        </CardTopText>
        <CardTopText>
          <p>Name of the Card 3</p>
        </CardTopText>
        <CardTopText>
          <p>Name of the Card 4</p>
        </CardTopText>
      </CardContextCard>
      <CardBottomText>
        <p>Description of the Card</p>
      </CardBottomText>
      afsfsakj
    </Card>
    </>
  )),
);
