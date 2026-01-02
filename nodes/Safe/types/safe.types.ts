/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { OperationType, TransactionType, TransferType } from '../constants';

/**
 * Safe wallet information
 */
export interface SafeInfo {
  address: string;
  nonce: number;
  threshold: number;
  owners: string[];
  masterCopy: string;
  modules: string[];
  fallbackHandler: string;
  guard: string;
  version: string;
}

/**
 * Safe creation information
 */
export interface SafeCreationInfo {
  created: string;
  creator: string;
  transactionHash: string;
  factoryAddress: string;
  masterCopy: string;
  setupData: string;
  dataDecoded: DataDecoded | null;
}

/**
 * Token balance information
 */
export interface TokenBalance {
  tokenAddress: string | null;
  token: TokenInfo | null;
  balance: string;
  ethValue: string;
  timestamp: string;
  fiatBalance: string;
  fiatConversion: string;
  fiatCode: string;
}

/**
 * Token information
 */
export interface TokenInfo {
  type: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoUri: string;
}

/**
 * NFT/Collectible information
 */
export interface Collectible {
  address: string;
  tokenName: string;
  tokenSymbol: string;
  logoUri: string;
  id: string;
  uri: string;
  name: string;
  description: string;
  imageUri: string;
  metadata: Record<string, unknown>;
}

/**
 * Delegate information
 */
export interface Delegate {
  safe: string;
  delegate: string;
  delegator: string;
  label: string;
}

/**
 * Owner information
 */
export interface Owner {
  address: string;
  safes: string[];
}

/**
 * Confirmation/signature on a transaction
 */
export interface Confirmation {
  owner: string;
  submissionDate: string;
  transactionHash: string | null;
  signature: string;
  signatureType: string;
}

/**
 * Base transaction interface
 */
export interface BaseTransaction {
  safe: string;
  to: string;
  value: string;
  data: string | null;
  operation: OperationType;
  gasToken: string;
  safeTxGas: number;
  baseGas: number;
  gasPrice: string;
  refundReceiver: string;
  nonce: number;
  executionDate: string | null;
  submissionDate: string;
  modified: string;
  blockNumber: number | null;
  transactionHash: string | null;
  safeTxHash: string;
  executor: string | null;
  isExecuted: boolean;
  isSuccessful: boolean | null;
  ethGasPrice: string | null;
  maxFeePerGas: string | null;
  maxPriorityFeePerGas: string | null;
  gasUsed: number | null;
  fee: string | null;
  origin: string | null;
  dataDecoded: DataDecoded | null;
  confirmationsRequired: number;
  confirmations: Confirmation[];
  trusted: boolean;
  signatures: string | null;
}

/**
 * Multisig transaction
 */
export interface MultisigTransaction extends BaseTransaction {
  txType: TransactionType.MULTISIG_TRANSACTION;
}

/**
 * Module transaction
 */
export interface ModuleTransaction {
  safe: string;
  to: string;
  value: string;
  data: string | null;
  operation: OperationType;
  dataDecoded: DataDecoded | null;
  module: string;
  created: string;
  blockNumber: number;
  transactionHash: string;
  isSuccessful: boolean;
}

/**
 * Transfer information
 */
export interface Transfer {
  type: TransferType;
  executionDate: string;
  blockNumber: number;
  transactionHash: string;
  to: string;
  from: string;
  value: string | null;
  tokenId: string | null;
  tokenAddress: string | null;
  tokenInfo: TokenInfo | null;
}

/**
 * Decoded data from transaction
 */
export interface DataDecoded {
  method: string;
  parameters: DecodedParameter[];
}

/**
 * Decoded parameter
 */
export interface DecodedParameter {
  name: string;
  type: string;
  value: string | string[] | DataDecoded;
  valueDecoded?: DataDecoded | DataDecoded[];
}

/**
 * All transactions response
 */
export interface AllTransactionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TransactionListItem[];
}

/**
 * Transaction list item (unified type)
 */
export interface TransactionListItem {
  txType: TransactionType;
  transaction: MultisigTransaction | ModuleTransaction | Transfer;
  conflictType?: string;
}

/**
 * Message to be signed
 */
export interface SafeMessage {
  messageHash: string;
  status: string;
  logoUri: string | null;
  name: string | null;
  message: string | Record<string, unknown>;
  proposedBy: string;
  safeAppId: number | null;
  created: string;
  modified: string;
  confirmationsRequired: number;
  confirmationsSubmitted: number;
  confirmations: MessageConfirmation[];
  preparedSignature: string | null;
}

/**
 * Message confirmation
 */
export interface MessageConfirmation {
  owner: string;
  signature: string;
  signatureType: string;
  created: string;
  modified: string;
}

/**
 * Contract information
 */
export interface ContractInfo {
  address: string;
  name: string;
  displayName: string;
  logoUri: string | null;
  contractAbi: ContractAbi | null;
  trustedForDelegateCall: boolean;
}

/**
 * Contract ABI
 */
export interface ContractAbi {
  abi: AbiItem[];
  description: string;
  relevance: number;
}

