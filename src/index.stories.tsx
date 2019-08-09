import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';

/**
 * imports of README file
 */
import Readme from './README.md';

/**
 * imports of component
 */

const stories = storiesOf('Components', module);

stories.add(
  'Alert component',
  withReadme(Readme, () => (
    <div>See Readme</div>
  )),
);
