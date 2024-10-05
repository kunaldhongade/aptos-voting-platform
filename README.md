# Public Opinion Poll Frontend

This project is the frontend interface for the **Public Opinion Poll** smart contract built on the Aptos blockchain. It enables users to create, participate in, and view the results of polls in a decentralized manner. The application is developed using **React** and **TypeScript**, utilizing **Ant Design** for the user interface and **Aptos SDK** for blockchain interactions.

## Features

- **Create Polls**: Users can create new polls by specifying the question and options.
- **Vote on Polls**: Participants can cast their votes for options in open polls.
- **View Poll Results**: Users can view the total votes for each option and overall results for the polls.
- **Close Polls**: Poll creators can close polls once the voting period is over.
- **Voter Identification**: Votes are associated with users' DID strings for identity verification.

## Prerequisites

Ensure you have the following installed before running the project:

- **Node.js** (v14.x or later)
- **npm** or **yarn** (for dependency management)
- **Aptos-compatible wallet** (e.g., Petra Wallet) for interacting with the blockchain

## Wallet Setup

Make sure your Aptos-compatible wallet is set to **Devnet** for development purposes:

1. Install **Petra Wallet** or another Aptos-compatible wallet.
2. Switch the wallet network to **Devnet**.
3. Use the **Aptos Faucet** to fund your account with test tokens.

## Getting Started

### 1. Install Dependencies

Run the following command to install all the necessary packages:

```bash
npm install
```

### 2. Configure the Environment

Create a `.env` file and specify your **Aptos Devnet** or **Testnet** endpoint URLs:

```bash
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS="0x5fbab942388be12bc96e623fcc22d7c71bd76bede6a0b828de4c351e7aebcc1e"
```

### 3. Run the Development Server

Launch the application locally using the command:

```bash
npm run dev
```

Once the server starts, open your browser and navigate to `http://localhost:5174`.

## Interacting with the Application

1. **Connect Wallet**: On the landing page, click "Connect Wallet" to connect your **Petra Wallet** (or any Aptos-compatible wallet).
2. **Create a Poll**: Navigate to the "Create Poll" section, fill in the poll details (e.g., question and options), and submit. This will create a poll on the blockchain.
3. **Vote on a Poll**: Participants can vote for their preferred option by providing their DID and selecting an option from the available choices.
4. **View Poll Results**: Users can browse through active polls and view detailed results, including the total votes for each option.
5. **Close a Poll**: Poll creators can close polls once they decide the voting period is over.

## Tech Stack

- **React** (JavaScript library for building user interfaces)
- **TypeScript** (Strongly typed JavaScript)
- **Ant Design** (UI library for elegant and responsive components)
- **Tailwind CSS** (Utility-first CSS framework for responsive design)
- **Aptos SDK** (Aptos blockchain interaction)

## Smart Contract Overview

The **Public Opinion Poll** smart contract manages the creation and voting of polls. Below is a summary of key functions.

### Poll Management

1. **create_poll(account: &signer, question: string::String, options: vector<string::String>)**: Creates a new poll with the specified question and options.
2. **vote(did: string::String, poll_id: u64, option_index: u64)**: Allows users to cast their vote on a specific poll.
3. **close_poll(account: &signer, poll_id: u64)**: Closes the poll and prevents further voting.
4. **get_poll_results(poll_id: u64)**: Retrieves the total votes and individual option votes for a specific poll.
5. **get_poll(poll_id: u64)**: Fetches details about a specific poll, including the question and options.

## Testing the Platform

- Use the **Aptos Faucet** to fund your test accounts on **Devnet**.
- Interactions such as creating polls and voting will trigger blockchain transactions. Ensure you have enough test tokens for gas fees.
- Check your wallet for transaction requests when interacting with the platform.

## Additional Notes

- **Responsive Design**: This platform is fully responsive using **Tailwind CSS**. It supports mobile, tablet, and desktop viewports.
- **Security**: Smart contract interactions, like creating polls and voting, require user signatures via the wallet.
- **Custom UI**: **Ant Design** provides a user-friendly and polished experience with form validation and pre-designed UI components.
