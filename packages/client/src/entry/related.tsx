import { useState } from 'react';

import { Related } from '../components/related/related';
import { getGlobalLib } from '../utils/get-global-lib';
import {InitialClientState} from "@demo-video-app/client/src/types/initial-client-state";

export const RelatedSecondChunk = ({ id, related }: { id: string; related: InitialClientState['related'] }) => {
  const [globalLib] = useState(() => getGlobalLib());
  return (
    <Related
      initialRelated={related}
      onClick={() => {}}
      className={''}
      id={id}
      playerApi={globalLib.getPlayerLib()}
    />
  );
};
