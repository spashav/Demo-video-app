export const makeRequest = async <Response>({apiUrl}: {apiUrl: string}) => {
  const res = await fetch(`/api/${apiUrl}`);
  return await res.json() as Response;
}
