import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter,Route, Routes } from 'react-router';
import EventsPage from './components/Events.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path='/'  element={<App/>}/>
          {


          <Route path='/events' element={<EventsPage/>}/>
          
        }
     </Routes> 
    </BrowserRouter>
  </StrictMode>
);
