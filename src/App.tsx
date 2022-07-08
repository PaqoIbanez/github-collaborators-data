import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import { UiProvider } from "./context/ui";

export const App = () => {

   return (
      <UiProvider>
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path=":id" element={<Home />} />
            </Routes>
         </BrowserRouter>
      </UiProvider>
   )
}