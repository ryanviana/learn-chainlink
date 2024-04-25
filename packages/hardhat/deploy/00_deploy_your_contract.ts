import { Contract } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as fs from "fs";
import * as path from "path";

/**
 * Deploys ETHOracle and FlipTheCoinContract using the deployer account.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployMultipleContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const jsSourcePath = path.join(__dirname, "../scripts/ethOracleSource.js");
  const jsSource = fs.readFileSync(jsSourcePath, { encoding: "utf8" });

  const router = "";

  // Deploy ETHOracle
  await deploy("ETHOracle", {
    from: deployer,
    args: [jsSource, router],
    log: true,
    autoMine: true,
  });
  const ethOracle = await hre.ethers.getContract<Contract>("ETHOracle", deployer);
  console.log("ETHOracle deployed to:", ethOracle.address);

  // Deploy FlipTheCoinContract
  await deploy("FlipTheCoin", {
    from: deployer,
    args: [await ethOracle.getAddress()],
    log: true,
    autoMine: true,
  });
  const flipTheCoinContract = await hre.ethers.getContract<Contract>("FlipTheCoin", deployer);
  console.log("FlipTheCoin deployed to:", flipTheCoinContract.address);
};

export default deployMultipleContracts;

deployMultipleContracts.tags = ["ETHOracle", "FlipTheCoin"];
