import { useReducer } from 'react';
import { UIContext, uiReducer } from './';

export interface UIState {
   isLoading: boolean;
}

const UI_INITIAL_STATE: UIState = {
   isLoading: false,
}

interface Props {
   children: JSX.Element | JSX.Element[];
}

export const UiProvider = ({ children }: Props) => {

   const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const setIsLoading = (isLoading:boolean) => {
      dispatch({type: '[Ui] - setIsLoading', payload: isLoading});
   }

   return (
      <UIContext.Provider value={{
         ...state,

         setIsLoading
      }}>
         {children}
      </UIContext.Provider>
   )
}