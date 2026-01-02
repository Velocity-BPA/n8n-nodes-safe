/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { safeApiRequest } from '../../transport';
import { OperationType } from '../../constants';

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
        operation: ['estimateGas'],
      },
    },
    placeholder: '0x...',
    description: 'The address of the Safe multisig wallet',
  },
  {
    displayName: 'To Address',
    name: 'to',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['estimateGas'],
      },
    },
    placeholder: '0x...',
    description: 'Destination address for the transaction',
  },
  {
    displayName: 'Value (Wei)',
    name: 'value',
    type: 'string',
    required: true,
    default: '0',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['estimateGas'],
      },
    },
    description: 'Amount of native token to send in wei',
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
        operation: ['estimateGas'],
      },
    },
    options: [
      {
        displayName: 'Data',
        name: 'data',
        type: 'string',
        default: '',
        description: 'Transaction data (hex encoded)',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Call', value: OperationType.CALL },
          { name: 'Delegate Call', value: OperationType.DELEGATE_CALL },
        ],
        default: OperationType.CALL,
        description: 'Type of operation',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const safeAddress = this.getNodeParameter('safeAddress', index) as string;
  const to = this.getNodeParameter('to', index) as string;
  const value = this.getNodeParameter('value', index) as string;
  const options = this.getNodeParameter('options', index, {}) as {
    data?: string;
    operation?: number;
  };

  const response = await safeApiRequest.call(this, {
    method: 'POST',
    endpoint: `/api/v1/safes/${safeAddress}/multisig-transactions/estimations/`,
    body: {
      to,
      value,
      data: options.data || null,
      operation: options.operation ?? OperationType.CALL,
    },
  });

  return [{ json: response }];
}