/**
 * ABI item
 */
export interface AbiItem {
  type: string;
  name?: string;
  inputs?: AbiInput[];
  outputs?: AbiOutput[];
  stateMutability?: string;
  anonymous?: boolean;
}

/**
 * ABI input
 */
export interface AbiInput {
  name: string;
  type: string;
  indexed?: boolean;
  components?: AbiInput[];
}

/**
 * ABI output
 */
export interface AbiOutput {
  name: string;
  type: string;
  components?: AbiOutput[];
}

/**
 * Safe module information
 */
export interface SafeModule {
  address: string;
  name: string | null;
  logoUri: string | null;
}

/**
 * Safe operation (ERC-4337)
 */
export interface SafeOperation {
  userOperationHash: string;
  safe: string;
  moduleAddress: string;
  safeOperation: {
    safe: string;
    nonce: string;
    initCode: string;
    callData: string;
    callGasLimit: string;
    verificationGasLimit: string;
    preVerificationGas: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    paymasterAndData: string;
    validAfter: string;
    validUntil: string;
    entryPoint: string;
    signature: string;
  };
  confirmations: SafeOperationConfirmation[];
  confirmationsRequired: number;
  confirmationsSubmitted: number;
  preparedSignature: string | null;
}

/**
 * Safe operation confirmation
 */
export interface SafeOperationConfirmation {
  owner: string;
  signature: string;
  signatureType: string;
  created: string;
  modified: string;
}

/**
 * Chain information
 */
export interface ChainInfo {
  chainId: string;
  chainName: string;
  shortName: string;
  l2: boolean;
  description: string;
  rpcUri: {
    authentication: string;
    value: string;
  };
  safeAppsRpcUri: {
    authentication: string;
    value: string;
  };
  publicRpcUri: {
    authentication: string;
    value: string;
  };
  blockExplorerUriTemplate: {
    address: string;
    txHash: string;
    api: string;
  };
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
    logoUri: string;
  };
  transactionService: string;
  theme: {
    textColor: string;
    backgroundColor: string;
  };
  gasPrice: GasPriceConfig[];
  ensRegistryAddress: string | null;
  disabledWallets: string[];
  features: string[];
  balancesProvider: {
    chainName: string;
    enabled: boolean;
  };
  contractAddresses: {
    safeMasterCopyAddress: string;
    safeProxyFactoryAddress: string;
    multiSendAddress: string;
    multiSendCallOnlyAddress: string;
    fallbackHandlerAddress: string;
    signMessageLibAddress: string;
    createCallAddress: string;
    simulateTxAccessorAddress: string;
    safeWebAuthnSignerFactoryAddress: string;
  };
}

/**
 * Gas price configuration
 */
export interface GasPriceConfig {
  type: string;
  uri?: string;
  gasParameter?: string;
  gweiFactor?: string;
  fixedWeiValue?: string;
}

/**
 * Gas estimation response
 */
export interface GasEstimation {
  safeTxGas: string;
  baseGas: string;
  dataGas: string;
  operationalGas: string;
  gasPrice: string;
  lastUsedNonce: number | null;
  gasToken: string;
  refundReceiver: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Create multisig transaction request
 */
export interface CreateMultisigTransactionRequest {
  to: string;
  value: string;
  data?: string;
  operation?: OperationType;
  safeTxGas?: string;
  baseGas?: string;
  gasPrice?: string;
  gasToken?: string;
  refundReceiver?: string;
  nonce?: number;
  contractTransactionHash: string;
  sender: string;
  signature: string;
  origin?: string;
}

/**
 * Confirm transaction request
 */
export interface ConfirmTransactionRequest {
  signature: string;
}

/**
 * Add delegate request
 */
export interface AddDelegateRequest {
  safe?: string;
  delegate: string;
  delegator: string;
  signature: string;
  label: string;
}

/**
 * Create message request
 */
export interface CreateMessageRequest {
  message: string | Record<string, unknown>;
  safeAppId?: number;
  signature: string;
}

/**
 * API error response
 */
export interface ApiError {
  code: number;
  message: string;
  arguments?: string[];
}

/**
 * Webhook event types
 */
export type WebhookEventType =
  | 'NEW_CONFIRMATION'
  | 'PENDING_MULTISIG_TRANSACTION'
  | 'EXECUTED_MULTISIG_TRANSACTION'
  | 'INCOMING_ETHER'
  | 'INCOMING_TOKEN'
  | 'OUTGOING_ETHER'
  | 'OUTGOING_TOKEN'
  | 'MODULE_TRANSACTION'
  | 'CONFIRMATION_REQUEST'
  | 'SAFE_CREATED'
  | 'MESSAGE_CREATED'
  | 'MESSAGE_CONFIRMATION';

/**
 * Webhook payload
 */
export interface WebhookPayload {
  address: string;
  type: WebhookEventType;
  chainId: string;
  safeTxHash?: string;
  txHash?: string;
  messageHash?: string;
  owner?: string;
  value?: string;
  tokenAddress?: string;
  module?: string;
}
