/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import * as safeAccount from './actions/safeAccount';
import * as transaction from './actions/transaction';
import * as signature from './actions/signature';
import * as message from './actions/message';
import * as contract from './actions/contract';
import * as safeModule from './actions/module';
import * as owner from './actions/owner';
import * as safeOperation from './actions/safeOperation';
import * as token from './actions/token';
import * as chain from './actions/chain';

/**
 * Safe (Gnosis Safe) n8n community node
 *
 * Provides comprehensive integration with Safe Transaction Service API
 * for multisig wallet automation including transaction proposals,
 * signature collection, and Safe management operations.
 */
export class Safe implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Safe',
    name: 'safe',
    icon: 'file:safe.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Safe (Gnosis Safe) multisig wallets',
    defaults: {
      name: 'Safe',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'safeApi',
        required: false,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Chain',
            value: 'chain',
            description: 'Network and chain information',
          },
          {
            name: 'Contract',
            value: 'contract',
            description: 'Contract information and data decoding',
          },
          {
            name: 'Message',
            value: 'message',
            description: 'Off-chain signed messages',
          },
          {
            name: 'Module',
            value: 'module',
            description: 'Safe module management',
          },
          {
            name: 'Owner',
            value: 'owner',
            description: 'Safe ownership information',
          },
          {
            name: 'Safe Account',
            value: 'safeAccount',
            description: 'Safe configuration, balances, and delegates',
          },
          {
            name: 'Safe Operation',
            value: 'safeOperation',
            description: 'ERC-4337 account abstraction operations',
          },
          {
            name: 'Signature',
            value: 'signature',
            description: 'Transaction confirmations and signatures',
          },
          {
            name: 'Token',
            value: 'token',
            description: 'Token registry and information',
          },
          {
            name: 'Transaction',
            value: 'transaction',
            description: 'Transaction proposals and management',
          },
        ],
        default: 'safeAccount',
      },
      ...safeAccount.description,
      ...transaction.description,
      ...signature.description,
      ...message.description,
      ...contract.description,
      ...safeModule.description,
      ...owner.description,
      ...safeOperation.description,
      ...token.description,
      ...chain.description,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: INodeExecutionData[];

        switch (resource) {
          case 'safeAccount':
            responseData = await safeAccount.operations[
              operation as keyof typeof safeAccount.operations
            ].execute.call(this, i);
            break;

          case 'transaction':
            responseData = await transaction.operations[
              operation as keyof typeof transaction.operations
            ].execute.call(this, i);
            break;

          case 'signature':
            responseData = await signature.operations[
              operation as keyof typeof signature.operations
            ].execute.call(this, i);
            break;

          case 'message':
            responseData = await message.operations[
              operation as keyof typeof message.operations
            ].execute.call(this, i);
            break;

          case 'contract':
            responseData = await contract.operations[
              operation as keyof typeof contract.operations
            ].execute.call(this, i);
            break;

          case 'module':
            responseData = await safeModule.operations[
              operation as keyof typeof safeModule.operations
            ].execute.call(this, i);
            break;

          case 'owner':
            responseData = await owner.operations[
              operation as keyof typeof owner.operations
            ].execute.call(this, i);
            break;

          case 'safeOperation':
            responseData = await safeOperation.operations[
              operation as keyof typeof safeOperation.operations
            ].execute.call(this, i);
            break;

          case 'token':
            responseData = await token.operations[
              operation as keyof typeof token.operations
            ].execute.call(this, i);
            break;

          case 'chain':
            responseData = await chain.operations[
              operation as keyof typeof chain.operations
            ].execute.call(this, i);
            break;

          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        returnData.push(...responseData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
