# n8n-nodes-safe

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Safe (formerly Gnosis Safe), the leading multi-signature smart wallet platform securing over $100B in digital assets. This node enables workflow automation for Safe multisig operations including transaction proposals, signature collection, execution, and comprehensive Safe management.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x+-green)

## Features

- **10 Resource Categories** - Complete coverage of Safe Transaction Service API
- **50+ Operations** - Comprehensive functionality for all Safe operations
- **Multi-Network Support** - Ethereum, Polygon, Arbitrum, Optimism, Base, Gnosis, Avalanche, BSC, Sepolia
- **EIP-712 Support** - Typed data signing and Safe transaction hash computation
- **EIP-3770 Support** - Chain-prefixed addresses (eth:0x..., matic:0x...)
- **ERC-4337 Support** - Account abstraction operations
- **Webhook Triggers** - Real-time event notifications for Safe activities
- **TypeScript** - Full type safety with comprehensive interfaces

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-safe`
5. Click **Install**

### Manual Installation

```bash
# Navigate to n8n custom nodes directory
cd ~/.n8n/custom

# Clone or extract the package
npm install n8n-nodes-safe

# Restart n8n
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-safe.zip
cd n8n-nodes-safe

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
# For Linux/macOS:
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-safe

# For Windows (run as Administrator):
# mklink /D %USERPROFILE%\.n8n\custom\n8n-nodes-safe %CD%

# 5. Restart n8n
n8n start
```

## Credentials Setup

### Safe API Credentials

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| API Key | String | No* | JWT API key from Safe API Dashboard |
| Network | Options | Yes | Target network for API calls |
| Custom API URL | String | No | For self-hosted Transaction Service |

*API Key is optional for read-only operations but required for write operations.

### Supported Networks

| Network | Chain ID | Short Name |
|---------|----------|------------|
| Ethereum Mainnet | 1 | eth |
| Polygon | 137 | matic |
| Arbitrum One | 42161 | arb1 |
| Optimism | 10 | oeth |
| Base | 8453 | base |
| Gnosis Chain | 100 | gno |
| Avalanche C-Chain | 43114 | avax |
| BNB Smart Chain | 56 | bnb |
| Sepolia (Testnet) | 11155111 | sep |

## Resources & Operations

### Safe Account

| Operation | Description |
|-----------|-------------|
| Get Info | Retrieve Safe configuration (address, nonce, threshold, owners, modules, version) |
| Get Balances | Get all token balances for a Safe |
| Get Collectibles | Get NFT holdings for a Safe |
| Get Delegates | List authorized delegates |
| Add Delegate | Authorize a new delegate |
| Remove Delegate | Revoke delegate access |

### Transaction

| Operation | Description |
|-----------|-------------|
| List All | Get complete transaction history |
| List Multisig | Get pending and executed multisig transactions |
| List Transfers | Get incoming/outgoing token transfers |
| Get | Get specific transaction by Safe transaction hash |
| Create | Propose a new multisig transaction |
| Confirm | Add an owner signature to a pending transaction |
| Estimate Gas | Get gas estimation for a transaction |
| Delete | Remove a queued transaction |

### Signature

| Operation | Description |
|-----------|-------------|
| List | Get all confirmations for a transaction |
| Add | Submit an owner signature |

### Message

| Operation | Description |
|-----------|-------------|
| List | Get all off-chain signed messages |
| Get | Get specific message by hash |
| Create | Propose a new message for signing |
| Sign | Add signature to a message |

### Contract

| Operation | Description |
|-----------|-------------|
| Get Info | Get contract information and ABI |
| Decode | Decode transaction calldata |

### Module

| Operation | Description |
|-----------|-------------|
| List | Get enabled modules for a Safe |
| Get Safes by Module | Find all Safes using a specific module |

### Owner

| Operation | Description |
|-----------|-------------|
| List Safes | Get all Safes owned by an address |

### Safe Operation (ERC-4337)

| Operation | Description |
|-----------|-------------|
| List | Get all Safe operations |
| Get | Get specific operation by hash |
| Confirm | Sign a Safe operation |

### Token

| Operation | Description |
|-----------|-------------|
| List | Get supported token registry |
| Get | Get specific token information |

### Chain

| Operation | Description |
|-----------|-------------|
| List | Get all supported networks |
| Get | Get specific network details |

## Trigger Node

The Safe Trigger node provides webhook-based event notifications:

| Event | Description |
|-------|-------------|
| All Events | Trigger on any Safe event |
| Pending Transaction | New transaction proposed |
| New Confirmation | Signature added to transaction |
| Executed Transaction | Transaction successfully executed |
| Incoming ETH | Native token received |
| Outgoing ETH | Native token sent |
| Incoming Token | ERC20 token received |
| Outgoing Token | ERC20 token sent |
| Module Transaction | Transaction executed by module |
| Message Confirmation | Message signature added |
| Safe Created | New Safe deployed |

## Usage Examples

### Automated Payroll with Multi-Sig Approval

```javascript
// 1. Create transaction proposal
{
  "resource": "transaction",
  "operation": "create",
  "safeAddress": "0xYourSafeAddress",
  "to": "0xEmployeeAddress",
  "value": "1000000000000000000", // 1 ETH in wei
  "contractTransactionHash": "0x...",
  "sender": "0xProposerAddress",
  "signature": "0x..."
}

