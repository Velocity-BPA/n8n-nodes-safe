/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  SAFE_NETWORKS,
  getNetworkConfig,
  getNetworkByChainId,
  getApiUrl,
} from '../../nodes/Safe/constants/networks';

describe('Safe Networks', () => {
  describe('SAFE_NETWORKS', () => {
    it('should have ethereum network defined', () => {
      expect(SAFE_NETWORKS.ethereum).toBeDefined();
      expect(SAFE_NETWORKS.ethereum.chainId).toBe(1);
      expect(SAFE_NETWORKS.ethereum.shortName).toBe('eth');
    });

    it('should have polygon network defined', () => {
      expect(SAFE_NETWORKS.polygon).toBeDefined();
      expect(SAFE_NETWORKS.polygon.chainId).toBe(137);
      expect(SAFE_NETWORKS.polygon.shortName).toBe('matic');
    });

    it('should have arbitrum network defined', () => {
      expect(SAFE_NETWORKS.arbitrum).toBeDefined();
      expect(SAFE_NETWORKS.arbitrum.chainId).toBe(42161);
      expect(SAFE_NETWORKS.arbitrum.shortName).toBe('arb1');
    });

    it('should have optimism network defined', () => {
      expect(SAFE_NETWORKS.optimism).toBeDefined();
      expect(SAFE_NETWORKS.optimism.chainId).toBe(10);
      expect(SAFE_NETWORKS.optimism.shortName).toBe('oeth');
    });

    it('should have base network defined', () => {
      expect(SAFE_NETWORKS.base).toBeDefined();
      expect(SAFE_NETWORKS.base.chainId).toBe(8453);
      expect(SAFE_NETWORKS.base.shortName).toBe('base');
    });

    it('should have gnosis network defined', () => {
      expect(SAFE_NETWORKS.gnosis).toBeDefined();
      expect(SAFE_NETWORKS.gnosis.chainId).toBe(100);
      expect(SAFE_NETWORKS.gnosis.shortName).toBe('gno');
    });

    it('should have avalanche network defined', () => {
      expect(SAFE_NETWORKS.avalanche).toBeDefined();
      expect(SAFE_NETWORKS.avalanche.chainId).toBe(43114);
      expect(SAFE_NETWORKS.avalanche.shortName).toBe('avax');
    });

    it('should have bsc network defined', () => {
      expect(SAFE_NETWORKS.bsc).toBeDefined();
      expect(SAFE_NETWORKS.bsc.chainId).toBe(56);
      expect(SAFE_NETWORKS.bsc.shortName).toBe('bnb');
    });

    it('should have sepolia testnet defined', () => {
      expect(SAFE_NETWORKS.sepolia).toBeDefined();
      expect(SAFE_NETWORKS.sepolia.chainId).toBe(11155111);
      expect(SAFE_NETWORKS.sepolia.shortName).toBe('sep');
      expect(SAFE_NETWORKS.sepolia.isTestnet).toBe(true);
    });

    it('should have 9 networks total', () => {
      expect(Object.keys(SAFE_NETWORKS)).toHaveLength(9);
    });
  });

  describe('getNetworkConfig', () => {
    it('should return network config for valid network', () => {
      const config = getNetworkConfig('ethereum');
      expect(config).toBeDefined();
      expect(config?.chainId).toBe(1);
    });

    it('should return undefined for invalid network', () => {
      const config = getNetworkConfig('invalid');
      expect(config).toBeUndefined();
    });
  });

  describe('getNetworkByChainId', () => {
    it('should return network for valid chain ID', () => {
      const network = getNetworkByChainId(1);
      expect(network).toBeDefined();
      expect(network?.id).toBe('ethereum');
    });

    it('should return polygon for chain ID 137', () => {
      const network = getNetworkByChainId(137);
      expect(network).toBeDefined();
      expect(network?.id).toBe('polygon');
    });

    it('should return undefined for invalid chain ID', () => {
      const network = getNetworkByChainId(999999);
      expect(network).toBeUndefined();
    });
  });

  describe('getApiUrl', () => {
    it('should return correct API URL for ethereum', () => {
      const url = getApiUrl('ethereum');
      expect(url).toBe('https://safe-transaction-mainnet.safe.global');
    });

    it('should return correct API URL for polygon', () => {
      const url = getApiUrl('polygon');
      expect(url).toBe('https://safe-transaction-polygon.safe.global');
    });

    it('should return custom URL when provided', () => {
      const customUrl = 'https://custom.safe.api';
      const url = getApiUrl('custom', customUrl);
      expect(url).toBe(customUrl);
    });

    it('should throw error for unknown network without custom URL', () => {
      expect(() => getApiUrl('unknown')).toThrow();
    });
  });
});
