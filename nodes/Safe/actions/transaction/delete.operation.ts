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
        operation: ['delete'],
      },
    },
    placeholder: '0x...',
    description: 'The address of the Safe multisig wallet',
  },
  {
    displayName: 'Safe Transaction Hash',
    name: 'safeTxHash',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['delete'],
      },
    },
    description: 'The Safe transaction hash to delete',
  },
  {
    displayName: 'Signature',
    name: 'signature',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['delete'],
      },
    },
    description: 'Signature from an owner or delegate authorizing deletion',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const safeAddress = this.getNodeParameter('safeAddress', index) as string;
  const safeTxHash = this.getNodeParameter('safeTxHash', index) as string;
  const signature = this.getNodeParameter('signature', index) as string;

  const response = await safeApiRequest.call(this, {
    method: 'DELETE',
    endpoint: `/api/v1/safes/${safeAddress}/transactions/${safeTxHash}/`,
    body: {
      signature,
    },
  });

  return [{ json: response || { success: true, deleted: safeTxHash } }];
}
