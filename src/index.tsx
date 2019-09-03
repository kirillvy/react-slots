import ConditionalSlot from './ConditionalSlot';
import useScope from './utils/useScope';
import createSlot from './utils/createSlot';
import FilterSlot from './FilterSlot';

export { FilterSlot,
  FilterSlot as NonSlotted,
  useScope,
  useScope as useChildren,
  createSlot,
  ConditionalSlot };

export default createSlot;
