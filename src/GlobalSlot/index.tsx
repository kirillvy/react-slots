import React, {useReducer} from 'react';

const createSlot = (
  Context?: React.Context<any>,
  ) => () => {
  const Element = () => {
    return null;
  };
  Element.Slot = () => {
    return null;
  };
  return Element;
};

// export const createGlobalSlotContext = () => {
//   const Context = React.createContext({});
//   const reducer = (state, action) => {
//     return {};
//   };
//   const GlobalContext = ({children}: {children: any}) => (
//     <Context.Provider
//       value={useReducer(reducer, {})}
//     >
//       {children}
//     </Context.Provider>
//   );
//   GlobalContext.Context = Context;
//   GlobalContext.createSlot = createSlot(Context);

// };
