import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import {createSlot, NonSlotted} from '.';

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
    <div>
      <CardContextCard.Slot scope={children} withContext={true}>
          <CardTopText.SubSlot scope={CardContextCard.Context} multiple={true} />
      </CardContextCard.Slot>
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
