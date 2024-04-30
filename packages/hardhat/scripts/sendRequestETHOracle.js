// callSendRequest.js

const { ethers } = require("hardhat");

// Replace './DesignFunctions.json' with the path to your contract's ABI
const contractABI = require("../artifacts/contracts/ETHOracle.sol/ETHOracle.json").abi;

// Replace 'your_deployed_contract_address' with your contract's deployed address
const contractAddress = "0xE47CDc74E3D90812dbd4FF073D137f39c08E8aD8";
const timestamp = "1714424788";

// Parameters for sendRequest - adjust these values based on your specific needs
const encryptedSecretsUrls = "0x";
const donHostedSecretsSlotID = 0;
const donHostedSecretsVersion = 0;
const args = [timestamp];
const bytesArgs = [];
const subscriptionId = 2197;
const gasLimit = 300000;
const donID = ethers.encodeBytes32String("fun-ethereum-sepolia-1");

async function callSendRequest() {
  // Ensure you're using the correct network and signer
  const [signer] = await ethers.getSigners();

  // Creating a contract instance with ethers
  const designFunctions = new ethers.Contract(contractAddress, contractABI, signer);

  // Calling the sendRequest function with your parameters
  try {
    const tx = await designFunctions.sendRequest(
      encryptedSecretsUrls,
      donHostedSecretsSlotID,
      donHostedSecretsVersion,
      args,
      bytesArgs,
      subscriptionId,
      gasLimit,
      donID,
    );
    console.log("Send request transaction sent, waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("Transaction confirmed, receipt:", receipt);
  } catch (error) {
    console.error("Failed to send request:", error);
  }
}

callSendRequest().catch(console.error);
