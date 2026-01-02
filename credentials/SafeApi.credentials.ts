/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class SafeApi implements ICredentialType {
  name = 'safeApi';
  displayName = 'Safe API';
  documentationUrl = 'https://docs.safe.global/core-api/transaction-service-overview';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: false,
      description:
        'JWT API key from Safe API Dashboard. Required for write operations, optional for read-only access.',
    },
    {
      displayName: 'Network',
      name: 'network',
      type: 'options',
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
        { name: 'Custom', value: 'custom' },
      ],
      default: 'ethereum',
      required: true,
      description: 'The blockchain network where your Safe is deployed',
    },
    {
      displayName: 'Custom API URL',
      name: 'customApiUrl',
      type: 'string',
      default: '',
      required: false,
      displayOptions: {
        show: {
          network: ['custom'],
        },
      },
      placeholder: 'https://your-safe-transaction-service.com',
      description: 'Custom Safe Transaction Service URL for self-hosted instances',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{"Bearer " + $credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.network === "custom" ? $credentials.customApiUrl : {"ethereum": "https://safe-transaction-mainnet.safe.global", "polygon": "https://safe-transaction-polygon.safe.global", "arbitrum": "https://safe-transaction-arbitrum.safe.global", "optimism": "https://safe-transaction-optimism.safe.global", "base": "https://safe-transaction-base.safe.global", "gnosis": "https://safe-transaction-gnosis-chain.safe.global", "avalanche": "https://safe-transaction-avalanche.safe.global", "bsc": "https://safe-transaction-bsc.safe.global", "sepolia": "https://safe-transaction-sepolia.safe.global"}[$credentials.network]}}',
      url: '/api/v1/about/',
    },
  };
}
