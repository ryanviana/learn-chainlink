"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import bannerImage from "~~/components/assets/flip_the_coin.webp";
import { Checkpoint } from "~~/components/learn-chainlink/Checkpoint";
import { CodeText } from "~~/components/learn-chainlink/CodeText";
import playgroundImage from "~~/public/output-chainlin-playground.png";

const Home: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Flip The Coin Crypto - Chainlink Challenge</title>
      </Head>
      <div className="min-h-screen bg-blue-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300 transition-colors duration-300">
        <div className="container mx-auto p-4">
          <Image
            src={bannerImage}
            alt="Chainlink Challenge Banner"
            layout="responsive"
            className="w-full max-w-2xl mx-auto"
          />
          <h1 className="text-4xl font-bold text-center my-10">Learn Chainlink: Flip The Coin Crypto Challenge</h1>
          <div className="mx-40 space-y-6">
            {/* Introduction */}
            <section id="introduction">
              <h2 className="text-3xl font-semibold">🚀 Introduction</h2>
              <p>
                Welcome to the Flip The Coin Crypto Challenge! In this challenge, you&apos;ll build a game that predicts
                whether the price of Ethereum will go up or down in the next minute using Chainlink.
              </p>
            </section>

            {/* Checkpoint 0: Setting Up Your Environment */}
            <Checkpoint title="Checkpoint 0: 📦 Setting Up Your Environment">
              <h2 className="text-xl font-bold mt-4">Initial Setup</h2>
              <p>Start by installing the necessary tools to work on the Chainlink challenge:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Node.js (version &gt;= 18.17)</li>
                <li>Yarn (version 1 or newer)</li>
                <li>Git</li>
              </ul>

              <h2 className="text-xl font-bold mt-4">Repository Setup</h2>
              <p>Clone the challenge repository and prepare your development environment:</p>
              <CodeText>
                {`git clone https://github.com/scaffold-eth/se-2-challenges.git challenge-0-simple-nft
cd challenge-0-simple-nft
git checkout challenge-0-simple-nft
yarn install
yarn chain`}
              </CodeText>

              <p>Deploy your contracts locally:</p>
              <CodeText>{`yarn deploy`}</CodeText>

              <p>Start the local development server to run the frontend:</p>
              <CodeText>{`yarn start`}</CodeText>

              <p className="mt-4">
                Open{" "}
                <a href="http://localhost:3000" className="text-blue-700 underline">
                  http://localhost:3000
                </a>{" "}
                in your browser to view the application.
              </p>

              <h2 className="text-xl font-bold mt-4">Chainlink Configuration</h2>
              <p>To fully participate in this challenge, ensure your setup on the Sepolia test network:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Request testnet ETH and Link Tokens via the{" "}
                  <a href="https://faucets.chain.link/sepolia" className="text-blue-700 underline">
                    Chainlink faucet service
                  </a>
                  .
                </li>
                <li>
                  Create a Chainlink Functions Subscription following this{" "}
                  <a href="https://functions.chain.link" className="text-blue-700 underline">
                    link
                  </a>
                  .
                </li>
              </ul>

              <p>If you need help:</p>
              <details>
                <summary className="font-semibold cursor-pointer">Detailed Step-by-Step Guide</summary>
                <p>Follow the official documentation for setting up a subscription:</p>
                <a
                  href="https://docs.chain.link/chainlink-functions/resources/subscriptions#create-a-subscription"
                  className="text-blue-700 underline"
                >
                  Chainlink Functions Subscription Guide
                </a>
              </details>

              <blockquote className="border-l-4 border-blue-500 italic mt-6 my-4 pl-4 md:pl-8">
                Setting up your environment correctly is crucial for a smooth experience in building and testing the
                Chainlink integration.
              </blockquote>
            </Checkpoint>

            {/* Checkpoint 1: Testing Chainlink Functions */}
            <Checkpoint title="Checkpoint 1: 🌐 Testing Chainlink Functions 🤖">
              <p>
                Now that you are familiar with your development environment, let&apos;s dive into the exciting world of
                Chainlink Functions!
              </p>
              <p className="mt-4">
                First, visit the{" "}
                <a href="https://functions.chain.link/playground" className="text-blue-700 underline">
                  Chainlink Functions Playground
                </a>
                . This is a powerful tool where you can experiment with various API requests without any coding setup.
              </p>
              <p className="mt-4">
                For our game, <strong>Flip The Coin Crypto</strong>, we&apos;ll check the current price of Ethereum
                (ETH) to decide the outcome of the game. Copy and paste the following request into the playground to
                fetch the ETH price:
              </p>
              <CodeText>
                {`const apiResponse = await Functions.makeHttpRequest({
url: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
});

if (apiResponse.error) {
console.error(apiResponse.error);
throw new Error('Request failed');
}

const data = apiResponse.data;

if (!data || data.USD === undefined) {
console.error('ETH price data is missing from the response');
throw new Error('Invalid response data');
}

const ethPrice = Math.round(data.USD * 10 ** 18);

return Functions.encodeUint256(ethPrice);`}
              </CodeText>

              <p className="mt-4">
                Examine the response you receive. It should include the current price of ETH. Understanding how to
                retrieve and handle this data is crucial for the logic of our game.
              </p>
              <p className="mt-4">
                Once you’re comfortable with the API call, you’re ready to integrate this functionality into our game in
                the upcoming checkpoints.
              </p>
              <blockquote className="border-l-4 border-blue-500 italic mt-6 my-4 pl-4 md:pl-8">
                Make sure to have our output set to <code>uint256</code> at the playground.
              </blockquote>
              <Image
                src={playgroundImage}
                alt="Chainlink Challenge Banner"
                layout="responsive"
                className="w-full max-w-md"
              />
            </Checkpoint>

            {/* Checkpoint 2: Building the Oracle Contract */}
            <Checkpoint title="Checkpoint 2: 🛠 Building the Oracle Contract 🌐">
              <p>
                In this section, you&apos;ll integrate a key function into the oracle contract to handle the API
                response. This capability is central to our Flip The Coin Crypto game, as it processes and utilizes the
                real-time Ethereum price data retrieved by Chainlink.
              </p>
              <p className="mt-4">
                You&apos;ll focus on implementing the <code>fulfill</code> function in the smart contract. This function
                is critical, as Chainlink will automatically call it to pass the data once the API request is completed.
              </p>

              <p className="mt-4">
                <strong>
                  Add the following function to your oracle at <code>packages/hardhat/contracts/ETHOracle.sol</code>:
                </strong>
              </p>
              <CodeText>
                {`function fulfillRequest(
bytes32 requestId,
bytes memory response,
bytes memory err
) internal override {
if (s_lastRequestId != requestId) {
revert UnexpectedRequestID(requestId);
}
s_lastResponse = response;
s_lastError = err;

uint256 ethPrice = abi.decode(response, (uint256));
uint256 timestamp = block.timestamp;
timeToEthValue[timestamp] = ethPrice;

emit Response(requestId, ethPrice, s_lastError);
}`}
              </CodeText>

              <p className="mt-4">
                <strong>
                  Key components of the <code>fulfillRequest</code> function:
                </strong>
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>requestId:</strong> The unique identifier of the data request, ensuring the correct response
                  is processed.
                </li>
                <li>
                  <strong>response:</strong> The raw Ethereum price data returned by the API, stored in{" "}
                  <code>s_lastResponse</code>.
                </li>
                <li>
                  <strong>err:</strong> Any error message returned by the API, stored in <code>s_lastError</code>.
                </li>
              </ul>
              <p className="mt-4">
                This function uses the <code>internal override</code> modifier, specifying that it&apos;s an internal
                version to be called by the contract, and it overrides a base contract function.
              </p>

              <p className="mt-4">
                <strong>Before deploying your contract:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-2">
                You&apos;ll need to copy and paste the eth price request we used in the playground at the{" "}
                <code>packages/hardhat/scripts/ethOracleSource.js</code> file, that is in the folder{" "}
                <code>scripts</code>.
              </ol>
            </Checkpoint>

            {/* Checkpoint 3: Deploy Your Contract */}
            <Checkpoint title="Checkpoint 3: 💾 Deploy your contract! 🛰">
              <p>
                🚀 Ready to launch your smart contract into the public testnet? Follow these steps to deploy to Sepolia.
              </p>
              <p className="mt-4">
                <strong>1. Set the Network:</strong> Update the <code>defaultNetwork</code> in your Hardhat
                configuration to point to Sepolia.
              </p>
              <CodeText>
                {`// hardhat.config.ts
module.exports = {
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {},
    sepolia: {
      url: 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID',
      accounts: ['YOUR_PRIVATE_KEY']
    }
  }
}`}
              </CodeText>
              <p className="mt-4">
                <strong>2. Generate a Deployer Address:</strong> Use Yarn to generate a new deployer address. This
                command creates a unique deployer address and saves the mnemonic locally, avoiding the need to use your
                personal private key.
              </p>
              <CodeText>{"yarn generate"}</CodeText>
              <p className="mt-4">
                <strong>3. Check Your Account:</strong> Confirm the balance of your new deployer account with:
              </p>
              <CodeText>{"yarn account"}</CodeText>
              <p className="mt-4">
                <strong>4. Fund Your Account:</strong> Ensure your deployer address has enough ETH for deployment.
                Obtain ETH from:
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <a href="https://sepoliafaucet.com/" className="text-blue-700 underline">
                      Sepolia Faucet
                    </a>
                  </li>
                  <li>
                    <a href="https://www.infura.io/faucet/sepolia" className="text-blue-700 underline">
                      Infura Sepolia Faucet
                    </a>
                  </li>
                </ul>
              </p>
              <p className="mt-4">
                <strong>5. Deploy Your Contract:</strong> Deploy your NFT smart contract to Sepolia using the following
                command:
              </p>
              <CodeText>{"yarn deploy --network sepolia"}</CodeText>
              <p className="mt-4">
                💬 <strong>Hint:</strong> You can set the <code>defaultNetwork</code> in <code>hardhat.config.ts</code>{" "}
                to sepolia or specify the network directly in the deploy command with{" "}
                <code>yarn deploy --network sepolia</code>.
              </p>
              <blockquote className="border-l-4 border-blue-500 italic my-4 pl-4 md:pl-8">
                Keeping a{" "}
                <a href="https://punkwallet.io" className="text-blue-700 underline">
                  punkwallet.io
                </a>{" "}
                on your phone loaded with testnet ETH can be a handy trick during development. 🧙‍♂️ You&apos;ll look like
                a wizard when you can fund your deployer address from your phone in seconds.
              </blockquote>
            </Checkpoint>

            {/* Checkpoint 4: Ship Your Frontend */}
            <Checkpoint title="Checkpoint 4: 🚢 Ship your frontend! 🚁">
              <p>
                Now that your smart contract is live on the Sepolia testnet, it’s time to prepare and deploy your
                frontend to interact with it.
              </p>

              <p className="mt-4">
                <strong>1. Configure the Frontend:</strong> Start by setting the target network in your Next.js
                configuration to ensure the frontend connects to the right network.
              </p>
              <CodeText>
                {`// packages/nextjs/scaffold.config.ts
module.exports = {
  targetNetwork: 'chains.sepolia'
}`}
              </CodeText>

              <p className="mt-4">
                Ensure the network change reflects correctly in your frontend by visiting{" "}
                <a href="http://localhost:3000" className="text-blue-700 underline">
                  http://localhost:3000
                </a>
                . You should see Sepolia as the active network.
              </p>

              <p className="mt-4">
                <strong>2. Adjust Wallet Settings:</strong> Since we are now operating on a public testnet, you need to
                connect using a wallet you control. Configure the burner wallet settings in your frontend config:
              </p>
              <CodeText>
                {`// packages/nextjs/scaffold.config.ts
module.exports = {
  onlyLocalBurnerWallet: false
}`}
              </CodeText>

              <p className="mt-4">
                This change allows the use of burner wallets on any network, not just the local environment.
              </p>

              <p className="mt-4">
                <strong>3. Optimize Event Loading:</strong> To enhance the loading times for transaction data, update
                the <code>fromBlock</code> to a recent number in the event hooks of your frontend:
              </p>
              <CodeText>
                {`// packages/nextjs/app/transfers/page.tsx
useScaffoldEventHistory({ fromBlock: 3750241n }) // Replace 3750241n with the block number where your contract was deployed`}
              </CodeText>

              <p className="mt-4">
                <strong>4. Deploy on Vercel:</strong> Deploy your frontend to the cloud with Vercel to make it
                accessible online.
              </p>
              <CodeText>{"yarn vercel"}</CodeText>

              <p className="mt-4">
                Follow the prompts to log in and deploy. Use <code>yarn vercel --prod</code> to deploy directly to your
                production URL or omit the <code>--prod</code> flag for a preview URL.
              </p>

              <p className="mt-4">
                <strong>5. Run Tests:</strong> Before finalizing your deployment, ensure your app functions correctly by
                running automated tests.
              </p>
              <CodeText>{"yarn test"}</CodeText>

              <p className="mt-4">
                <strong>6. Secure API Keys:</strong> For production-grade applications, secure your own API keys for
                services like Alchemy and Etherscan to avoid rate limiting:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  ALCHEMY_API_KEY in <code>.env</code> files within the Hardhat and Next.js packages.
                </li>
                <li>
                  ETHERSCAN_API_KEY in the Hardhat package&apos;s <code>.env</code> file.
                </li>
              </ul>

              <blockquote className="border-l-4 border-blue-500 italic my-4 pl-4 md:pl-8">
                💬 <strong>Hint:</strong> It&apos;s recommended to manage environment variables in Vercel&apos;s system
                for live apps, and use <code>.env.local</code> for local testing.
              </blockquote>
            </Checkpoint>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
