// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { BigNumber } from '@ethersproject/bignumber'

function expandTo18Decimals(n: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

async function main() {


  // We get the contract to deploy
  const TokenA = await ethers.getContractFactory("ERC20");
  const tokenA = await TokenA.deploy(expandTo18Decimals(10000));
  await tokenA.deployed();
  console.log("TokenA deployed to:", tokenA.address);//0x7925FC27C5928E9c70D515e216E6b53d045c1949

  const TokenB = await ethers.getContractFactory("ERC20");
  const tokenB = await TokenB.deploy(expandTo18Decimals(10000));
  await tokenB.deployed();
  console.log("TokenB deployed to:", tokenB.address);//0xf0b221f97E263BbE5843466ee3b7247eeD9e0DA9

  const WETH = await ethers.getContractFactory("WETH9");
  const weth = await WETH.deploy();
  await weth.deployed();
  console.log("WETH deployed to:", weth.address);//0x24Bcb07f50272f92817F35fB5de7592918aA0C3F


  //WETHPartner
  const ERC20 = await ethers.getContractFactory("ERC20");
  const erc20 = await ERC20.deploy(expandTo18Decimals(10000));
  await erc20.deployed();
  console.log("WETHPartner deployed to:", erc20.address);//0x32BdF855B2727A55A546411eE9bE2340Ad60743a
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
