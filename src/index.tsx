import useScope from './utils/useScope';
import createSlot from './utils/createSlot';
import createConditionalSlot from './utils/createConditionalSlot';
import ConditionalSlot from './ConditionalSlot';
import FilterSlot from './FilterSlot';

export {
  FilterSlot,
  FilterSlot as NonSlotted,
  useScope,
  useScope as useChildren,
  createSlot,
  createConditionalSlot,
  ConditionalSlot,
};

export default createSlot;
