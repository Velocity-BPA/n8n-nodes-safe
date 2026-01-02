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
    displayName: 'Message Hash',
    name: 'messageHash',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['get'],
      },
    },
    description: 'The hash of the message to retrieve',
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const messageHash = this.getNodeParameter('messageHash', index) as string;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: `/api/v1/messages/${messageHash}/`,
  });

  return [{ json: response }];
}
