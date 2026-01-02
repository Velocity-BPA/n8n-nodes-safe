/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Safe network configuration interface
 */
export interface SafeNetworkConfig {
  /** Network identifier */
  id: string;
  /** Human-readable network name */
  name: string;
  /** Blockchain chain ID */
  chainId: number;
  /** EIP-3770 short name prefix */
  shortName: string;
  /** Safe Transaction Service API URL */
  apiUrl: string;
  /** Block explorer URL */
  explorerUrl: string;
  /** Whether network is a testnet */
  isTestnet: boolean;
}

/**
 * Safe network configurations for supported chains
 */
export const SAFE_NETWORKS: Record<string, SafeNetworkConfig> = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum Mainnet',
    chainId: 1,
    shortName: 'eth',
    apiUrl: 'https://safe-transaction-mainnet.safe.global',
    explorerUrl: 'https://etherscan.io',
    isTestnet: false,
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    shortName: 'matic',
    apiUrl: 'https://safe-transaction-polygon.safe.global',
    explorerUrl: 'https://polygonscan.com',
    isTestnet: false,
  },
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum One',
    chainId: 42161,
    shortName: 'arb1',
    apiUrl: 'https://safe-transaction-arbitrum.safe.global',
    explorerUrl: 'https://arbiscan.io',
    isTestnet: false,
  },
  optimism: {
    id: 'optimism',
    name: 'Optimism',
    chainId: 10,
    shortName: 'oeth',
    apiUrl: 'https://safe-transaction-optimism.safe.global',
    explorerUrl: 'https://optimistic.etherscan.io',
    isTestnet: false,
  },
  base: {
    id: 'base',
    name: 'Base',
    chainId: 8453,
    shortName: 'base',
    apiUrl: 'https://safe-transaction-base.safe.global',
    explorerUrl: 'https://basescan.org',
    isTestnet: false,
  },
  gnosis: {
    id: 'gnosis',
    name: 'Gnosis Chain',
    chainId: 100,
    shortName: 'gno',
    apiUrl: 'https://safe-transaction-gnosis-chain.safe.global',
    explorerUrl: 'https://gnosisscan.io',
    isTestnet: false,
  },
  avalanche: {
    id: 'avalanche',
    name: 'Avalanche C-Chain',
    chainId: 43114,
    shortName: 'avax',
    apiUrl: 'https://safe-transaction-avalanche.safe.global',
    explorerUrl: 'https://snowtrace.io',
    isTestnet: false,
  },
  bsc: {
    id: 'bsc',
    name: 'BNB Smart Chain',
    chainId: 56,
    shortName: 'bnb',
    apiUrl: 'https://safe-transaction-bsc.safe.global',
    explorerUrl: 'https://bscscan.com',
    isTestnet: false,
  },
  sepolia: {
    id: 'sepolia',
    name: 'Sepolia Testnet',
    chainId: 11155111,
    shortName: 'sep',
    apiUrl: 'https://safe-transaction-sepolia.safe.global',
    explorerUrl: 'https://sepolia.etherscan.io',
    isTestnet: true,
  },
};

/**
 * Network options for n8n dropdown selectors
 */
export const NETWORK_OPTIONS = Object.values(SAFE_NETWORKS).map((network) => ({
  name: network.name,
  value: network.id,
}));

/**
 * Get network configuration by ID
 */
export function getNetworkConfig(networkId: string): SafeNetworkConfig | undefined {
  return SAFE_NETWORKS[networkId];
}

/**
 * Get network configuration by chain ID
 */
export function getNetworkByChainId(chainId: number): SafeNetworkConfig | undefined {
  return Object.values(SAFE_NETWORKS).find((network) => network.chainId === chainId);
}

/**
 * Get API URL for a network
 */
export function getApiUrl(networkId: string, customApiUrl?: string): string {
  if (customApiUrl) {
    return customApiUrl.replace(/\/$/, '');
  }
  const network = getNetworkConfig(networkId);
  if (!network) {
    throw new Error(`Unknown network: ${networkId}`);
  }
  return network.apiUrl;
}
