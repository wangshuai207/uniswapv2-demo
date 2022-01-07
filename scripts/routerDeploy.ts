// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";


async function main() {

  const [deployer] = await ethers.getSigners();
  const wethAddress="0x6F6f570F45833E249e27022648a26F4076F48f78"
  const sfactoryAddress="0xB0f05d25e41FbC2b52013099ED9616f1206Ae21B"
  const sRouter02 = await ethers.getContractFactory("UniswapV2Router02");
  const srouter = await sRouter02.deploy(sfactoryAddress,wethAddress);

  await srouter.deployed();

  console.log("SushiswapRouter02 deployed to:", srouter.address);

  const ufactoryAddress="0x5FeaeBfB4439F3516c74939A9D04e95AFE82C4ae"
  const uRouter02 = await ethers.getContractFactory("UniswapV2Router02");
  const urouter = await uRouter02.deploy(ufactoryAddress,wethAddress);

  await urouter.deployed();

  console.log("UniswapV2Router02 deployed to:", urouter.address);
  //
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
