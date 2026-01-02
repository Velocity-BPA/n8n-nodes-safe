/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { safeApiRequest } from '../../transport';

export const listDescription: INodeProperties[] = [
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['token'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search tokens by name or symbol',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 100,
        description: 'Maximum number of tokens to return',
      },
      {
        displayName: 'Offset',
        name: 'offset',
        type: 'number',
        default: 0,
        description: 'Number of tokens to skip',
      },
    ],
  },
];

export async function listExecute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const options = this.getNodeParameter('options', index, {}) as {
    search?: string;
    limit?: number;
    offset?: number;
  };

  const query: Record<string, string | number> = {};
  if (options.search) query.search = options.search;
  if (options.limit) query.limit = options.limit;
  if (options.offset) query.offset = options.offset;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: '/api/v1/tokens/',
    query,
  });

  return [{ json: response }];
}

export const getDescription: INodeProperties[] = [
  {
    displayName: 'Token Address',
    name: 'tokenAddress',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['token'],
        operation: ['get'],
      },
    },
    placeholder: '0x...',
    description: 'The address of the token contract',
  },
];

export async function getExecute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const tokenAddress = this.getNodeParameter('tokenAddress', index) as string;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: `/api/v1/tokens/${tokenAddress}/`,
  });

  return [{ json: response }];
}

export const operations = {
  list: { execute: listExecute, description: listDescription },
  get: { execute: getExecute, description: getDescription },
};

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['token'],
      },
    },
    options: [
      {
        name: 'Get Info',
        value: 'get',
        description: 'Get specific token details',
        action: 'Get token info',
      },
      {
        name: 'List Tokens',
        value: 'list',
        description: 'Get supported token registry',
        action: 'List tokens',
      },
    ],
    default: 'list',
  },
  ...listDescription,
  ...getDescription,
];
