import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { FlagsContextProvider } from '../utils/use-flags';
import { App } from '../components/app/app';

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <BrowserRouter>
    <FlagsContextProvider><App /></FlagsContextProvider>
  </BrowserRouter>
)
