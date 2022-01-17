import { v2Fixture } from "../tools/fixtures"
import { expandTo18Decimals } from "../tools/utils"
import { BigNumberish, Contract } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { formatEther } from '@ethersproject/units'
import { ethers} from "hardhat";
import hre from "hardhat";
import { Arbitrager } from "../typechain-types/Arbitrager";
import { UniswapV2Factory } from "../typechain-types/UniswapV2Factory";
import UniswapV2PairAbi from '../artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json'
import { UniswapV2Pair } from "../typechain-types/UniswapV2Pair";
import{BigNumber as BN} from "bignumber.js"


const overrides = {
    gasLimit: 9999999
}


async function main() {
  const [deployer,bob] = await ethers.getSigners();
  const to =await deployer.getAddress();
  const fixture= await v2Fixture();
  //approve
  let appeoveAmount=expandTo18Decimals(10000);
  let tx= await fixture.token0.approve(fixture.sRouter.address,appeoveAmount)
  await tx.wait()
  tx= await fixture.token1.approve(fixture.sRouter.address,appeoveAmount)
  await tx.wait()
  tx=await fixture.token0.approve(fixture.uRouter.address,appeoveAmount)
  await tx.wait()
  tx= await fixture.token1.approve(fixture.uRouter.address,appeoveAmount)
  await tx.wait()
  tx= await fixture.token2.approve(fixture.uRouter.address,appeoveAmount)
  await tx.wait()

  //add liquidity
  let amountA=expandTo18Decimals(10);
  let amountB=expandTo18Decimals(1000);
  //sPair token0/token1 10/1000
  tx=await fixture.sRouter.addLiquidity(fixture.token0.address,fixture.token1.address,amountA,amountB,0,0,to,MaxUint256)
  await tx.wait()
  amountA=expandTo18Decimals(600);
  let amountC=expandTo18Decimals(500);
  amountB=expandTo18Decimals(1000);
  //uPair token0/token2 600/500  token2/token1 500/1000
  tx=await fixture.uRouter.addLiquidity(fixture.token0.address,fixture.token2.address,amountA,amountC,0,0,to,MaxUint256)
  await tx.wait()
  tx=await fixture.uRouter.addLiquidity(fixture.token2.address,fixture.token1.address,amountC,amountB,0,0,to,MaxUint256)
  await tx.wait()



  let sAmountA=await fixture.token0.balanceOf(fixture.sPair.address)
  let sAmountB=await fixture.token1.balanceOf(fixture.sPair.address)
  console.log("sPair.token0 : ",formatEther(sAmountA))
  console.log("sPair.token1 : ",formatEther(sAmountB))

  const sArbitrage = await ethers.getContractFactory("Arbitrager");
  const sarbitrage=(await sArbitrage.deploy(fixture.sFactory.address,fixture.uRouter.address)) as Arbitrager
  await sarbitrage.deployed();
  console.log("sArbitrager deployed to:", sarbitrage.address);

  //sPair借出200 token1
  let amountOut=expandTo18Decimals(200) 
  //计算sPair借出200个token0需要的token0数量  ((10*1000/(1000-200))-10)/0.997=2.5075225677
  //从uPair加入200 token0 ，兑换出token0数量 20*10000/(1000+200*0.997)=16.675004168751042
  //bob token0=0.8174732
  const abiCoder=new ethers.utils.AbiCoder()
  // console.log("从sPair借出200个token1和uPair交易，兑换出3.3245token0，取出2.51个token0还给sPair");
  // console.log("Bob剩余0.8149958个token0");
  console.log("token0:",fixture.token0.address);
  console.log("token1:",fixture.token1.address);
  console.log("token2:",fixture.token2.address);
  tx=await fixture.sPair.swap(0,amountOut,sarbitrage.address,abiCoder.encode([ "uint","address[]" ], [ MaxUint256,[fixture.token1.address,fixture.token2.address,fixture.token0.address]]),overrides)
  await tx.wait()

  amountA=await fixture.token0.balanceOf(bob.address)
  console.log("bob token0.balanceOf : ",formatEther(amountA))

  sAmountA=await fixture.token0.balanceOf(fixture.sPair.address)
  sAmountB=await fixture.token1.balanceOf(fixture.sPair.address)
  console.log("sPair.token0 : ",formatEther(sAmountA))
  console.log("sPair.token1 : ",formatEther(sAmountB))

  
  const upairAddress1 = await fixture.uFactory.getPair(fixture.token0.address, fixture.token2.address)
  const uPair1 = (new Contract(upairAddress1, JSON.stringify(UniswapV2PairAbi.abi),bob)) as UniswapV2Pair
  const reserves1=await uPair1.getReserves(overrides)
  let token0=await uPair1.token0()
  let token1=await uPair1.token1()
  console.log(token0,":",formatEther(reserves1._reserve0))
  console.log(token1,":",formatEther(reserves1._reserve1))
  const upairAddress2 = await fixture.uFactory.getPair(fixture.token1.address, fixture.token2.address)
  const uPair2 = (new Contract(upairAddress2, JSON.stringify(UniswapV2PairAbi.abi),bob)) as UniswapV2Pair
  const reserves2=await uPair2.getReserves(overrides)
  token0=await uPair2.token0()
  token1=await uPair2.token1()
  console.log(token0,":",formatEther(reserves2._reserve0))
  console.log(token1,":",formatEther(reserves2._reserve1))
}
async function call_airbitrage_profit(r:BigNumber,baseToken:string,pair0:UniswapV2Pair,pair1:UniswapV2Pair,pair2:UniswapV2Pair):Promise<BigNumber>{
 let token0= await pair0.token0()
 let token1= await pair0.token1()
 let tokenB= token0==baseToken?token1:token0
 let reserves=await pair0.getReserves()
 const x0= token0==baseToken?reserves._reserve0:reserves._reserve1
 const y0= token0==baseToken?reserves._reserve1:reserves._reserve0

 token0= await pair1.token0()
 token1= await pair1.token1()
 let tokenC= token0==tokenB?token1:token0
 reserves=await pair1.getReserves()
 const x1= token0==tokenB?reserves._reserve0:reserves._reserve1
 const y1= token0==tokenB?reserves._reserve1:reserves._reserve0

 token0= await pair2.token0()
 token1= await pair2.token1()
 reserves=await pair1.getReserves()
 const x2= token0==tokenC?reserves._reserve0:reserves._reserve1
 const y2= token0==tokenC?reserves._reserve1:reserves._reserve0
 let Ea=y0.mul(y1).mul(y2).div(x1.mul(x2).add(x2.mul(y0).mul(r).add(y0.mul(y1).mul(r.pow(2)))))
 let Eb=x0.mul(x1).mul(x2).div(x1.mul(x2).add(x2.mul(y0).mul(r).add(y0.mul(y1).mul(r.pow(2)))))
 let temp=Ea.mul(Eb).mul(r).toString()
 let tempBN=new BN(temp)
 return BigNumber.from(tempBN.sqrt().toString()).sub(Eb).div(r)
}
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
main().catch((error) => {
console.error(error);
process.exitCode = 1;
});
  