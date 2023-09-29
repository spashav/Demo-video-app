import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { FlagsContextProvider } from '../utils/use-flags';
import { App } from '../components/app/app';
import { getInitialClientState } from '../utils/get-initial-client-state';
import { VideoSourceCacheContextProvider } from '../utils/api-cache';
const init = () => {
  ReactDOM.hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <BrowserRouter>
      <FlagsContextProvider>
        <VideoSourceCacheContextProvider initialState={getInitialClientState()}>
          <App />
        </VideoSourceCacheContextProvider>
      </FlagsContextProvider>
    </BrowserRouter>
  );
}

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
