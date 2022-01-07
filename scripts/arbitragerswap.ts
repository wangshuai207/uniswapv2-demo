// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Contract } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import UniswapV2Router02 from '../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'
import UniswapV2Pair from '../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Pair.json'
import ERC20 from '../artifacts/contracts/ERC20.sol/ERC20.json'
import { BigNumber } from '@ethersproject/bignumber'

const overrides = {
  gasLimit: 9999999
}

async function main() {

  const [deployer] = await ethers.getSigners();
  const tokenAddressA="0xd6e1afe5cA8D00A2EFC01B89997abE2De47fdfAf";
  const tokenAddressB="0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f";
  const abiCoder=new ethers.utils.AbiCoder()
  const sArbitrager="0xFD6F7A6a5c21A3f503EBaE7a473639974379c351"
  const pairAddress="0x4df52fC6e76DcC39ba14ab8c9d71B3A7f88fFb48"
  const approveMount=BigNumber.from(1000).mul(BigNumber.from(10).pow(18))
  const tokenA = new Contract(tokenAddressA, JSON.stringify(ERC20.abi),deployer)
  await tokenA.approve(pairAddress,approveMount)
  await tokenA.approve(sArbitrager,approveMount)
  const tokenB = new Contract(tokenAddressB, JSON.stringify(ERC20.abi),deployer)
  await tokenB.approve(pairAddress,approveMount)
  await tokenB.approve(sArbitrager,approveMount)

  const sPair = new Contract(pairAddress, JSON.stringify(UniswapV2Pair.abi),deployer)
  console.log("deployer:", deployer.getAddress());
  const token0=await sPair.token0();
  console.log("token0:", token0);
  const swapMount=BigNumber.from(10).mul(BigNumber.from(10).pow(18))
  const dMount=BigNumber.from(50).mul(BigNumber.from(10).pow(18))
  const tx =await sPair.swap(
    swapMount,
    0,
    sArbitrager,
    abiCoder.encode([ "uint","uint" ], [ dMount,MaxUint256]),
    overrides
    )
  console.log(`Transaction hash: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log("receipt:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