// 2. Collect signatures from owners
{
  "resource": "signature",
  "operation": "add",
  "safeTxHash": "0x...",
  "signature": "0x..."
}

// 3. Monitor for threshold reached via trigger
// 4. Execute when ready
```

### Treasury Management Workflow

```javascript
// Monitor Safe balances
{
  "resource": "safeAccount",
  "operation": "getBalances",
  "safeAddress": "0xTreasurySafeAddress",
  "options": {
    "excludeSpam": true,
    "trusted": true
  }
}

// Trigger alerts when balance below threshold
// Automatically propose rebalancing transactions
```

### DAO Proposal Execution

```javascript
// List pending proposals
{
  "resource": "transaction",
  "operation": "listMultisig",
  "safeAddress": "0xDAOSafeAddress",
  "options": {
    "executed": false,
    "trusted": true
  }
}

// Check confirmation status
{
  "resource": "signature",
  "operation": "list",
  "safeTxHash": "0x..."
}
```

### Cross-Chain Safe Management

```javascript
// Get Safe info across networks
// Network selection in credentials determines which chain to query

// Ethereum Safe
{ "resource": "safeAccount", "operation": "getInfo", "safeAddress": "0x..." }

// Polygon Safe (change credentials)
{ "resource": "safeAccount", "operation": "getInfo", "safeAddress": "0x..." }
```

## Safe Concepts

### Safe (Multi-Sig Wallet)
A smart contract wallet that requires multiple signatures to execute transactions. Provides enhanced security through distributed control.

### Owner
An address authorized to sign transactions. Safes can have multiple owners with configurable threshold requirements.

### Threshold
The minimum number of owner signatures required to execute a transaction. A 3-of-5 Safe requires 3 owners to approve.

### Nonce
A sequential counter ensuring transactions are executed in order. Prevents replay attacks and maintains transaction ordering.

### Safe Transaction Hash
A unique EIP-712 typed data hash identifying a specific transaction proposal. Used for signing and confirmation.

### Module
An extension contract that can execute transactions on behalf of the Safe without owner signatures. Useful for automation.

### Guard
A contract that validates transactions before and after execution. Can enforce spending limits or other restrictions.

### Delegate
An address authorized to propose transactions but not execute them. Useful for trusted third parties.

### Confirmation
An owner's signature on a pending transaction. Transactions execute when confirmations meet the threshold.

## Error Handling

The node provides detailed error messages for common issues:

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid Safe address | Malformed Ethereum address | Check address format (0x + 40 hex chars) |
| Transaction not found | Invalid safeTxHash | Verify the transaction hash |
| Not enough confirmations | Threshold not met | Collect more owner signatures |
| Nonce already used | Transaction ordering issue | Use next available nonce |
| Invalid signature | Wrong signer or format | Verify signing key and signature encoding |

## Security Best Practices

1. **API Key Security** - Store API keys securely using n8n credentials
2. **Signature Verification** - Always verify signatures before processing
3. **Nonce Management** - Track nonces carefully to prevent transaction failures
4. **Address Validation** - Validate all addresses before submitting transactions
5. **Test on Testnet** - Use Sepolia for development and testing
6. **Rate Limiting** - Implement appropriate delays between API calls

## Development

### Available Commands

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode (watch)
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Project Structure

```
n8n-nodes-safe/
├── credentials/
│   └── SafeApi.credentials.ts
├── nodes/
│   └── Safe/
│       ├── Safe.node.ts
│       ├── SafeTrigger.node.ts
│       ├── safe.svg
│       ├── actions/
│       │   ├── safeAccount/
│       │   ├── transaction/
│       │   ├── signature/
│       │   ├── message/
│       │   ├── contract/
│       │   ├── module/
│       │   ├── owner/
│       │   ├── safeOperation/
│       │   ├── token/
│       │   └── chain/
│       ├── transport/
│       ├── constants/
│       ├── types/
│       └── utils/
├── test/
│   ├── unit/
│   └── integration/
├── scripts/
└── [config files]
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code:
- Passes all tests (`npm test`)
- Follows the existing code style (`npm run lint`)
- Includes appropriate documentation
- Has proper TypeScript types

## Support

- **Documentation**: [Safe Developer Docs](https://docs.safe.global)
- **Safe Transaction Service API**: [API Documentation](https://safe-transaction-mainnet.safe.global/api/docs/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-safe/issues)
- **Email**: licensing@velobpa.com

## Acknowledgments

- [Safe{Wallet}](https://safe.global) - The leading multi-signature wallet platform
- [n8n](https://n8n.io) - Workflow automation platform
- [Gnosis](https://gnosis.io) - Original creators of Gnosis Safe
