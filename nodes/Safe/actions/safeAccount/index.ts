/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

import * as getInfo from './getInfo.operation';
import * as getBalances from './getBalances.operation';
import * as getCollectibles from './getCollectibles.operation';
import * as getDelegates from './getDelegates.operation';
import * as addDelegate from './addDelegate.operation';
import * as removeDelegate from './removeDelegate.operation';

export const operations = {
  getInfo,
  getBalances,
  getCollectibles,
  getDelegates,
  addDelegate,
  removeDelegate,
};

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['safeAccount'],
      },
    },
    options: [
      {
        name: 'Add Delegate',
        value: 'addDelegate',
        description: 'Authorize a new delegate for the Safe',
        action: 'Add delegate',
      },
      {
        name: 'Get Balances',
        value: 'getBalances',
        description: 'Get all token balances for a Safe',
        action: 'Get balances',
      },
      {
        name: 'Get Collectibles',
        value: 'getCollectibles',
        description: 'Get NFT holdings for a Safe',
        action: 'Get collectibles',
      },
      {
        name: 'Get Delegates',
        value: 'getDelegates',
        description: 'Get authorized delegates for a Safe',
        action: 'Get delegates',
      },
      {
        name: 'Get Info',
        value: 'getInfo',
        description: 'Get Safe configuration and state',
        action: 'Get safe info',
      },
      {
        name: 'Remove Delegate',
        value: 'removeDelegate',
        description: 'Revoke delegate access',
        action: 'Remove delegate',
      },
    ],
    default: 'getInfo',
  },
  ...getInfo.description,
  ...getBalances.description,
  ...getCollectibles.description,
  ...getDelegates.description,
  ...addDelegate.description,
  ...removeDelegate.description,
];
