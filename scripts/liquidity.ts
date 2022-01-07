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
  const tokenAddressA="0xd6e1afe5cA8D00A2EFC01B89997abE2De47fdfAf";
  const tokenAddressB="0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f";
  const tokenA = new Contract(tokenAddressA, JSON.stringify(ERC20.abi),deployer)
  const tokenB = new Contract(tokenAddressB, JSON.stringify(ERC20.abi),deployer)

  const approveMount=BigNumber.from(10000).mul(BigNumber.from(10).pow(18))
  const amount1=BigNumber.from(100).mul(BigNumber.from(10).pow(18))
  const amount2=BigNumber.from(1000).mul(BigNumber.from(10).pow(18))

  const srouter02Address="0xD42912755319665397FF090fBB63B1a31aE87Cee"
  await tokenA.approve(srouter02Address,approveMount)
  await tokenB.approve(srouter02Address,approveMount)
  const srouter02 = new Contract(srouter02Address, JSON.stringify(UniswapV2Router02.abi),deployer)
  console.log("deployer:", deployer.getAddress());
  const sresult = await srouter02.addLiquidity(tokenAddressA,tokenAddressB,amount1,amount2,0,0,deployer.getAddress(),MaxUint256)
  console.log("result:", sresult);

  const urouter02Address="0xfcDB4564c18A9134002b9771816092C9693622e3"
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
