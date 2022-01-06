// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Contract } from 'ethers'
import UniswapV2Pair from '../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Pair.json'


async function main() {

  const [deployer] = await ethers.getSigners();

  // initialize V2
  const pairAddress="0x1B7f8CE71a9c84D2Ce5E61aA9442B2508d79cb77"
  const pair = new Contract(pairAddress, JSON.stringify(UniswapV2Pair.abi),deployer)
 
  const liquidity = await pair.MINIMUM_LIQUIDITY()
  console.log("UniswapV2Pair MINIMUM_LIQUIDITY:", liquidity);//1000
 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
