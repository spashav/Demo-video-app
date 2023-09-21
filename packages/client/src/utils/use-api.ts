import { useEffect, useState } from 'react';
import { makeRequest } from './api';
import { useSearchParams } from 'react-router-dom';

export const useApi = <Response>({ apiUrl }: { apiUrl: string }) => {
  const [searchParams] = useSearchParams();
  const [response, setResponse] = useState<Response | undefined>();
  useEffect(() => {
    setResponse(undefined);
    makeRequest<Response>({
      apiUrl: `${apiUrl}?${searchParams.toString()}`,
    }).then(setResponse);
  }, [apiUrl]);

  if (response) {
    return { response: response as Response, isLoading: false as const };
  }

  return { response: undefined, isLoading: true as const };
};
