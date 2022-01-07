import chai, { expect } from 'chai'
import { ethers } from "hardhat";
import { Contract } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import UniswapV2Router02 from '../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'
import FlashLoanArbitrage from '../artifacts/contracts/FlashLoanArbitrage.sol/FlashLoanArbitrage.json'

const overrides = {
    gasLimit: 9999999,
    gasPrice: 0
}
  async function main() {

    const [deployer] = await ethers.getSigners();
    const sfactory="0x809d550fca64d94Bd9F66E60752A544199cfAC3D"
    const ufactory="0x4c5859f0F772848b2D91F1D83E2Fe57935348029"

    const srouter="0x1291Be112d480055DaFd8a610b7d1e203891C274"
    const urouter="0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154"


    const sFlashLoan = await ethers.getContractFactory("FlashLoanArbitrage");
    const sflashLoan=await sFlashLoan.deploy(sfactory,urouter,MaxUint256)
    await sflashLoan.deployed();
    console.log("sFlashLoanArbitrage deployed to:", sflashLoan.address);


    const uFlashLoan = await ethers.getContractFactory("FlashLoanArbitrage");
    const uflashLoan=await uFlashLoan.deploy(ufactory,srouter,MaxUint256)
    await uflashLoan.deployed();
    console.log("uFlashLoanArbitrage deployed to:", uflashLoan.address);
  }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
