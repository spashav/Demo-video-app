import { Route, Routes } from 'react-router-dom';
import { PlayerIframe } from '../player-iframe/player-iframe';

export function App() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Routes>
        <Route
          path="/player/:version/:id"
          element={<PlayerIframe id={'1'} version={'1.1'} />}
        />
      </Routes>
    </div>
  );
}
