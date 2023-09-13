import { useEffect, useState } from 'react';
import { makeRequest } from './api';

export const useApi = <Response>({ apiUrl }: { apiUrl: string }) => {
  const [response, setResponse] = useState<Response>();

  useEffect(() => {
    makeRequest<Response>({ apiUrl }).then(setResponse);
  }, [apiUrl]);

  return { response };
};
