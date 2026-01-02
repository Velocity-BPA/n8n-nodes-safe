/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

import * as list from './list.operation';
import * as add from './add.operation';

export const operations = {
  list,
  add,
};

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['signature'],
      },
    },
    options: [
      {
        name: 'Add Confirmation',
        value: 'add',
        description: 'Submit owner signature for a transaction',
        action: 'Add confirmation',
      },
      {
        name: 'List Confirmations',
        value: 'list',
        description: 'Get all signatures for a transaction',
        action: 'List confirmations',
      },
    ],
    default: 'list',
  },
  ...list.description,
  ...add.description,
];
