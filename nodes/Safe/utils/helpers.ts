/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { isAddress, getAddress, keccak256, toUtf8Bytes, AbiCoder, concat, zeroPadValue, toBeHex } from 'ethers';
import { SAFE_NETWORKS, OperationType, ZERO_ADDRESS } from '../constants';

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  try {
    return isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Normalize address to checksum format
 */
export function normalizeAddress(address: string): string {
  try {
    return getAddress(address);
  } catch {
    throw new Error(`Invalid Ethereum address: ${address}`);
  }
}

/**
 * Parse EIP-3770 prefixed address (e.g., eth:0x...)
 */
export function parseEip3770Address(address: string): { prefix: string | null; address: string } {
  const parts = address.split(':');
  if (parts.length === 2) {
    return {
      prefix: parts[0],
      address: normalizeAddress(parts[1]),
    };
  }
  return {
    prefix: null,
    address: normalizeAddress(address),
  };
}

/**
 * Format address with EIP-3770 prefix
 */
export function formatEip3770Address(address: string, networkId: string): string {
  const network = SAFE_NETWORKS[networkId];
  if (!network) {
    return normalizeAddress(address);
  }
  return `${network.shortName}:${normalizeAddress(address)}`;
}

/**
 * Calculate Safe transaction hash (EIP-712)
 */
export function calculateSafeTxHash(
  safeAddress: string,
  to: string,
  value: string,
  data: string,
  operation: OperationType,
  safeTxGas: string,
  baseGas: string,
  gasPrice: string,
  gasToken: string,
  refundReceiver: string,
  nonce: number,
  chainId: number,
): string {
  const SAFE_TX_TYPEHASH = keccak256(
    toUtf8Bytes(
      'SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)',
    ),
  );

  const abiCoder = AbiCoder.defaultAbiCoder();

  const dataHash = keccak256(data || '0x');

  const encodedData = abiCoder.encode(
    [
      'bytes32',
      'address',
      'uint256',
      'bytes32',
      'uint8',
      'uint256',
      'uint256',
      'uint256',
      'address',
      'address',
      'uint256',
    ],
    [
      SAFE_TX_TYPEHASH,
      to,
      value,
      dataHash,
      operation,
      safeTxGas,
      baseGas,
      gasPrice,
      gasToken,
      refundReceiver,
      nonce,
    ],
  );

  const safeTxHash = keccak256(encodedData);

  // Calculate domain separator
  const DOMAIN_SEPARATOR_TYPEHASH = keccak256(
    toUtf8Bytes('EIP712Domain(uint256 chainId,address verifyingContract)'),
  );

  const domainSeparator = keccak256(
    abiCoder.encode(
      ['bytes32', 'uint256', 'address'],
      [DOMAIN_SEPARATOR_TYPEHASH, chainId, safeAddress],
    ),
  );

  // Final hash
  return keccak256(
    concat([
      '0x1901',
      domainSeparator,
      safeTxHash,
    ]),
  );
}

/**
 * Encode signature for Safe transaction
 */
export function encodeSignature(
  signature: string,
  signatureType: 'eth_sign' | 'eip712' = 'eip712',
): string {
  let sig = signature;

  // Remove 0x prefix if present
  if (sig.startsWith('0x')) {
    sig = sig.slice(2);
  }

  // Extract r, s, v components
  const r = sig.slice(0, 64);
  const s = sig.slice(64, 128);
  let v = parseInt(sig.slice(128, 130), 16);

  // Adjust v for eth_sign
  if (signatureType === 'eth_sign') {
    v += 4;
  }

  return `0x${r}${s}${v.toString(16).padStart(2, '0')}`;
}

/**
 * Sort signatures by owner address (required for Safe)
 */
export function sortSignatures(
  signatures: Array<{ owner: string; signature: string }>,
): string {
  const sorted = [...signatures].sort((a, b) =>
    a.owner.toLowerCase().localeCompare(b.owner.toLowerCase()),
  );

  return sorted.map((s) => s.signature.replace('0x', '')).join('');
}

/**
 * Validate transaction value (must be valid wei amount)
 */
export function validateValue(value: string): boolean {
  try {
    const numValue = BigInt(value);
    return numValue >= 0n;
  } catch {
    return false;
  }
}

/**
 * Format wei to ETH string
 */
export function formatWeiToEth(wei: string, decimals = 18): string {
  const value = BigInt(wei);
  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const remainder = value % divisor;
  const decimalStr = remainder.toString().padStart(decimals, '0');
  return `${integerPart}.${decimalStr}`;
}

/**
 * Parse ETH to wei string
 */
export function parseEthToWei(eth: string, decimals = 18): string {
  const parts = eth.split('.');
  const integerPart = parts[0] || '0';
  const decimalPart = (parts[1] || '').padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integerPart + decimalPart).toString();
}

/**
 * Check if data is empty/null
 */
export function isEmptyData(data: string | null | undefined): boolean {
  return !data || data === '0x' || data === '0x00';
}

/**
 * Validate Safe nonce
 */
export function validateNonce(nonce: number): boolean {
  return Number.isInteger(nonce) && nonce >= 0;
}

/**
 * Generate unique operation ID
 */
export function generateOperationId(): string {
  return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if address is zero address
 */
export function isZeroAddress(address: string): boolean {
  try {
    return normalizeAddress(address) === ZERO_ADDRESS;
  } catch {
    return false;
  }
}

/**
 * Build transaction data for common operations
 */
export function buildTransferData(to: string, amount: string): string {
  const abiCoder = AbiCoder.defaultAbiCoder();
  const transferSelector = keccak256(toUtf8Bytes('transfer(address,uint256)')).slice(0, 10);
  const params = abiCoder.encode(['address', 'uint256'], [to, amount]);
  return transferSelector + params.slice(2);
}

/**
 * Build approve data for ERC20
 */
export function buildApproveData(spender: string, amount: string): string {
  const abiCoder = AbiCoder.defaultAbiCoder();
  const approveSelector = keccak256(toUtf8Bytes('approve(address,uint256)')).slice(0, 10);
  const params = abiCoder.encode(['address', 'uint256'], [spender, amount]);
  return approveSelector + params.slice(2);
}
