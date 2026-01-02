/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { safeApiRequest } from '../../transport';

export const getInfoDescription: INodeProperties[] = [
  {
    displayName: 'Contract Address',
    name: 'contractAddress',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['getInfo'],
      },
    },
    placeholder: '0x...',
    description: 'The address of the contract',
  },
];

export async function getInfoExecute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const contractAddress = this.getNodeParameter('contractAddress', index) as string;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: `/api/v1/contracts/${contractAddress}/`,
  });

  return [{ json: response }];
}

export const decodeDescription: INodeProperties[] = [
  {
    displayName: 'Data',
    name: 'data',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['decode'],
      },
    },
    description: 'Hex-encoded transaction data to decode',
  },
  {
    displayName: 'To Address',
    name: 'to',
    type: 'string',
    required: false,
    default: '',
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['decode'],
      },
    },
    placeholder: '0x...',
    description: 'Target contract address for better decoding',
  },
];

export async function decodeExecute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const data = this.getNodeParameter('data', index) as string;
  const to = this.getNodeParameter('to', index, '') as string;

  const body: Record<string, string> = { data };
  if (to) body.to = to;

  const response = await safeApiRequest.call(this, {
    method: 'POST',
    endpoint: '/api/v1/data-decoder/',
    body,
  });

  return [{ json: response }];
}

export const operations = {
  getInfo: { execute: getInfoExecute, description: getInfoDescription },
  decode: { execute: decodeExecute, description: decodeDescription },
};

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['contract'],
      },
    },
    options: [
      {
        name: 'Decode Data',
        value: 'decode',
        description: 'Decode transaction data',
        action: 'Decode contract data',
      },
      {
        name: 'Get Info',
        value: 'getInfo',
        description: 'Get contract information and ABI',
        action: 'Get contract info',
      },
    ],
    default: 'getInfo',
  },
  ...getInfoDescription,
  ...decodeDescription,
];
