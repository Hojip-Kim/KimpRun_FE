export type {
  ClientFetchResponse,
  ServerFetchResponse,
  FetchConfig,
  ApiResponse,
  ProcessedApiResponse,
} from '../type';

export { createRequest, createApiClient } from './request';

export { clientFetch, clientRequest } from './client';

import {
  serverFetch,
  serverGet,
  serverPost,
  serverPut,
  serverPatch,
  serverDelete,
  cachedRequest,
} from './server';

export {
  serverFetch,
  serverGet,
  serverPost,
  serverPut,
  serverPatch,
  serverDelete,
  cachedRequest,
};

export const serverRequest = {
  get: serverGet,
  post: serverPost,
  put: serverPut,
  patch: serverPatch,
  delete: serverDelete,
};

export const serverUtils = {
  cachedRequest,
};
