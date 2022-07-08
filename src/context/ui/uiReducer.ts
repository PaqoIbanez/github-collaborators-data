import { UIState } from './';

type UiActionType =
   | { type: '[Ui] - setIsLoading', payload: boolean }

export const uiReducer = (state: UIState, action: UiActionType): UIState => {
   const { payload } = action;

   switch (action.type) {
      case '[Ui] - setIsLoading':
         return {
            ...state,
            isLoading: payload
         }

      default:
         return state;
   }

}