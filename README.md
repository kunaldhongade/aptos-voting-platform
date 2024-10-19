# 🚀 Voting System - Frontend

Welcome to the **Decentralized Voting System** frontend, a secure and transparent voting platform powered by the **Aptos Blockchain**. This platform enables users to create polls, participate in voting, and view results with the reliability and immutability of blockchain technology. Developed using **React**, **TypeScript**, and **Ant Design**, the interface offers a modern, responsive experience.

---

## 🔗 Links

- **Live Demo**: [Voting System](https://aptos-voting-platform.vercel.app/)
- **Smart Contract Explorer**: [Aptos Explorer](https://explorer.aptoslabs.com/account/0x635bdbc07d1c2e273d1f2cf27e8c87103928f03a7d4ce1760bd9baa6b784eadc/modules/code/VotingSystem?network=testnet)

---

## ✨ Key Features

- **Create Polls**: Users can create polls by providing a title, description, and up to four options.
- **Vote in Polls**: Participants can securely cast their votes using connected wallets.
- **View Poll Results**: Users can view real-time poll results and track total votes for each option.
- **View Polls by Creator**: Polls created by a user can be viewed and managed through the platform.
- **Close Polls**: Poll creators can close polls after the voting period ends to prevent further voting.

---

## 📋 Prerequisites

Ensure you have the following tools installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn** for package management
- **Aptos Wallet** (e.g., **Petra Wallet**) for blockchain interactions

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
cd voting-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add the following variables:

```bash
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS=0x635bdbc07d1c2e273d1f2cf27e8c87103928f03a7d4ce1760bd9baa6b784eadc
```

### 4. Run the Development Server

Start the local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5174`.

### 5. Deploy the Smart Contract

To deploy the smart contract:

1.  Install **Aptos CLI**.
2.  Update the **Move.toml** file with your wallet address:

    - Add you Wallet Address from Petra here

    ```bash
    vote_addrx = "0xca10b0176c34f9a8315589ff977645e04497814e9753d21f7d7e7c3d83aa7b57"
    ```

3.  Create your new Address for Deployment

    ```bash
    aptos init
    ```

    - Add your Account addr here for Deployment

    ```bash
    my_addrx = "635bdbc07d1c2e273d1f2cf27e8c87103928f03a7d4ce1760bd9baa6b784eadc"
    ```

4.  Compile and publish the contract:

    ```bash
    aptos move compile
    aptos move publish
    ```

---

## 🛠 How to Use the Platform

### 1. Connect Wallet

Connect your **Aptos Wallet** (e.g., **Petra Wallet**) to participate in polls and interact with the blockchain.

### 2. Create a Poll

1. Navigate to **Create Poll**.
2. Provide the poll’s title, description, and up to four options.
3. Submit the form to create the poll on the blockchain.

### 3. Vote in a Poll

1. Browse the available polls in the **Vote in Polls** section.
2. Select your preferred option and confirm the vote through your wallet.

### 4. View Poll Results

View the real-time results for any poll, showing the total votes for each option.

### 5. Manage Your Polls

1. Navigate to **My Polls** to view all polls you have created.
2. Use the **Close Poll** option to close a poll and finalize the results.

---

## 📊 Scripts

- **`npm run dev`**: Start the development server.
- **`npm run build`**: Build the project for production.
- **`npm test`**: Run unit tests.

---

## 🔍 Dependencies

- **React**: Library for building user interfaces.
- **TypeScript**: Enhances code reliability through static typing.
- **Ant Design**: Provides polished UI components for seamless interactions.
- **Tailwind CSS**: Utility-first CSS framework for responsive styling.
- **Aptos SDK**: JavaScript SDK for blockchain interactions.
- **Petra Wallet Adapter**: Connects and interacts with Aptos wallets.

---

## 📚 Key Smart Contract Functions

1. **create_poll(account: &signer, title: String, description: String, options: vector<String>)**  
   Creates a new poll on the blockchain with the provided question and options.

2. **vote(poll_id: u64, option_index: u64)**  
   Casts a vote on the selected option in a poll.

3. **view_poll_results(poll_id: u64)**  
   Fetches the real-time results of a poll, displaying the total votes per option.

4. **view_votes_by_creator(creator: address)**  
   Retrieves all polls created by a specific address.

5. **close_poll(account: &signer, poll_id: u64)**  
   Allows the poll creator to close the poll, finalizing the results.

---

## 🛡 Security and Transparency

- **Smart Contracts**: Secure all voting operations and poll data on-chain.
- **No Central Authority**: The decentralized nature ensures fairness and transparency.
- **Immutable Data**: All votes and results are recorded immutably on the blockchain.

---

## 🌐 Common Issues and Solutions

1. **Wallet Connection Issues**: Ensure your wallet extension is installed and connected.
2. **Transaction Errors**: Verify that your wallet has enough tokens to cover gas fees.
3. **RPC Limits**: Use **private RPC providers** like **Alchemy** or **QuickNode** if encountering public RPC limits.

---

## 🚀 Scaling and Deployment

For deploying on **Vercel** or other platforms:

- Use **third-party RPC providers** to ensure high availability.
- Implement **request throttling** to handle heavy traffic.
- Utilize **WebSockets** for real-time updates.

---

## 🎉 Conclusion

The **Decentralized Voting System** offers a transparent and secure way to conduct polls, ensuring fair participation through blockchain technology. With an intuitive interface and reliable smart contracts, users can confidently create and participate in polls, knowing their votes are secure and immutable.
