/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

import * as list from './list.operation';
import * as listMultisig from './listMultisig.operation';
import * as listTransfers from './listTransfers.operation';
import * as get from './get.operation';
import * as create from './create.operation';
import * as confirm from './confirm.operation';
import * as estimateGas from './estimateGas.operation';
import * as deleteOp from './delete.operation';

export const operations = {
  list,
  listMultisig,
  listTransfers,
  get,
  create,
  confirm,
  estimateGas,
  delete: deleteOp,
};

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['transaction'],
      },
    },
    options: [
      {
        name: 'Confirm',
        value: 'confirm',
        description: 'Add signature to a pending transaction',
        action: 'Confirm transaction',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Propose a new multisig transaction',
        action: 'Create transaction',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Remove a queued transaction',
        action: 'Delete transaction',
      },
      {
        name: 'Estimate Gas',
        value: 'estimateGas',
        description: 'Estimate gas for a transaction',
        action: 'Estimate gas',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get specific transaction details',
        action: 'Get transaction',
      },
      {
        name: 'List All',
        value: 'list',
        description: 'Get all transactions for a Safe',
        action: 'List all transactions',
      },
      {
        name: 'List Multisig',
        value: 'listMultisig',
        description: 'Get multisig transactions',
        action: 'List multisig transactions',
      },
      {
        name: 'List Transfers',
        value: 'listTransfers',
        description: 'Get incoming or outgoing transfers',
        action: 'List transfers',
      },
    ],
    default: 'list',
  },
  ...list.description,
  ...listMultisig.description,
  ...listTransfers.description,
  ...get.description,
  ...create.description,
  ...confirm.description,
  ...estimateGas.description,
  ...deleteOp.description,
];
