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
        operation: ['list'],
      },
    },
    placeholder: '0x...',
    description: 'The address of the Safe multisig wallet',
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
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Executed',
        name: 'executed',
        type: 'boolean',
        default: true,
        description: 'Whether to filter by execution status',
      },
      {
        displayName: 'Queued',
        name: 'queued',
        type: 'boolean',
        default: true,
        description: 'Whether to include queued transactions',
      },
      {
        displayName: 'Trusted',
        name: 'trusted',
        type: 'boolean',
        default: true,
        description: 'Whether to include only trusted transactions',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 100,
        description: 'Maximum number of transactions to return',
      },
      {
        displayName: 'Offset',
        name: 'offset',
        type: 'number',
        default: 0,
        description: 'Number of transactions to skip',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const safeAddress = this.getNodeParameter('safeAddress', index) as string;
  const options = this.getNodeParameter('options', index, {}) as {
    executed?: boolean;
    queued?: boolean;
    trusted?: boolean;
    limit?: number;
    offset?: number;
  };

  const query: Record<string, string | number | boolean> = {};
  if (options.executed !== undefined) query.executed = options.executed;
  if (options.queued !== undefined) query.queued = options.queued;
  if (options.trusted !== undefined) query.trusted = options.trusted;
  if (options.limit) query.limit = options.limit;
  if (options.offset) query.offset = options.offset;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: `/api/v1/safes/${safeAddress}/all-transactions/`,
    query,
  });

  return [{ json: response }];
}
