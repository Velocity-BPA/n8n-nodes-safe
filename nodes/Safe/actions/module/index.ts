/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { safeApiRequest } from '../../transport';

export const listDescription: INodeProperties[] = [
  {
    displayName: 'Safe Address',
    name: 'safeAddress',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['module'],
        operation: ['list'],
      },
    },
    placeholder: '0x...',
    description: 'The address of the Safe multisig wallet',
  },
];

export async function listExecute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const safeAddress = this.getNodeParameter('safeAddress', index) as string;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: `/api/v1/safes/${safeAddress}/`,
  });

  return [{ json: { modules: (response as { modules?: string[] }).modules || [] } }];
}

export const getSafesByModuleDescription: INodeProperties[] = [
  {
    displayName: 'Module Address',
    name: 'moduleAddress',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['module'],
        operation: ['getSafesByModule'],
      },
    },
    placeholder: '0x...',
    description: 'The address of the module',
  },
];

export async function getSafesByModuleExecute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const moduleAddress = this.getNodeParameter('moduleAddress', index) as string;

  const response = await safeApiRequest.call(this, {
    method: 'GET',
    endpoint: `/api/v1/modules/${moduleAddress}/safes/`,
  });

  return [{ json: response }];
}

export const operations = {
  list: { execute: listExecute, description: listDescription },
  getSafesByModule: { execute: getSafesByModuleExecute, description: getSafesByModuleDescription },
};

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['module'],
      },
    },
    options: [
      {
        name: 'Get Safes by Module',
        value: 'getSafesByModule',
        description: 'Get all Safes using a specific module',
        action: 'Get safes by module',
      },
      {
        name: 'List Modules',
        value: 'list',
        description: 'Get enabled modules for a Safe',
        action: 'List modules',
      },
    ],
    default: 'list',
  },
  ...listDescription,
  ...getSafesByModuleDescription,
];
