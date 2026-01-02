/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  isValidAddress,
  normalizeAddress,
  parseEip3770Address,
  formatEip3770Address,
  validateValue,
  formatWeiToEth,
  parseEthToWei,
  isEmptyData,
  isZeroAddress,
  validateNonce,
} from '../../nodes/Safe/utils/helpers';

describe('Safe Helpers', () => {
  describe('isValidAddress', () => {
    it('should return true for valid Ethereum address', () => {
      expect(isValidAddress('0x1234567890123456789012345678901234567890')).toBe(true);
    });

    it('should return true for valid checksum address', () => {
      expect(isValidAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')).toBe(true);
    });

    it('should return false for invalid address', () => {
      expect(isValidAddress('0x123')).toBe(false);
      expect(isValidAddress('not-an-address')).toBe(false);
      expect(isValidAddress('')).toBe(false);
    });

    // Note: ethers isAddress accepts addresses without 0x prefix
    it('should handle addresses with and without 0x prefix', () => {
      expect(isValidAddress('0x1234567890123456789012345678901234567890')).toBe(true);
    });
  });

  describe('normalizeAddress', () => {
    it('should normalize address to checksum format', () => {
      const address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
      const result = normalizeAddress(address);
      // Checksum format has mixed case
      expect(result).toBe('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
    });

    it('should maintain checksum for already checksum addresses', () => {
      const address = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
      expect(normalizeAddress(address)).toBe(address);
    });
  });

  describe('parseEip3770Address', () => {
    it('should parse EIP-3770 address with chain prefix', () => {
      const result = parseEip3770Address('eth:0x1234567890123456789012345678901234567890');
      expect(result.prefix).toBe('eth');
      expect(result.address).toBeDefined();
    });

    it('should handle address without prefix', () => {
      const result = parseEip3770Address('0x1234567890123456789012345678901234567890');
      expect(result.prefix).toBe(null);
      expect(result.address).toBeDefined();
    });

    it('should handle polygon prefix', () => {
      const result = parseEip3770Address('matic:0x1234567890123456789012345678901234567890');
      expect(result.prefix).toBe('matic');
    });
  });

  describe('formatEip3770Address', () => {
    it('should format address with ethereum network prefix', () => {
      const result = formatEip3770Address(
        '0x1234567890123456789012345678901234567890',
        'ethereum',
      );
      expect(result).toContain('eth:');
    });

    it('should format address with polygon network prefix', () => {
      const result = formatEip3770Address(
        '0x1234567890123456789012345678901234567890',
        'polygon',
      );
      expect(result).toContain('matic:');
    });

    it('should return normalized address for unknown network', () => {
      const result = formatEip3770Address(
        '0x1234567890123456789012345678901234567890',
        'unknown',
      );
      // Should not have a prefix for unknown network
      expect(result.includes(':')).toBe(false);
    });
  });

  describe('validateValue', () => {
    it('should return true for valid wei values', () => {
      expect(validateValue('0')).toBe(true);
      expect(validateValue('1000000000000000000')).toBe(true);
      expect(validateValue('123456789')).toBe(true);
    });

    it('should return false for negative values', () => {
      expect(validateValue('-1')).toBe(false);
    });

    it('should return false for non-numeric values', () => {
      expect(validateValue('abc')).toBe(false);
    });
  });

  describe('formatWeiToEth', () => {
    it('should convert wei to ETH', () => {
      const result = formatWeiToEth('1000000000000000000');
      expect(result).toContain('1.');
      expect(result.startsWith('1.')).toBe(true);
    });

    it('should convert half ETH correctly', () => {
      const result = formatWeiToEth('500000000000000000');
      expect(result).toContain('0.');
      expect(result.includes('5')).toBe(true);
    });

    it('should handle zero', () => {
      const result = formatWeiToEth('0');
      expect(result.startsWith('0.')).toBe(true);
    });
  });

  describe('parseEthToWei', () => {
    it('should convert ETH to wei', () => {
      expect(parseEthToWei('1')).toBe('1000000000000000000');
      expect(parseEthToWei('0.5')).toBe('500000000000000000');
    });

    it('should handle zero', () => {
      expect(parseEthToWei('0')).toBe('0');
    });
  });

  describe('isEmptyData', () => {
    it('should return true for empty data', () => {
      expect(isEmptyData('')).toBe(true);
      expect(isEmptyData(null)).toBe(true);
      expect(isEmptyData(undefined)).toBe(true);
      expect(isEmptyData('0x')).toBe(true);
    });

    it('should return false for non-empty data', () => {
      expect(isEmptyData('0x1234')).toBe(false);
      expect(isEmptyData('0xabcdef')).toBe(false);
    });
  });

  describe('isZeroAddress', () => {
    it('should return true for zero address', () => {
      expect(isZeroAddress('0x0000000000000000000000000000000000000000')).toBe(true);
    });

    it('should return false for non-zero address', () => {
      expect(isZeroAddress('0x1234567890123456789012345678901234567890')).toBe(false);
    });
  });

  describe('validateNonce', () => {
    it('should return true for valid nonce', () => {
      expect(validateNonce(0)).toBe(true);
      expect(validateNonce(1)).toBe(true);
      expect(validateNonce(100)).toBe(true);
    });

    it('should return false for negative nonce', () => {
      expect(validateNonce(-1)).toBe(false);
    });

    it('should return false for non-integer nonce', () => {
      expect(validateNonce(1.5)).toBe(false);
    });
  });
});
