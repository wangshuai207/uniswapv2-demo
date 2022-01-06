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

TokenA deployed to: 0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82
TokenB deployed to: 0x9A676e781A523b5d0C0e43731313A708CB607508
WETH deployed to: 0x0B306BF915C4d645ff596e518fAf3F9669b97016
WETHPartner deployed to: 0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1

UniswapV2Factory deployed to: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
UniswapV2Factory codeHash is: 0x9921bed6fd45ef089eb9c834fb0b65aece90e4bc7a8e20d62136adea5a13135c

UniswapV2Pair address to: 0x57C3858eECBc52B9f8537EA26a20099D7e53EEcb
UniswapV2Router02 deployed to: 0x68B1D87F95878fE05B998F19b66F4baba5De1aed
