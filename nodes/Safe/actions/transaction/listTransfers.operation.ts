/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { safeApiRequest } from '../../transport';

export const description: INodeProperties[] = [
  {
    displayName: 'Safe Address',
    name: 'safeAddress',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['listTransfers'],
      },
    },
    placeholder: '0x...',
    description: 'The address of the Safe multisig wallet',
  },
  {
    displayName: 'Direction',
    name: 'direction',
    type: 'options',
    required: true,
    options: [
      { name: 'Incoming', value: 'incoming' },
      { name: 'Outgoing', value: 'outgoing' },
      { name: 'All', value: 'all' },
    ],
    default: 'all',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['listTransfers'],
      },
    },
    description: 'Filter by transfer direction',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['listTransfers'],
      },
    },
    options: [
      {
        displayName: 'Token Address',
        name: 'tokenAddress',
        type: 'string',
        default: '',
        description: 'Filter by token contract address',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 100,
        description: 'Maximum number of transfers to return',
      },
      {
        displayName: 'Offset',
        name: 'offset',
        type: 'number',
        default: 0,
        description: 'Number of transfers to skip',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const safeAddress = this.getNodeParameter('safeAddress', index) as string;
  const direction = this.getNodeParameter('direction', index) as string;
  const options = this.getNodeParameter('options', index, {}) as {
    tokenAddress?: string;
    limit?: number;
    offset?: number;
  };

  let endpoint: string;
  switch (direction) {
    case 'incoming':
      endpoint = `/api/v1/safes/${safeAddress}/incoming-transfers/`;
      break;
    case 'outgoing':
      endpoint = `/api/v1/safes/${safeAddress}/transfers/`;
      break;
    default:
      endpoint = `/api/v1/safes/${safeAddress}/transfers/`;
  }

  const query: Record<string, string | number> = {};
  if (options.tokenAddress) query.token_address = options.tokenAddress;
  if (options.limit) query.limit = options.limit;
  if (options.offset) query.offset = options.offset;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint,
    query,
  });

  return [{ json: response }];
}
