# Voting System Frontend

This repository contains the frontend interface for the **Decentralized Voting System** built on the Aptos blockchain. This application allows users to create, participate in, and view voting polls. The voting system ensures transparency, immutability, and fairness by utilizing blockchain technology. The frontend is built using **React**, **TypeScript**, and **Tailwind CSS** for responsive design, with **Ant Design** providing a sleek user interface.

## Features

- **Create Polls**: Users can create a poll with a title, description, and up to four options.
- **Vote in Polls**: Participants can vote on their preferred option using their connected wallets.
- **View Poll Results**: Results of the polls, including the total votes for each option, can be viewed in real time.
- **View Polls by Creator**: Polls created by a specific user can be retrieved and displayed.
- **Close Polls**: Poll creators have the ability to close a poll when the voting period is over.

## Prerequisites

Ensure the following dependencies are installed:

- **Node.js** (v14.x or later)
- **npm** or **yarn** for package management
- **Aptos-compatible wallet** (e.g., Petra Wallet) for blockchain interaction

## Wallet Setup

Ensure your wallet is connected to the **Aptos Devnet** for testing:

1. Install **Petra Wallet** or any other Aptos-compatible wallet.
2. Set your wallet to the **Devnet** network.
3. Use the **Aptos Faucet** to fund your wallet with test APT tokens.

## Getting Started

### 1. Install Dependencies

Run the following command to install the required packages:

```bash
npm install
```

### 2. Configure the Environment

Create a `.env` file and configure the network and module address for the Aptos blockchain:

```bash
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS="0x<your_module_address_here>"
```

### 3. Run the Application

Start the local development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5174` to access the application.

## Interacting with the App

1. **Connect Wallet**: On the homepage, click "Connect Wallet" to connect your Aptos-compatible wallet.
2. **Create Polls**: Go to the "Create Poll" section, fill out the poll form with the question and four options, and submit it to create a new poll.
3. **Vote in Polls**: Browse the available polls and cast your vote by selecting an option and confirming the transaction.
4. **View Poll Results**: Results of the poll can be viewed while the poll is open and after it closes.
5. **View Your Created Polls**: Check polls created by your address and view the results.
6. **Close a Poll**: As a poll creator, you can close a poll when voting is complete.

## Tech Stack

- **React**: UI library for building the user interface.
- **TypeScript**: Provides type safety and code reliability.
- **Ant Design**: Component library for building intuitive, polished UIs.
- **Tailwind CSS**: Utility-first CSS framework for responsive and modern design.
- **Aptos SDK**: SDK for interacting with the Aptos blockchain.
- **Petra Wallet**: Aptos-compatible wallet for blockchain interactions.

## Key Smart Contract Functions

The backend smart contract manages the polls and voting mechanism. The following are key functions used by the frontend:

1. **create_poll(account: &signer, title: string::String, description: string::String, options: vector<string::String>)**  
   This function creates a new poll on the blockchain with the specified question and options.

2. **vote(poll_id: u64, option_index: u64)**  
   Allows users to vote on a specific poll by selecting one of the options.

3. **view_poll_results(poll_id: u64)**  
   Retrieves the results for a specific poll, including the total votes for each option.

4. **view_votes_by_creator(creator: address)**  
   Fetches all polls created by a specific user, displaying their title, description, and current voting status.

5. **close_poll(account: &signer, poll_id: u64)**  
   Allows the poll creator to close the poll after the voting period is over.

## Testing the Platform

- Use the **Aptos Faucet** to fund your wallet with test tokens.
- Ensure sufficient test tokens for covering gas fees when interacting with the blockchain (e.g., creating polls, voting).
- You can test various actions like poll creation, voting, and viewing results.

## Additional Features

- **Responsive Design**: The platform is fully responsive, ensuring compatibility across mobile, tablet, and desktop devices.
- **Blockchain Security**: All voting transactions and poll data are secured on the Aptos blockchain.
- **Intuitive UI**: **Ant Design** and **Tailwind CSS** provide a user-friendly experience for all functionalities, including form validation and seamless wallet integration.

## Conclusion

This Voting System is designed to bring transparency and security to voting processes using the power of blockchain. Whether for individual users or communities, it allows participants to vote confidently, knowing the process is fair and secure.
