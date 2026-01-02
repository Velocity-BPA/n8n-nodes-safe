/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { safeApiRequest } from '../../transport';
import { OperationType, ZERO_ADDRESS } from '../../constants';

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
        operation: ['create'],
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
        operation: ['create'],
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
        operation: ['create'],
      },
    },
    description: 'Amount of native token to send in wei',
  },
  {
    displayName: 'Safe Transaction Hash',
    name: 'contractTransactionHash',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
      },
    },
    description: 'Unique transaction hash computed using EIP-712',
  },
  {
    displayName: 'Sender Address',
    name: 'sender',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
      },
    },
    placeholder: '0x...',
    description: 'Address of the owner proposing the transaction',
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
        operation: ['create'],
      },
    },
    description: 'Signature from the sender',
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
        operation: ['create'],
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
        description: 'Type of operation to execute',
      },
      {
        displayName: 'Safe TX Gas',
        name: 'safeTxGas',
        type: 'string',
        default: '0',
        description: 'Gas allocated for the Safe transaction',
      },
      {
        displayName: 'Base Gas',
        name: 'baseGas',
        type: 'string',
        default: '0',
        description: 'Base gas cost for the transaction',
      },
      {
        displayName: 'Gas Price',
        name: 'gasPrice',
        type: 'string',
        default: '0',
        description: 'Gas price for refund calculation',
      },
      {
        displayName: 'Gas Token',
        name: 'gasToken',
        type: 'string',
        default: ZERO_ADDRESS,
        description: 'Token address for gas payment (0x0 for ETH)',
      },
      {
        displayName: 'Refund Receiver',
        name: 'refundReceiver',
        type: 'string',
        default: ZERO_ADDRESS,
        description: 'Address to receive gas refund',
      },
      {
        displayName: 'Nonce',
        name: 'nonce',
        type: 'number',
        default: 0,
        description: 'Transaction nonce (auto-filled if 0)',
      },
      {
        displayName: 'Origin',
        name: 'origin',
        type: 'string',
        default: '',
        description: 'Origin identifier for the transaction',
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
  const contractTransactionHash = this.getNodeParameter('contractTransactionHash', index) as string;
  const sender = this.getNodeParameter('sender', index) as string;
  const signature = this.getNodeParameter('signature', index) as string;
  const options = this.getNodeParameter('options', index, {}) as {
    data?: string;
    operation?: number;
    safeTxGas?: string;
    baseGas?: string;
    gasPrice?: string;
    gasToken?: string;
    refundReceiver?: string;
    nonce?: number;
    origin?: string;
  };

  const body: IDataObject = {
    to,
    value,
    contractTransactionHash,
    sender,
    signature,
    data: options.data || null,
    operation: options.operation ?? OperationType.CALL,
    safeTxGas: options.safeTxGas || '0',
    baseGas: options.baseGas || '0',
    gasPrice: options.gasPrice || '0',
    gasToken: options.gasToken || ZERO_ADDRESS,
    refundReceiver: options.refundReceiver || ZERO_ADDRESS,
  };

  if (options.nonce !== undefined && options.nonce > 0) {
    body.nonce = options.nonce;
  }

  if (options.origin) {
    body.origin = options.origin;
  }

  const response = await safeApiRequest.call(this, {
    method: 'POST',
    endpoint: `/api/v1/safes/${safeAddress}/multisig-transactions/`,
    body,
  });

  return [{ json: response }];
}
