export interface ClientFetchResponse {
  ok: boolean;
  status: number;
  json: () => Promise<any>;
}
