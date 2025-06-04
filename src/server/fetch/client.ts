import { ClientFetchResponse } from '../type';

export const clientFetch = async (
  route: string,
  init: RequestInit
): Promise<ClientFetchResponse> => {
  console.log(route, init);
  const response = await fetch(route, init).then((res) => {
    return {
      ok: res.ok,
      status: res.status,
      json: () => res.json(),
    };
  });

  return response;
};
