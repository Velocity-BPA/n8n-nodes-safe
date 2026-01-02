/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IWebhookFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IDataObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { getApiUrl } from '../constants';

/**
 * Options for API requests
 */
export interface SafeApiRequestOptions {
  method: IHttpRequestMethods;
  endpoint: string;
  body?: IDataObject;
  query?: IDataObject;
  headers?: IDataObject;
}

/**
 * Runtime licensing notice - logged once per session
 */
let licensingNoticeLogged = false;

function logLicensingNotice(): void {
  if (!licensingNoticeLogged) {
    console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
    licensingNoticeLogged = true;
  }
}

/**
 * Make an authenticated request to the Safe Transaction Service API
 */
export async function safeApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
  options: SafeApiRequestOptions,
): Promise<IDataObject> {
  // Log licensing notice once per session
  logLicensingNotice();

  const credentials = await this.getCredentials('safeApi');

  if (!credentials) {
    throw new NodeOperationError(this.getNode(), 'No credentials provided for Safe API');
  }

  const network = credentials.network as string;
  const customApiUrl = credentials.customApiUrl as string | undefined;
  const apiKey = credentials.apiKey as string;

  const baseUrl = getApiUrl(network, customApiUrl);
  const url = `${baseUrl}${options.endpoint}`;

  const requestOptions: IHttpRequestOptions = {
    method: options.method,
    url,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      ...(options.headers || {}),
    },
    json: true,
  };

  if (options.body && Object.keys(options.body).length > 0) {
    requestOptions.body = options.body;
  }

  if (options.query && Object.keys(options.query).length > 0) {
    requestOptions.qs = options.query;
  }

  try {
    const response = await this.helpers.httpRequest(requestOptions);
    return response as IDataObject;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new NodeApiError(this.getNode(), { message: errorMessage }, {
      message: `Safe API request failed: ${errorMessage}`,
    });
  }
}

/**
 * Make a paginated request to the Safe API
 */
export async function safeApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  options: SafeApiRequestOptions,
  limit?: number,
): Promise<IDataObject[]> {
  const results: IDataObject[] = [];
  let nextUrl: string | null = null;
  const query = { ...options.query, limit: limit || 100 };

  // First request
  const response = await safeApiRequest.call(this, {
    ...options,
    query,
  });

  if (response.results && Array.isArray(response.results)) {
    results.push(...(response.results as IDataObject[]));
  }

  nextUrl = response.next as string | null;

  // Follow pagination
  while (nextUrl && (!limit || results.length < limit)) {
    const credentials = await this.getCredentials('safeApi');
    const apiKey = credentials.apiKey as string;

    const paginatedResponse = await this.helpers.httpRequest({
      method: 'GET',
      url: nextUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      json: true,
    });

    if (paginatedResponse.results && Array.isArray(paginatedResponse.results)) {
      results.push(...(paginatedResponse.results as IDataObject[]));
    }

    nextUrl = paginatedResponse.next as string | null;
  }

  return limit ? results.slice(0, limit) : results;
}

/**
 * Make a request without authentication (for public endpoints)
 */
export async function safeApiRequestPublic(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  options: SafeApiRequestOptions,
): Promise<IDataObject> {
  const credentials = await this.getCredentials('safeApi');
  const network = credentials.network as string;
  const customApiUrl = credentials.customApiUrl as string | undefined;

  const baseUrl = getApiUrl(network, customApiUrl);
  const url = `${baseUrl}${options.endpoint}`;

  const requestOptions: IHttpRequestOptions = {
    method: options.method,
    url,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    json: true,
  };

  if (options.body && Object.keys(options.body).length > 0) {
    requestOptions.body = options.body;
  }

  if (options.query && Object.keys(options.query).length > 0) {
    requestOptions.qs = options.query;
  }

  try {
    const response = await this.helpers.httpRequest(requestOptions);
    return response as IDataObject;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new NodeApiError(this.getNode(), { message: errorMessage }, {
      message: `Safe API request failed: ${errorMessage}`,
    });
  }
}
