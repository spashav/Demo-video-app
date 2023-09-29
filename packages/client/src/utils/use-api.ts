import { useEffect, useState } from 'react';
import { makeRequest } from './api';
import { useSearchParams } from 'react-router-dom';

export const useApi = <Response>({
  apiUrl,
  awaitPromise = Promise.resolve(),
  initial,
}: {
  apiUrl: string;
  awaitPromise?: Promise<void>;
  initial?: Response;
}) => {
  const [searchParams] = useSearchParams();
  const [response, setResponse] = useState<Response | undefined>(initial);
  useEffect(() => {
    if (initial) {
      return
    }
    setResponse(undefined);
    awaitPromise
      .then(() => {
        return makeRequest<Response>({
          apiUrl: `${apiUrl}?${searchParams.toString()}`,
        });
      })
      .then(setResponse);
  }, [apiUrl]);

  if (response) {
    return { response: response as Response, isLoading: false as const, isInitial: true };
  }

  return { response: undefined, isLoading: true as const, isInitial: false };
};
