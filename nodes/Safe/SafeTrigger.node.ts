/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
} from 'n8n-workflow';

/**
 * Safe Trigger Node
 *
 * Provides webhook-based triggers for Safe events including
 * transaction proposals, confirmations, executions, and transfers.
 *
 * Note: Safe Transaction Service supports webhooks via the /api/v1/safes/{address}/webhook/ endpoint.
 * The webhook must be registered externally as the Safe API requires authentication for webhook registration.
 */
export class SafeTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Safe Trigger',
    name: 'safeTrigger',
    icon: 'file:safe.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Listen for Safe (Gnosis Safe) events via webhooks',
    defaults: {
      name: 'Safe Trigger',
    },
    inputs: [],
    outputs: ['main'],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        noDataExpression: true,
        required: true,
        options: [
          {
            name: 'All Events',
            value: 'all',
            description: 'Trigger on any Safe event',
          },
          {
            name: 'Executed Transaction',
            value: 'EXECUTED_MULTISIG_TRANSACTION',
            description: 'Transaction was successfully executed',
          },
          {
            name: 'Incoming ERC20 Transfer',
            value: 'INCOMING_ETHER',
            description: 'ETH was received by the Safe',
          },
          {
            name: 'Incoming ETH',
            value: 'INCOMING_TOKEN',
            description: 'ERC20 token was received by the Safe',
          },
          {
            name: 'Message Confirmation',
            value: 'MESSAGE_CONFIRMATION',
            description: 'A message received a new signature',
          },
          {
            name: 'Module Transaction',
            value: 'MODULE_TRANSACTION',
            description: 'Transaction was executed by a module',
          },
          {
            name: 'New Confirmation',
            value: 'NEW_CONFIRMATION',
            description: 'Transaction received a new signature',
          },
          {
            name: 'Outgoing ERC20 Transfer',
            value: 'OUTGOING_TOKEN',
            description: 'ERC20 token was sent from the Safe',
          },
          {
            name: 'Outgoing ETH',
            value: 'OUTGOING_ETHER',
            description: 'ETH was sent from the Safe',
          },
          {
            name: 'Pending Multisig Transaction',
            value: 'PENDING_MULTISIG_TRANSACTION',
            description: 'New transaction was proposed',
          },
          {
            name: 'Safe Created',
            value: 'SAFE_CREATED',
            description: 'A new Safe was created',
          },
        ],
        default: 'all',
        description: 'The event type to listen for',
      },
      {
        displayName: 'Safe Address Filter',
        name: 'safeAddress',
        type: 'string',
        default: '',
        placeholder: '0x...',
        description:
          'Only trigger for events from this Safe address. Leave empty to receive events from all Safes.',
      },
      {
        displayName:
          'Setup Instructions',
        name: 'setupNotice',
        type: 'notice',
        default: '',
        displayOptions: {
          show: {},
        },
        // eslint-disable-next-line n8n-nodes-base/node-param-description-unneeded-backticks
        description: `To use this trigger:
1. Copy the webhook URL shown below after activating the workflow
2. Register the webhook URL with Safe Transaction Service
3. For self-hosted Safe services, use the /api/v1/safes/{address}/webhook/ endpoint
4. Events will be sent to this workflow when they occur`,
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        // Safe webhooks are managed externally
        // Return true to indicate we're ready to receive webhooks
        return true;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        // Webhooks must be registered externally with Safe Transaction Service
        // Log the webhook URL for the user to register
        const webhookUrl = this.getNodeWebhookUrl('default');
        console.log(`Safe Trigger webhook URL: ${webhookUrl}`);
        console.log('Register this URL with your Safe Transaction Service to receive events.');
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        // Webhooks must be deleted externally from Safe Transaction Service
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const body = this.getBodyData() as {
      type?: string;
      address?: string;
      safeTxHash?: string;
      txHash?: string;
      [key: string]: unknown;
    };

    const event = this.getNodeParameter('event') as string;
    const safeAddressFilter = this.getNodeParameter('safeAddress') as string;

    // Filter by event type
    if (event !== 'all' && body.type !== event) {
      return {
        noWebhookResponse: true,
      };
    }

    // Filter by Safe address
    if (safeAddressFilter && body.address?.toLowerCase() !== safeAddressFilter.toLowerCase()) {
      return {
        noWebhookResponse: true,
      };
    }

    // Return the webhook data
    return {
      workflowData: [
        [
          {
            json: {
              event: body.type,
              safeAddress: body.address,
              safeTxHash: body.safeTxHash,
              txHash: body.txHash,
              data: body,
              headers: req.headers,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      ],
    };
  }
}
