# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

TokenA deployed to: 0xd6e1afe5cA8D00A2EFC01B89997abE2De47fdfAf
TokenB deployed to: 0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f
WETH deployed to: 0x6F6f570F45833E249e27022648a26F4076F48f78
WETHPartner deployed to: 0xCA8c8688914e0F7096c920146cd0Ad85cD7Ae8b9

INIT_CODE_PAIR_HASH: 0x199766a94ebdbc73b48321d8b1c652061e46f522f99918baecc4d027dd149188
SushiswapFactory deployed to: 0xB0f05d25e41FbC2b52013099ED9616f1206Ae21B
UniswapV2Factory deployed to: 0x5FeaeBfB4439F3516c74939A9D04e95AFE82C4ae

SushiswapRouter02 deployed to: 0xD42912755319665397FF090fBB63B1a31aE87Cee
UniswapV2Router02 deployed to: 0xfcDB4564c18A9134002b9771816092C9693622e3


sArbitrager deployed to: 0xFD6F7A6a5c21A3f503EBaE7a473639974379c351

pairAddress="0x4df52fC6e76DcC39ba14ab8c9d71B3A7f88fFb48"