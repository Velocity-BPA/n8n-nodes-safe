/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Transaction type identifiers used by Safe Transaction Service
 */
export enum TransactionType {
  MULTISIG_TRANSACTION = 'MULTISIG_TRANSACTION',
  MODULE_TRANSACTION = 'MODULE_TRANSACTION',
  ETHEREUM_TRANSACTION = 'ETHEREUM_TRANSACTION',
  INCOMING_TRANSFER = 'INCOMING_TRANSFER',
  OUTGOING_TRANSFER = 'OUTGOING_TRANSFER',
}

/**
 * Operation types for Safe transactions
 * CALL = 0: Regular call
 * DELEGATE_CALL = 1: Delegate call (executes code in context of Safe)
 */
export enum OperationType {
  CALL = 0,
  DELEGATE_CALL = 1,
}

/**
 * Transfer types for token transfers
 */
export enum TransferType {
  ETHER_TRANSFER = 'ETHER_TRANSFER',
  ERC20_TRANSFER = 'ERC20_TRANSFER',
  ERC721_TRANSFER = 'ERC721_TRANSFER',
}

/**
 * Transaction status values
 */
export enum TransactionStatus {
  AWAITING_CONFIRMATIONS = 'AWAITING_CONFIRMATIONS',
  AWAITING_EXECUTION = 'AWAITING_EXECUTION',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

/**
 * Confirmation status for multisig transactions
 */
export enum ConfirmationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  EXECUTED = 'EXECUTED',
}

/**
 * Safe module types
 */
export enum ModuleType {
  ALLOWANCE_MODULE = 'ALLOWANCE_MODULE',
  RECOVERY_MODULE = 'RECOVERY_MODULE',
  GUARD_MODULE = 'GUARD_MODULE',
  CUSTOM = 'CUSTOM',
}

/**
 * Transaction type options for n8n dropdowns
 */
export const TRANSACTION_TYPE_OPTIONS = [
  { name: 'Multisig Transaction', value: TransactionType.MULTISIG_TRANSACTION },
  { name: 'Module Transaction', value: TransactionType.MODULE_TRANSACTION },
  { name: 'Ethereum Transaction', value: TransactionType.ETHEREUM_TRANSACTION },
  { name: 'Incoming Transfer', value: TransactionType.INCOMING_TRANSFER },
  { name: 'Outgoing Transfer', value: TransactionType.OUTGOING_TRANSFER },
];

/**
 * Operation type options for n8n dropdowns
 */
export const OPERATION_TYPE_OPTIONS = [
  { name: 'Call', value: OperationType.CALL },
  { name: 'Delegate Call', value: OperationType.DELEGATE_CALL },
];

/**
 * Transfer type options for n8n dropdowns
 */
export const TRANSFER_TYPE_OPTIONS = [
  { name: 'ETH Transfer', value: TransferType.ETHER_TRANSFER },
  { name: 'ERC-20 Token', value: TransferType.ERC20_TRANSFER },
  { name: 'NFT (ERC-721)', value: TransferType.ERC721_TRANSFER },
];

/**
 * Default gas values for Safe transactions
 */
export const DEFAULT_GAS_VALUES = {
  safeTxGas: '0',
  baseGas: '0',
  gasPrice: '0',
  gasToken: '0x0000000000000000000000000000000000000000',
  refundReceiver: '0x0000000000000000000000000000000000000000',
};

/**
 * EIP-712 domain separator for Safe transactions
 */
export const SAFE_TX_TYPEHASH =
  '0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8';

/**
 * Zero address constant
 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
