/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
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
        resource: ['message'],
        operation: ['create'],
      },
    },
    placeholder: '0x...',
    description: 'The address of the Safe multisig wallet',
  },
  {
    displayName: 'Message',
    name: 'message',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['create'],
      },
    },
    description: 'The message to be signed (plain text or JSON for EIP-712)',
  },
  {
    displayName: 'Signature',
    name: 'signature',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['create'],
      },
    },
    description: 'Initial signature from the proposer',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Safe App ID',
        name: 'safeAppId',
        type: 'number',
        default: 0,
        description: 'ID of the Safe App that proposed this message',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const safeAddress = this.getNodeParameter('safeAddress', index) as string;
  const message = this.getNodeParameter('message', index) as string;
  const signature = this.getNodeParameter('signature', index) as string;
  const options = this.getNodeParameter('options', index, {}) as {
    safeAppId?: number;
  };

  // Try to parse message as JSON for EIP-712 typed data
  let parsedMessage: string | IDataObject;
  try {
    parsedMessage = JSON.parse(message) as IDataObject;
  } catch {
    parsedMessage = message;
  }

  const body: IDataObject = {
    message: parsedMessage,
    signature,
  };

  if (options.safeAppId) {
    body.safeAppId = options.safeAppId;
  }

  const response = await safeApiRequest.call(this, {
    method: 'POST',
    endpoint: `/api/v1/safes/${safeAddress}/messages/`,
    body,
  });

  return [{ json: response }];
}
