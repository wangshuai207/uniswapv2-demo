import { ethers } from "hardhat";
import { Contract } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import UniswapV2Router02 from '../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'
import ERC20 from '../artifacts/contracts/ERC20.sol/ERC20.json'
import { BigNumber } from '@ethersproject/bignumber'
import UniswapV2Pair from '../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Pair.json'

async function main() {

    const [deployer] = await ethers.getSigners();
    const tokenAddressA="0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf"
    const tokenAddressB="0x9d4454B023096f34B160D6B654540c56A1F81688"
    const tokenA = new Contract(tokenAddressA, JSON.stringify(ERC20.abi),deployer)
    const tokenB = new Contract(tokenAddressB, JSON.stringify(ERC20.abi),deployer)
    const sfactory="0x809d550fca64d94Bd9F66E60752A544199cfAC3D"
    const ufactory="0x4c5859f0F772848b2D91F1D83E2Fe57935348029"
  
    const sFlashAddress="0x525C7063E7C20997BaaE9bDa922159152D0e8417"
    const abiCoder=new ethers.utils.AbiCoder()
    const pairAddress="0x8CAB8e7C55397960605390669552f94CD0269667"
    const approveMount=BigNumber.from(100).mul(BigNumber.from(10).pow(18))
    await tokenA.approve(pairAddress,approveMount)
    await tokenB.approve(pairAddress,approveMount)
    await tokenA.approve(sfactory,approveMount)
    await tokenB.approve(ufactory,approveMount)
    await tokenA.approve(sFlashAddress,approveMount)
    await tokenB.approve(sFlashAddress,approveMount)
    const sPair = new Contract(pairAddress, JSON.stringify(UniswapV2Pair.abi),deployer)
    console.log("deployer:", deployer.getAddress());
    const token0=await sPair.token0();
    console.log("token0:", token0);
    const swapMount=BigNumber.from(10).mul(BigNumber.from(10).pow(18))
    sPair.swap( 0,
      swapMount,
      sFlashAddress,
      abiCoder.encode([ "uint","uint" ], [ BigNumber.from(1),MaxUint256]))
   
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  

