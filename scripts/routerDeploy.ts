// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";


async function main() {

  const [deployer] = await ethers.getSigners();
  const factoryAddress="0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  const wethAddress="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  const Router02 = await ethers.getContractFactory("UniswapV2Router02");
  const router = await Router02.deploy(factoryAddress,wethAddress);

  await router.deployed();

  console.log("UniswapV2Router02 deployed to:", router.address);//0xdC1037F6d3d148d31F8924ec86e06Bd225362Fe6
  //
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
