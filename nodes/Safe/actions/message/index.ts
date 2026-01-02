/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

import * as list from './list.operation';
import * as get from './get.operation';
import * as create from './create.operation';
import * as sign from './sign.operation';

export const operations = {
  list,
  get,
  create,
  sign,
};

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['message'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Propose a new message for signing',
        action: 'Create message',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get specific message details',
        action: 'Get message',
      },
      {
        name: 'List',
        value: 'list',
        description: 'Get all messages for a Safe',
        action: 'List messages',
      },
      {
        name: 'Sign',
        value: 'sign',
        description: 'Add signature to a message',
        action: 'Sign message',
      },
    ],
    default: 'list',
  },
  ...list.description,
  ...get.description,
  ...create.description,
  ...sign.description,
];
