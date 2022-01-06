// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Contract } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import UniswapV2Router02 from '../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'


async function main() {

  const [deployer] = await ethers.getSigners();

  const router02Address="0xdC1037F6d3d148d31F8924ec86e06Bd225362Fe6"
  const router02 = new Contract(router02Address, JSON.stringify(UniswapV2Router02.abi),deployer)
 
  const [amountA,amountB,liquidity] = await router02.addLiquidity("0x5FbDB2315678afecb367f032d93F642f64180aa3","0xf0b221f97E263BbE5843466ee3b7247eeD9e0DA9",10000000,100000000,0,0,deployer.getAddress(),MaxUint256)
  
  console.log("amountA:", amountA);
  console.log("amountB:", amountB);
  console.log("liquidity:", liquidity);
 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
