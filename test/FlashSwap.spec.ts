import { expect } from "chai";
import { BigNumber, constants as ethconst, Wallet } from "ethers";
import { ethers, waffle } from "hardhat";

import {
  expandTo18Decimals,
  encodePrice,
  setNextBlockTime,
} from "../tools/utils";
import { UniswapV2Factory, UniswapV2Pair, ERC20, WETH9, Arbitrager } from "../typechain-types";
import { MockProvider } from "@ethereum-waffle/provider";

describe("FlashSwap", () => {
    const loadFixture = waffle.createFixtureLoader(
      waffle.provider.getWallets(),
      waffle.provider
    );
    async function fixture([wallet, other]: Wallet[], provider: MockProvider) {
        const factory = (await (
          await ethers.getContractFactory("UniswapV2Factory")
        ).deploy(wallet.address)) as UniswapV2Factory;
    
        const tokenA = (await (
          await ethers.getContractFactory("ERC20")
        ).deploy(expandTo18Decimals(10000))) as ERC20;
        const tokenB = (await (
          await ethers.getContractFactory("ERC20")
        ).deploy(expandTo18Decimals(10000))) as ERC20;
    
        await factory.createPair(tokenA.address, tokenB.address);
        const pair = (await ethers.getContractFactory("UniswapV2Pair")).attach(
          await factory.getPair(tokenA.address, tokenB.address)
        ) as UniswapV2Pair;
        const token0Address = await pair.token0();
        const token0 = tokenA.address === token0Address ? tokenA : tokenB;
        const token1 = tokenA.address === token0Address ? tokenB : tokenA;
        return { pair, token0, token1, wallet, other, factory, provider };
      }
})
