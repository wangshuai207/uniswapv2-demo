// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Contract } from 'ethers'
import UniswapV2Router02 from '../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'


async function main() {

  const [deployer] = await ethers.getSigners();

  const router02Address="0xdC1037F6d3d148d31F8924ec86e06Bd225362Fe6"
  const router02 = new Contract(router02Address, JSON.stringify(UniswapV2Router02.abi),deployer)
 
  const liquidity = await router02.addLiquidity()
  console.log("UniswapV2Router02 MINIMUM_LIQUIDITY:", liquidity);//1000
 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
