# Public Opinion Poll Smart Contract

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Smart Contract Structure](#smart-contract-structure)
- [Usage](#usage)
- [Events](#events)
- [Error Codes](#error-codes)
- [Deployment](#deployment)
- [License](#license)

## Overview

The **Public Opinion Poll** smart contract allows users to create polls, cast votes, and view results in a decentralized manner on the Aptos blockchain. This contract ensures transparency and trust, enabling creators to gather opinions on various topics while maintaining user anonymity through DID strings.

## Features

- Create polls with a specified question and multiple options.
- Vote for options in open polls.
- View poll results, including total votes per option.
- Close polls by the creator once they are no longer needed.
- Emit events for poll creation and voting actions for easy tracking.

## Getting Started

To get started with the Public Opinion Poll smart contract, you will need to have the following prerequisites:

- **Aptos CLI**: Make sure you have the Aptos CLI installed.
- **Aptos Account**: You need an Aptos account to deploy and interact with the contract.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kunaldhongade/Aptos-opinion-poll.git
   cd Aptos-opinion-poll
   cd contract
   ```

2. Install dependencies (if any).

3. Set up your Aptos account by following the instructions provided in the [Aptos documentation](https://aptos.dev/docs).

## Smart Contract Structure

The smart contract is structured as follows:

- **Poll**: Represents a single poll with attributes like `id`, `creator`, `question`, `options`, `votes`, and `total_votes`.
- **PollManager**: Manages the list of polls and tracks the next available poll ID.
- **Event Handles**: Emits events for tracking poll creation and voting actions.

## Usage

### Creating a Poll

To create a new poll, call the `create_poll` function with the following parameters:

- `question`: A string representing the question for the poll.
- `options`: An array of strings representing the available options.

### Voting

To vote on a poll, use the `vote` function with the following parameters:

- `did`: The DID string of the voter.
- `poll_id`: The ID of the poll being voted on.
- `option_index`: The index of the chosen option.

### Viewing Poll Results

Use the `get_poll_results` function to retrieve the votes and total votes for a specific poll:

- `poll_id`: The ID of the poll.

### Closing a Poll

To close a poll, call the `close_poll` function with:

- `poll_id`: The ID of the poll to be closed.

## Events

The smart contract emits the following events:

- **PollCreatedEvent**: Emitted when a new poll is created.
- **VoteEvent**: Emitted when a vote is cast.

## Error Codes

The following error codes are defined in the contract:

- `EPOLL_ALREADY_EXISTS`: Poll manager already exists.
- `EPOLL_NOT_FOUND`: Poll not found.
- `EPOLL_CLOSED`: Poll is closed.
- `EALREADY_VOTED`: Voter has already cast their vote.
- `EINVALID_OPTION`: Invalid voting option selected.
- `ENOT_POLL_CREATOR`: Only the poll creator can close the poll.

## Deployment

To deploy the smart contract on the Aptos blockchain:

1. Use the Aptos CLI to compile the contract.
2. Deploy the contract using the following command:
   ```bash
   aptos move publish --package-dir <path_to_your_package>
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
