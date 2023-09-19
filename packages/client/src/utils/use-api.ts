import { useEffect, useState } from 'react';
import { makeRequest } from './api';

export const useApi = <Response>({ apiUrl }: { apiUrl: string }) => {
  const [response, setResponse] = useState<Response | undefined>();

  useEffect(() => {
    setResponse(undefined);
    makeRequest<Response>({ apiUrl }).then(setResponse);
  }, [apiUrl]);

  if (response) {
    return { response: response as Response, isLoading: false as const };
  }

  return { response: undefined, isLoading: true as const };
};
