import { expandTo18Decimals } from './utils'
import { ethers } from "hardhat";
import { Contract, Wallet } from 'ethers';
//import { solidity, MockProvider, createFixtureLoader, deployContract } from 'ethereum-waffle'
import { UniswapV2Factory } from "../typechain-types/UniswapV2Factory";
import { ERC20 } from "../typechain-types/ERC20"; 
import { UniswapV2Router02 } from "../typechain-types/UniswapV2Router02";
import { UniswapV2Pair } from "../typechain-types/UniswapV2Pair";
import UniswapV2PairAbi from '../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Pair.json'

const overrides = {
    gasLimit: 9999999
  }
  
//   interface V2Fixture {
//     token0: Contract
//     token1: Contract
//     WETH: Contract
//     sfactory: Contract
//     ufactory: Contract
//     srouter: Contract
//     urouter: Contract
//     router: Contract
//     pair: Contract
//   }

  interface V2Fixture {
    token0: ERC20
    token1: ERC20
    sFactory: UniswapV2Factory
    uFactory: UniswapV2Factory
    sRouter: UniswapV2Router02
    uRouter: UniswapV2Router02
    sPair: UniswapV2Pair
    uPair: UniswapV2Pair
  }

  export async function v2Fixture(): Promise<V2Fixture> {

    const [deployer] = await ethers.getSigners();
    // deploy tokens
    const TokenA = await ethers.getContractFactory("ERC20");
    const tokenA = (await TokenA.deploy(expandTo18Decimals(10000))) as ERC20;
    await tokenA.deployed();
    console.log("TokenA deployed to:", tokenA.address);
  
    const TokenB = await ethers.getContractFactory("ERC20");
    const tokenB = (await TokenB.deploy(expandTo18Decimals(10000))) as ERC20;
    await tokenB.deployed();
    console.log("TokenB deployed to:", tokenB.address);

    const WETH = await ethers.getContractFactory("WETH9");
    const weth = await WETH.deploy();
    await weth.deployed();
    console.log("WETH deployed to:", weth.address);

    // deploy factorys & create Pair for  sushiswap & uniswap
    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    const sFactory = (await Factory.deploy(deployer.getAddress())) as UniswapV2Factory;
    await sFactory.deployed();
    console.log("sfactory deployed to:", sFactory.address);
    const codeHash=await sFactory.INIT_CODE_PAIR_HASH()
    console.log("INIT_CODE_PAIR_HASH:", codeHash);
    const sTx=await sFactory.createPair(tokenA.address,tokenB.address)
    await sTx.wait()

    const uFactory = (await Factory.deploy(deployer.getAddress())) as UniswapV2Factory;
    await uFactory.deployed();
    console.log("ufactory deployed to:", uFactory.address);
    const uTx=await uFactory.createPair(tokenA.address,tokenB.address)
    await uTx.wait()

    // deploy routers for  sushiswap & uniswap
    const Router02 = await ethers.getContractFactory("UniswapV2Router02");
    const sRouter = (await Router02.deploy(sFactory.address,weth.address))as UniswapV2Router02;
    await sRouter.deployed();
    console.log("srouter deployed to:", sRouter.address);
    const uRouter = (await Router02.deploy(uFactory.address,weth.address)) as UniswapV2Router02;
    await uRouter.deployed();
    console.log("urouter deployed to:", uRouter.address);

    // getPair for  sushiswap & uniswap
    const sPairAddress = await sFactory.getPair(tokenA.address, tokenB.address)
    const sPair = (new Contract(sPairAddress, JSON.stringify(UniswapV2PairAbi.abi),deployer)) as UniswapV2Pair
    const token0Address = await sPair.token0()
    console.log("token0 is : ",token0Address)
    const token0 = tokenA.address === token0Address ? tokenA : tokenB
    const token1 = tokenA.address === token0Address ? tokenB : tokenA

    const uPairAddress = await uFactory.getPair(tokenA.address, tokenB.address)
    const uPair = (new Contract(uPairAddress, JSON.stringify(UniswapV2PairAbi.abi),deployer)) as UniswapV2Pair

    return {token0,token1,sFactory,uFactory,sRouter,uRouter,sPair,uPair}

  }