import useScope from './utils/useScope';
import createSlot, {createLayeredSlot} from './utils/createSlot';
import createConditionalSlot from './utils/createConditionalSlot';
import ConditionalSlot, {createConditionalElement} from './ConditionalSlot';
import FilterSlot from './FilterSlot';

export {
  FilterSlot,
  FilterSlot as NonSlotted,
  useScope,
  useScope as useChildren,
  createSlot,
  createLayeredSlot,
  createConditionalSlot,
  createConditionalElement,
  ConditionalSlot,
};

export default createSlot;
