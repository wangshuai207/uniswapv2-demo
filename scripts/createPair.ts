// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Wallet, Contract } from 'ethers'
import UniswapV2Factory from '../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json'
import IUniswapV2Pair from '../artifacts/contracts/UniswapV2Factory.sol/IUniswapV2Pair.json' 


async function main() {

  const [deployer] = await ethers.getSigners();

  // initialize V1
  // const factory1Address="0x77D5cCc214002719e1c34E3222cB57F646110F74"
  // const factoryV1 = new Contract(factory1Address, JSON.stringify(UniswapV2Factory.abi),deployer)
  // const codeHash1=await factoryV1.INIT_CODE_PAIR_HASH()
  // console.log("UniswapV1Factory codeHash is:", codeHash1);
  // await factoryV1.createPair("0x5FbDB2315678afecb367f032d93F642f64180aa3", "0xf0b221f97E263BbE5843466ee3b7247eeD9e0DA9")
  // await factoryV1.deployed();
  // const pairAddress = await factoryV1.getPair("0x5FbDB2315678afecb367f032d93F642f64180aa3", "0xf0b221f97E263BbE5843466ee3b7247eeD9e0DA9")
  // console.log("UniswapV1Factory address to:", factoryV1.address);//0x77D5cCc214002719e1c34E3222cB57F646110F74
  // console.log("UniswapV1Pair address to:", pairAddress);//0xf5C4970f8A0C1C481A5748f3EEB549F152560354

  // initialize V2
  const factory2Address="0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"//0x16E5D64F651CEd42a753c64CfA5D1277Bb9c41C1
  const factoryV2 = new Contract(factory2Address, JSON.stringify(UniswapV2Factory.abi),deployer)
  // const codeHash=await factoryV2.INIT_CODE_PAIR_HASH()
  // console.log("UniswapV2Factory codeHash is:", codeHash);
  //await factoryV2.createPair("0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82", "0x9A676e781A523b5d0C0e43731313A708CB607508")
  const pairAddress2 = await factoryV2.getPair("0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82", "0x9A676e781A523b5d0C0e43731313A708CB607508")
  console.log("UniswapV2Pair address to:", pairAddress2);//0x34d51C86bd9B986D871136F2Ac0c1330d95ca349
 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
