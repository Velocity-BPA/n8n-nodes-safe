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
        operation: ['getDelegates'],
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
        operation: ['getDelegates'],
      },
    },
    options: [
      {
        displayName: 'Delegator Address',
        name: 'delegator',
        type: 'string',
        default: '',
        description: 'Filter by delegator address',
      },
      {
        displayName: 'Delegate Address',
        name: 'delegate',
        type: 'string',
        default: '',
        description: 'Filter by delegate address',
      },
      {
        displayName: 'Label',
        name: 'label',
        type: 'string',
        default: '',
        description: 'Filter by delegate label',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 100,
        description: 'Maximum number of results to return',
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
    delegator?: string;
    delegate?: string;
    label?: string;
    limit?: number;
  };

  const query: Record<string, string | number> = { safe: safeAddress };
  if (options.delegator) query.delegator = options.delegator;
  if (options.delegate) query.delegate = options.delegate;
  if (options.label) query.label = options.label;
  if (options.limit) query.limit = options.limit;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: '/api/v1/delegates/',
    query,
  });

  return [{ json: response }];
}
