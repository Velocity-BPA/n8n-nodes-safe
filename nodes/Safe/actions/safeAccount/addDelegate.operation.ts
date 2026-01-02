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
        operation: ['addDelegate'],
      },
    },
    placeholder: '0x...',
    description: 'The address of the Safe multisig wallet',
  },
  {
    displayName: 'Delegate Address',
    name: 'delegate',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['safeAccount'],
        operation: ['addDelegate'],
      },
    },
    placeholder: '0x...',
    description: 'Address to authorize as delegate',
  },
  {
    displayName: 'Delegator Address',
    name: 'delegator',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['safeAccount'],
        operation: ['addDelegate'],
      },
    },
    placeholder: '0x...',
    description: 'Address of the owner granting delegation',
  },
  {
    displayName: 'Signature',
    name: 'signature',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['safeAccount'],
        operation: ['addDelegate'],
      },
    },
    description: 'Signature from delegator authorizing the delegate',
  },
  {
    displayName: 'Label',
    name: 'label',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['safeAccount'],
        operation: ['addDelegate'],
      },
    },
    placeholder: 'Treasury Manager',
    description: 'Human-readable label for the delegate',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const safeAddress = this.getNodeParameter('safeAddress', index) as string;
  const delegate = this.getNodeParameter('delegate', index) as string;
  const delegator = this.getNodeParameter('delegator', index) as string;
  const signature = this.getNodeParameter('signature', index) as string;
  const label = this.getNodeParameter('label', index) as string;

  const response = await safeApiRequest.call(this, {
    method: 'POST',
    endpoint: '/api/v1/delegates/',
    body: {
      safe: safeAddress,
      delegate,
      delegator,
      signature,
      label,
    },
  });

  return [{ json: response }];
}
