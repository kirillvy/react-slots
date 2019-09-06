import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import createSlot, {
  createConditionalSlot, useScope, ConditionalSlot, FilterSlot,
  createConditionalElement, createLayeredSlot,
} from '.';

/**
 * imports of README file
 */
import Readme from './README.md';

/**
 * imports of component
 */

const Example: React.FC = ({ children }) => (
  <div>
    hello, {children}
  </div>
);

const stories = storiesOf('Components', module);

export const CardContextCard = createConditionalSlot('div');
export const CardTopText = createSlot();
export const CardTopTexts = createSlot();
export const CardBottomText = createLayeredSlot<'input'>('input', Example);
const ConditionalDiv = createConditionalElement<'div'>('div');

const Card3: React.FC = ({ children }) => {
  const scope = useScope(children);
  return (
    <div>
      <CardBottomText.Slot.Slot scope={children} />
      /card bottom text
    </div>
  );
};

const Card: React.FC = ({ children }) => {
  const scope = useScope(children);
  return (
    <div>
      <ConditionalSlot condition={true} scope={scope}>
        hello1
        <ConditionalSlot.If condition={false} scope={scope}>
          hello2
        </ConditionalSlot.If>
        <ConditionalSlot.ElseIf condition={true} scope={scope}>
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
        <CardContextCard.Slot.Conditional condition={true} scope={scope} withContext={true}>
          conditional card
          <CardTopText.SubSlot scope={CardContextCard.Context} multiple={true} />
        </CardContextCard.Slot.Conditional>
      </div>
      <div>
        <Card3>
          <CardBottomText.Slot
            scope={scope}
            defaultProps={{ type: 'text', value: 'hello'}}
            multiple={true}
          />
        </Card3>
      </div>
      nonslotted grouped:
    <FilterSlot scope={children} include={[]} all={true} grouped={true} />
      nonslotted ungrouped:
    <FilterSlot scope={children} include={[]} all={true} grouped={false} />
    </div>
  );
};

const Card2: React.FC = ({ children }) => {
  const scope = useScope(children);
  return (
    <Card>
      {children}
      <CardContextCard.Before>
        Text before conditional card
      </CardContextCard.Before>
    </Card>
  );
};

const Check = () => <input type='checkbox' />;

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
          <CardTopText>
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
        <CardBottomText renderAs={Check} />
        <CardBottomText renderAs={Check} />
        <CardBottomText renderAs={Check} />
        <CardBottomText renderAs={Check} />
        <CardBottomText renderAs={Check} />
        afsfsakj
    </Card2>
    </>
  )),
);
