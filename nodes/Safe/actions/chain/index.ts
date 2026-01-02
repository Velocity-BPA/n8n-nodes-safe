/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { SAFE_NETWORKS } from '../../constants';

export const listDescription: INodeProperties[] = [];

export async function listExecute(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const chains = Object.values(SAFE_NETWORKS).map((network) => ({
    id: network.id,
    name: network.name,
    chainId: network.chainId,
    shortName: network.shortName,
    apiUrl: network.apiUrl,
    explorerUrl: network.explorerUrl,
    isTestnet: network.isTestnet,
  }));

  return [{ json: { count: chains.length, results: chains } }];
}

export const getDescription: INodeProperties[] = [
  {
    displayName: 'Network',
    name: 'networkId',
    type: 'options',
    required: true,
    options: [
      { name: 'Ethereum Mainnet', value: 'ethereum' },
      { name: 'Polygon', value: 'polygon' },
      { name: 'Arbitrum One', value: 'arbitrum' },
      { name: 'Optimism', value: 'optimism' },
      { name: 'Base', value: 'base' },
      { name: 'Gnosis Chain', value: 'gnosis' },
      { name: 'Avalanche C-Chain', value: 'avalanche' },
      { name: 'BNB Smart Chain', value: 'bsc' },
      { name: 'Sepolia Testnet', value: 'sepolia' },
    ],
    default: 'ethereum',
    displayOptions: {
      show: {
        resource: ['chain'],
        operation: ['get'],
      },
    },
    description: 'The network to get information for',
  },
];

export async function getExecute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const networkId = this.getNodeParameter('networkId', index) as string;
  const network = SAFE_NETWORKS[networkId];

  if (!network) {
    throw new Error(`Unknown network: ${networkId}`);
  }

  return [
    {
      json: {
        id: network.id,
        name: network.name,
        chainId: network.chainId,
        shortName: network.shortName,
        apiUrl: network.apiUrl,
        explorerUrl: network.explorerUrl,
        isTestnet: network.isTestnet,
      },
    },
  ];
}

export const operations = {
  list: { execute: listExecute, description: listDescription },
  get: { execute: getExecute, description: getDescription },
};

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['chain'],
      },
    },
    options: [
      {
        name: 'Get Chain Info',
        value: 'get',
        description: 'Get specific network details',
        action: 'Get chain info',
      },
      {
        name: 'List Supported Chains',
        value: 'list',
        description: 'Get all available networks',
        action: 'List supported chains',
      },
    ],
    default: 'list',
  },
  ...listDescription,
  ...getDescription,
];
