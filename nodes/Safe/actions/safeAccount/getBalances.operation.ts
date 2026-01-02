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
        resource: ['safeAccount'],
        operation: ['getBalances'],
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
        resource: ['safeAccount'],
        operation: ['getBalances'],
      },
    },
    options: [
      {
        displayName: 'Trusted Tokens Only',
        name: 'trusted',
        type: 'boolean',
        default: false,
        description: 'Whether to only return balances for trusted tokens',
      },
      {
        displayName: 'Exclude Spam Tokens',
        name: 'excludeSpam',
        type: 'boolean',
        default: true,
        description: 'Whether to exclude spam tokens from results',
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
    trusted?: boolean;
    excludeSpam?: boolean;
  };

  const query: Record<string, string | boolean> = {};
  if (options.trusted !== undefined) query.trusted = options.trusted;
  if (options.excludeSpam !== undefined) query.exclude_spam = options.excludeSpam;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: `/api/v1/safes/${safeAddress}/balances/`,
    query,
  });

  return [{ json: response }];
}
