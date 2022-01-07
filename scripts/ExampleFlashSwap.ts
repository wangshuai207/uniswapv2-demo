import chai, { expect } from 'chai'
import { ethers } from "hardhat";
import { Contract } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { solidity, MockProvider, createFixtureLoader, deployContract } from 'ethereum-waffle'
import UniswapV2Router02 from '../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'
import ExampleFlashSwap from '../artifacts/contracts/examples/ExampleFlashSwap.sol/ExampleFlashSwap.json'

const overrides = {
    gasLimit: 9999999,
    gasPrice: 0
  }
  async function main() {

    const [deployer] = await ethers.getSigners();
    const factory1Address="0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
    const factory2Address="0x3Aa5ebB10DC797CAC828524e59A333d0A371443c"
    const wethAddress="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
    const router2Address="0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
    const FlashSwap = await ethers.getContractFactory("ExampleFlashSwap");
    const flashSwap=await FlashSwap.deploy(deployer.getAddress(),)
    await flashSwap.deployed();
    
  
  
    console.log("ExampleFlashSwap deployed to:", flashSwap.address);
    //
  }