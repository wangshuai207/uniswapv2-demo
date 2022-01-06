// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";


async function main() {

  const [deployer] = await ethers.getSigners();
  const factoryAddress="0x16E5D64F651CEd42a753c64CfA5D1277Bb9c41C1"
  const wethAddress="0x1Aa34786b3E492793a8E96Bf0aa18e365d65Dde9"
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
