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
        operation: ['listMultisig'],
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
        operation: ['listMultisig'],
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
        displayName: 'Nonce',
        name: 'nonce',
        type: 'number',
        default: 0,
        description: 'Filter by specific nonce',
      },
      {
        displayName: 'Nonce Greater Than',
        name: 'nonceGte',
        type: 'number',
        default: 0,
        description: 'Filter by nonce greater than or equal to',
      },
      {
        displayName: 'To Address',
        name: 'to',
        type: 'string',
        default: '',
        description: 'Filter by destination address',
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
      {
        displayName: 'Ordering',
        name: 'ordering',
        type: 'options',
        options: [
          { name: 'Newest First', value: '-nonce' },
          { name: 'Oldest First', value: 'nonce' },
          { name: 'Submission Date (Newest)', value: '-submissionDate' },
          { name: 'Submission Date (Oldest)', value: 'submissionDate' },
        ],
        default: '-nonce',
        description: 'Order of results',
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
    nonce?: number;
    nonceGte?: number;
    to?: string;
    limit?: number;
    offset?: number;
    ordering?: string;
  };

  const query: Record<string, string | number | boolean> = {};
  if (options.executed !== undefined) query.executed = options.executed;
  if (options.nonce) query.nonce = options.nonce;
  if (options.nonceGte) query.nonce__gte = options.nonceGte;
  if (options.to) query.to = options.to;
  if (options.limit) query.limit = options.limit;
  if (options.offset) query.offset = options.offset;
  if (options.ordering) query.ordering = options.ordering;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: `/api/v1/safes/${safeAddress}/multisig-transactions/`,
    query,
  });

  return [{ json: response }];
}
