/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { safeApiRequest } from '../../transport';

export const listSafesDescription: INodeProperties[] = [
  {
    displayName: 'Owner Address',
    name: 'ownerAddress',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['owner'],
        operation: ['listSafes'],
      },
    },
    placeholder: '0x...',
    description: 'The address of the owner',
  },
];

export async function listSafesExecute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const ownerAddress = this.getNodeParameter('ownerAddress', index) as string;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: `/api/v1/owners/${ownerAddress}/safes/`,
  });

  return [{ json: response }];
}

export const operations = {
  listSafes: { execute: listSafesExecute, description: listSafesDescription },
};

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['owner'],
      },
    },
    options: [
      {
        name: 'List Safes by Owner',
        value: 'listSafes',
        description: 'Get all Safes owned by an address',
        action: 'List safes by owner',
      },
    ],
    default: 'listSafes',
  },
  ...listSafesDescription,
];
