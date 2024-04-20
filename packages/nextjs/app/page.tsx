"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import bannerImage from "~~/components/assets/flip_the_coin.webp";
import { Checkpoint } from "~~/components/learn-chainlink/Checkpoint";
import { CodeText } from "~~/components/learn-chainlink/CodeText";

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Flip The Coin Crypto - Chainlink Challenge</title>
      </Head>
      <div>
        <div className="min-h-screen bg-blue-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300 transition-colors duration-300">
          <div className="container mx-auto p-4">
            <Image
              src={bannerImage}
              alt="Chainlink Challenge Banner"
              layout="responsive"
              className="w-full max-w-2xl mx-auto" // Adjust max width to max-w-2xl
            />
            <h1 className="text-4xl font-bold text-center my-10">Learn Chainlink: Flip The Coin Crypto Challenge</h1>
            <div className="mx-40 space-y-6">
              <section id="introduction">
                <h2 className="text-3xl font-semibold">🚀 Introduction</h2>
                <p>
                  Welcome to the Flip The Coin Crypto Challenge! In this challenge, you&apos;ll build a game that
                  predicts whether the price of Ethereum will go up or down in the next minute using Chainlink.
                </p>
              </section>
              {/* Checkpoint 0 */}
              <Checkpoint title="Checkpoint 0: 📦 Environment 📚">
                <p>Before you begin, you need to install the following tools:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Node (&gt;= v18.17)</li>
                  <li>Yarn (v1 or v2+)</li>
                  <li>Git</li>
                </ul>
                <p className="mt-4">
                  Then download the challenge to your computer and install dependencies by running:
                </p>
                <CodeText>
                  <p>
                    git clone https://github.com/scaffold-eth/se-2-challenges.git challenge-0-simple-nft cd
                    challenge-0-simple-nft git checkout challenge-0-simple-nft yarn install yarn chain
                  </p>
                </CodeText>
                <p className="mt-4">In a second terminal window, 🛰 deploy your contract (locally):</p>
                <CodeText>
                  <p>cd challenge-0-simple-nft yarn deploy</p>
                </CodeText>
                <p className="mt-4">In a third terminal window, start your 📱 frontend:</p>
                <CodeText>
                  <p>cd challenge-0-simple-nft yarn start</p>
                </CodeText>
                <p className="mt-4">
                  📱 Open{" "}
                  <a href="http://localhost:3000" className="text-blue-700 underline">
                    http://localhost:3000
                  </a>{" "}
                  to see the app.
                </p>
              </Checkpoint>
              {/* Checkpoint 1 */}
              <Checkpoint title="Checkpoint 1: Chainlink Function Request">
                <CodeText>
                  <p>Use chainlink functions playground to write your request.</p>
                </CodeText>
              </Checkpoint>
              {/* Checkpoint 2 */}
              <Checkpoint title="Checkpoint 2: Chainlink Functions Contract">
                <CodeText>
                  <p>Write your oracle.</p>
                </CodeText>
              </Checkpoint>

              {/* Checkpoint 3 */}
              <Checkpoint title="Checkpoint 3: Deploy Oracle">
                <CodeText>
                  <p>Deploy your oracle to listen to your Chainlink function requests.</p>
                </CodeText>
              </Checkpoint>

              {/* Checkpoint 4 */}
              <Checkpoint title="Checkpoint 4: 🚢 Ship your frontend! 🚁">
                <p>
                  ✏️ Edit your frontend config in <code>packages/nextjs/scaffold.config.ts</code> to change the
                  targetNetwork to <code>chains.sepolia</code>:
                </p>

                <CodeText>
                  <p>chall-0-scaffold-config</p>
                </CodeText>
                <p className="mt-4">🚀 Deploy your NextJS App</p>
                <CodeText>
                  <p>yarn vercel</p>
                </CodeText>
                <p className="mt-4">
                  Follow the steps to deploy to Vercel. Once you log in (email, GitHub, etc.), the default options
                  should work. It&apos;ll give you a public URL.
                </p>
                <p className="mt-4">⚠️ Run the automated testing function to make sure your app passes:</p>
                <CodeText>
                  <p>yarn test</p>
                </CodeText>
              </Checkpoint>

              {/* Checkpoint 5 */}
              <Checkpoint title="Checkpoint 5: Final Testing and Submission">
                <CodeText>
                  <p>Perform final testing of your application and submit it.</p>
                </CodeText>
              </Checkpoint>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
