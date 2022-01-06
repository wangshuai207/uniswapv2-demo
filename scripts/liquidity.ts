// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Contract } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import UniswapV2Router02 from '../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'
import ERC20 from '../artifacts/contracts/ERC20.sol/ERC20.json'
import { BigNumber } from '@ethersproject/bignumber'


async function main() {

  const [deployer] = await ethers.getSigners();
  const router02Address="0x68B1D87F95878fE05B998F19b66F4baba5De1aed"
  // const tokenA = new Contract("0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82", JSON.stringify(ERC20.abi),deployer)
  // await tokenA.approve(router02Address,BigNumber.from(10000000000))
  // const tokenB = new Contract("0x9A676e781A523b5d0C0e43731313A708CB607508", JSON.stringify(ERC20.abi),deployer)
  // await tokenB.approve(router02Address,BigNumber.from(10000000000))

  const router02 = new Contract(router02Address, JSON.stringify(UniswapV2Router02.abi),deployer)
  console.log("deployer:", deployer.getAddress());
  const result = await router02.addLiquidity("0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82","0x9A676e781A523b5d0C0e43731313A708CB607508",BigNumber.from(10000),BigNumber.from(10000),0,0,deployer.getAddress(),MaxUint256)
  console.log("result:", result);
 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
