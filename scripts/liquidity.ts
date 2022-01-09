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
  const tokenAddressA="0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5";
  const tokenAddressB="0xfbC22278A96299D91d41C453234d97b4F5Eb9B2d";
  const tokenA = new Contract(tokenAddressA, JSON.stringify(ERC20.abi),deployer)
  const tokenB = new Contract(tokenAddressB, JSON.stringify(ERC20.abi),deployer)

  const approveMount=BigNumber.from(10000).mul(BigNumber.from(10).pow(18))
  const amount1=BigNumber.from(100).mul(BigNumber.from(10).pow(18))
  const amount2=BigNumber.from(1000).mul(BigNumber.from(10).pow(18))

  const srouter02Address="0x7A9Ec1d04904907De0ED7b6839CcdD59c3716AC9"
  await tokenA.approve(srouter02Address,approveMount)
  await tokenB.approve(srouter02Address,approveMount)
  const srouter02 = new Contract(srouter02Address, JSON.stringify(UniswapV2Router02.abi),deployer)
  console.log("deployer:", deployer.getAddress());
  const sresult = await srouter02.addLiquidity(tokenAddressA,tokenAddressB,amount1,amount2,0,0,deployer.getAddress(),MaxUint256)
  console.log("result:", sresult);

  const urouter02Address="0x49fd2BE640DB2910c2fAb69bB8531Ab6E76127ff"
  await tokenA.approve(urouter02Address,approveMount)
  await tokenB.approve(urouter02Address,approveMount)
  const urouter02 = new Contract(urouter02Address, JSON.stringify(UniswapV2Router02.abi),deployer)
  console.log("deployer:", deployer.getAddress());
  const uresult = await urouter02.addLiquidity(tokenAddressA,tokenAddressB,amount2,amount1,0,0,deployer.getAddress(),MaxUint256)
  console.log("result:", uresult);
 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
