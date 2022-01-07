import { ethers } from "hardhat";
import { Contract } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import UniswapV2Router02 from '../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'
import ERC20 from '../artifacts/contracts/ERC20.sol/ERC20.json'
import { BigNumber } from '@ethersproject/bignumber'
import FlashLoanArbitrage from '../artifacts/contracts/FlashLoanArbitrage.sol/FlashLoanArbitrage.json'



async function main() {

    const [deployer] = await ethers.getSigners();
    const tokenAddressA="0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf"
    const tokenAddressB="0x9d4454B023096f34B160D6B654540c56A1F81688"
    const tokenA = new Contract(tokenAddressA, JSON.stringify(ERC20.abi),deployer)
    const tokenB = new Contract(tokenAddressB, JSON.stringify(ERC20.abi),deployer)
  
    const samountA=BigNumber.from(10).mul(BigNumber.from(10).pow(18))
  
    const sFlashAddress="0xFD471836031dc5108809D173A067e8486B9047A3"
    const sFlash = new Contract(sFlashAddress, JSON.stringify(FlashLoanArbitrage.abi),deployer)
 
    const sresult = await sFlash.executeTrade(tokenAddressA,tokenAddressB,samountA,0)
    console.log("result:", sresult);
   
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  

