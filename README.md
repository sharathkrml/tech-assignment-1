# Technical Interview

# Introduction

Welcome to the Airstack technical interview - The intent of this interview is to learn how you think through technical problems. Therefore, a huge emphasis will be places on your critical thinking and how you approach technical specs.

# Technical Task

This codebase contains two separate packages:

- Hardhat - A hardhat repo with solidity contracts, a test-suite, and deployments
- Subgraph - A subgraph repo with basic project initialized.

The two packages exist within this monorepo to represent the smart-contract and the subgraph of a simple token treasury. Your goals:

- develop treasury smart-contracts
- create smart-contract tests
- deploy contracts

Please find a detailed list of action items below.

# Technical Goals - Smart Contracts

Smart Contracts(Treasury.sol):

- Create a smart contract which allows an arbitrary user to deposit an arbitrary erc20 token
- Maintain a public running balance of the user => token => deposits
- A user w/ a balance should be able to withdraw tokens from their balance
- There should be a deposit event
- There should be a withdraw event
- Deposits and Withdraws should use safeTransfer from SafeERC20

Compile Contracts

```shell
npm run compile
```

Smart Contracts(test/index.ts)

- Test if Deposit updates state, emits and event, and fails if a user is attempting to deposit more tokens than they have.
- Test if Withdraw updates state, emits and event, and fails if a user is attempting to withdraw more than their current balance.

Run Tests

```shell
npm run tests
```

Deploy contracts to a goerli

# Technical Goals - Subgraph

- Should track deposit & withdraw events.
- Design schema is a way that it's easy to query user's active deposits.
- Deploy subgraph on The Graph hosted service.

# Scoring Criteria

- Solidity Understanding
- Web3 Understanding
- Tech-stack Familiarity
- Tech-doc Thinking Process

Please take your time reviewing the code base and discussing your plan of attack. This step in the process is way more important then writing lines of code.
