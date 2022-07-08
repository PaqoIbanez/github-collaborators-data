import { createContext } from 'react'

interface ContextProps {
   isLoading: boolean;
   setIsLoading: (isLoading: boolean) => void;
};

export const UIContext = createContext({} as ContextProps);