# QB Vote - Decentralized Voting System

QB Vote is a secure and transparent blockchain-based voting system built with Next.js and Ethereum. This project aims to provide a reliable platform for conducting elections with the benefits of blockchain technology.

## Features

- Secure voter registration
- Candidate registration and management
- Transparent voting process
- Real-time results display
- Blockchain-based data integrity
- User-friendly interface

## Technologies Used

- Next.js 13 (App Router)
- React 18
- TypeScript
- Ethereum (Solidity smart contracts)
- Web3.js
- Tailwind CSS
- Shadcn UI components
- IPFS (via Pinata)
- Ethers.js

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Git
- MetaMask browser extension
- An Infura account for IPFS
- A Pinata account for IPFS pinning
- An Etherscan API key

## Setup Instructions

1. Clone the repository:

git clone [https://github.com/mrselva-eth/QB.git](https://github.com/mrselva-eth/QB.git)
cd QB

2. Install dependencies:
npm install


3. Set up environment variables:
Create a `.env.local` file in the root directory and add the following variables:

NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_api_key
NEXT_PUBLIC_VOTER_CONTRACT_ADDRESS=your_voter_contract_address
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key


4. Run the development server:
npm run dev


5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Smart Contracts

The project uses two main smart contracts:

1. VoterRegistration.sol: Handles voter registration and management.
2. CandidateRegistry.sol: Manages candidate registration and voting process.

These contracts are deployed on the Sepolia testnet. Make sure to have some Sepolia ETH in your MetaMask wallet for interacting with the contracts.

## Project Structure

- `app/`: Contains the main pages and routing logic
- `components/`: Reusable React components
- `contexts/`: React context for global state management
- `lib/`: Utility functions and helpers
- `public/`: Static assets
- `styles/`: Global styles and Tailwind CSS configuration
- `types/`: TypeScript type definitions
- `utils/`: Utility functions and configurations

## Deployment

This project is set up to be easily deployed on Vercel. Follow these steps:

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and sign in with your GitHub account.
3. Click on "New Project" and select your repository.
4. In the "Configure Project" step, Vercel should automatically detect that it's a Next.js project.
5. Add your environment variables in the "Environment Variables" section.
6. Click "Deploy".

## Contributing

Contributions to the QB Vote project are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)

## Contact

If you have any questions or feedback, please reach out to [Your Name] at [your.email@example.com].
