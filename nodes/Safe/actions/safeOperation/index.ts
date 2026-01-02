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
    displayName: 'Safe Address',
    name: 'safeAddress',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['safeOperation'],
        operation: ['list'],
      },
    },
    placeholder: '0x...',
    description: 'The address of the Safe wallet',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['safeOperation'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 100,
        description: 'Maximum number of operations to return',
      },
      {
        displayName: 'Offset',
        name: 'offset',
        type: 'number',
        default: 0,
        description: 'Number of operations to skip',
      },
    ],
  },
];

export async function listExecute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const safeAddress = this.getNodeParameter('safeAddress', index) as string;
  const options = this.getNodeParameter('options', index, {}) as {
    limit?: number;
    offset?: number;
  };

  const query: Record<string, number> = {};
  if (options.limit) query.limit = options.limit;
  if (options.offset) query.offset = options.offset;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: `/api/v1/safes/${safeAddress}/safe-operations/`,
    query,
  });

  return [{ json: response }];
}

export const getDescription: INodeProperties[] = [
  {
    displayName: 'User Operation Hash',
    name: 'userOperationHash',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['safeOperation'],
        operation: ['get'],
      },
    },
    description: 'The user operation hash to retrieve',
  },
];

export async function getExecute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userOperationHash = this.getNodeParameter('userOperationHash', index) as string;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: `/api/v1/safe-operations/${userOperationHash}/`,
  });

  return [{ json: response }];
}

export const confirmDescription: INodeProperties[] = [
  {
    displayName: 'User Operation Hash',
    name: 'userOperationHash',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['safeOperation'],
        operation: ['confirm'],
      },
    },
    description: 'The user operation hash to confirm',
  },
  {
    displayName: 'Signature',
    name: 'signature',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['safeOperation'],
        operation: ['confirm'],
      },
    },
    description: 'The owner signature for the operation',
  },
];

export async function confirmExecute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userOperationHash = this.getNodeParameter('userOperationHash', index) as string;
  const signature = this.getNodeParameter('signature', index) as string;

  const response = await safeApiRequest.call(this, {
    method: 'POST',
    endpoint: `/api/v1/safe-operations/${userOperationHash}/confirmations/`,
    body: {
      signature,
    },
  });

  return [{ json: response }];
}

export const operations = {
  list: { execute: listExecute, description: listDescription },
  get: { execute: getExecute, description: getDescription },
  confirm: { execute: confirmExecute, description: confirmDescription },
};

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['safeOperation'],
      },
    },
    options: [
      {
        name: 'Confirm',
        value: 'confirm',
        description: 'Sign a Safe operation',
        action: 'Confirm safe operation',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get specific Safe operation details',
        action: 'Get safe operation',
      },
      {
        name: 'List',
        value: 'list',
        description: 'Get all Safe operations',
        action: 'List safe operations',
      },
    ],
    default: 'list',
  },
  ...listDescription,
  ...getDescription,
  ...confirmDescription,
];
