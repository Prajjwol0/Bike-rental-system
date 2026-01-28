
import {  RouterProvider } from 'react-router-dom';
import './App.css'

import { router } from "./routes/route";
import { Toaster } from './components/ui/sonner';


function App() {
  

  return (
    <>
   <Toaster/>
      <RouterProvider router={router} />
    </>
  );
}

export default App
