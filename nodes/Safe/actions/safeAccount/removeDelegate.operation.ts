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
    displayName: 'Delegate Address',
    name: 'delegate',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['safeAccount'],
        operation: ['removeDelegate'],
      },
    },
    placeholder: '0x...',
    description: 'Address of the delegate to remove',
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
        operation: ['removeDelegate'],
      },
    },
    placeholder: '0x...',
    description: 'Address of the owner who granted delegation',
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
        operation: ['removeDelegate'],
      },
    },
    description: 'Signature from delegator authorizing removal',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const delegate = this.getNodeParameter('delegate', index) as string;
  const delegator = this.getNodeParameter('delegator', index) as string;
  const signature = this.getNodeParameter('signature', index) as string;

  const response = await safeApiRequest.call(this, {
    method: 'DELETE',
    endpoint: `/api/v1/delegates/${delegate}/`,
    body: {
      delegator,
      signature,
    },
  });

  return [{ json: response || { success: true } }];
}
