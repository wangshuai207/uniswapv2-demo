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
  const tokenAddressA="0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf";
  const tokenAddressB="0x9d4454B023096f34B160D6B654540c56A1F81688";
  const tokenA = new Contract(tokenAddressA, JSON.stringify(ERC20.abi),deployer)
  const tokenB = new Contract(tokenAddressB, JSON.stringify(ERC20.abi),deployer)

  const approveMount=BigNumber.from(10000).mul(BigNumber.from(10).pow(18))
  const samountA=BigNumber.from(100).mul(BigNumber.from(10).pow(18))
  const uamountA=BigNumber.from(200).mul(BigNumber.from(10).pow(18))
  const amountB=BigNumber.from(1000).mul(BigNumber.from(10).pow(18))

  const srouter02Address="0x1291Be112d480055DaFd8a610b7d1e203891C274"
  await tokenA.approve(srouter02Address,approveMount)
  await tokenB.approve(srouter02Address,approveMount)
  const srouter02 = new Contract(srouter02Address, JSON.stringify(UniswapV2Router02.abi),deployer)
  console.log("deployer:", deployer.getAddress());
  const sresult = await srouter02.addLiquidity(tokenAddressA,tokenAddressB,samountA,amountB,0,0,deployer.getAddress(),MaxUint256)
  console.log("result:", sresult);

  const urouter02Address="0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154"
  await tokenA.approve(urouter02Address,approveMount)
  await tokenB.approve(urouter02Address,approveMount)
  const urouter02 = new Contract(urouter02Address, JSON.stringify(UniswapV2Router02.abi),deployer)
  console.log("deployer:", deployer.getAddress());
  const uresult = await urouter02.addLiquidity(tokenAddressA,tokenAddressB,uamountA,amountB,0,0,deployer.getAddress(),MaxUint256)
  console.log("result:", uresult);
 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
