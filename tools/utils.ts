import { BigNumber } from '@ethersproject/bignumber'

export function expandTo18Decimals(n: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

export function expandToDecimals(n: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(16))
}
