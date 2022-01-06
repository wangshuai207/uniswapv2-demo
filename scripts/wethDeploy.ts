// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";


async function main() {

  const WETH = await ethers.getContractFactory("WETH9");
  const weth = await WETH.deploy();

  await weth.deployed();
  console.log("WETH deployed to:", weth.address);//0x1Aa34786b3E492793a8E96Bf0aa18e365d65Dde9
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
