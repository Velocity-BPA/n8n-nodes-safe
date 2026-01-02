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
    displayName: 'Safe Transaction Hash',
    name: 'safeTxHash',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['get'],
      },
    },
    description: 'The Safe transaction hash to retrieve',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const safeTxHash = this.getNodeParameter('safeTxHash', index) as string;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: `/api/v1/multisig-transactions/${safeTxHash}/`,
  });

  return [{ json: response }];
}
