# OnChain JWT Verification

In this project, we imeplent a system where users can access web3 assets with web2 authentication method (e.g., google login). There is no private key management ever needed for this system so both users and asset manager do not need to worry about the loss or replacement of private key. Specifically, we implement a simple smart contract wallet which only allows ETH transfer with valid JWT token matching pre-stored user info. 

The code is tested onchain and you can find the contract at 
https://www.oklink.com/okc-test/address/0x2279e7ad88fa1dd418f66ffc0ad5a1ff9bdc57a6

A simple JWT validation and ETH transfer transaction is at
https://www.oklink.com/okc-test/tx/0xF63D956623D1B49327BD5A890DAD02FDEA7329EA4E941A63BCE5FFF54AC16418

## Motivation

Google has about 4.3 billion users worldwide whereas the whole web3 ecosystem probably has about 50 million users. The most important problem within web3 today is about how to bring the next billion users into web3. Apparently, making web3 product easy to use and hard to make mistake is one big part of the journey. 

In this project, we target the web3 wallet usability problem and try to bridge the gap between web3 authentication and web2 authentication. As of today, most of the web3 wallets are externally owned account (EOA) meaning that either users or the third party will need to manage the whole lifecycle of private keys (e.g., key generation, lost recovery, key rotation, etc.). As we all know, managing private key is hard and people make mistakes EVERYDAY. The business will NOT not bloom if you tell users that forgetting the private key for once will lose all your money forever.

Therefore, we try to make the experience of using web3 wallet as easy as possible. We believe not everyone is ctypro OG so we better learn from traditional web2 method to make the onboarding process as easy as possible and then teach the users more in-depth stuff.

## Methodology
We implement an on-chain JWT verification system which can decode any valid JWT token onchain and compare with stored user infos. Specifically, we implement a simple smart contract wallet which only allows ETH transfer with valid JWT token matching pre-stored user info. 

Our system does not require any private key for user or third party to access the asset on smart contract. User can use web2 authentication mechanism and access the web3 asset right away. Essentially, the system is trusting the JWT provider has already validated users' identity. 

In this way, the web3 wallet experience could be very similar to web2 wallet like Robinhood where users login to Robinhood using username and password and can access their web3 assets right away.

The general workflow is like this:

- user login any OAuth2 auth provider (e.g., google login)
- auth provider validate users'identity and generate a JWT token
- the JWT token is sent to the smart contract
- smart contract decode and validate the JWT token is signed by a trusted auth provider
- smart contract extract the userInfo from the JWT token (which is signed by auth provider)
- smart contract compare the extracted userInfo with the stored userInfo and decide whether the user can access the assets within smart contract

## What's in this project
In this project, we choose google as the auth provider as its one of the most popular ones. We implement a simple smart contract wallet which validate JWT tokens and then decide whether the requester can access the asset within the smart contract.

Specifically, the project contains the following components:

- on-chain JWT token decode
- on-chain JWT signature validation
- smart contract wallet which allows ETH transfer with valid JWT token

## How to run the tests

### Download and install
```
git clone https://github.com/Chazzzzzzz/okx-hackathon.git
npm install
```

### Compile

```
npx hardhat compile
```

### Local tests

```
npx hardhat test
```

### OnChain tests

deploy the contract. sample: https://www.oklink.com/okc-test/address/0x2279e7ad88fa1dd418f66ffc0ad5a1ff9bdc57a6
```
npx hardhat run --network okx scripts/deploy.js
```

transfer eth. sample: https://www.oklink.com/okc-test/tx/0xF63D956623D1B49327BD5A890DAD02FDEA7329EA4E941A63BCE5FFF54AC16418
```
npx hardhat run --network okx scripts/test.js
```

## Next Steps

To really make this production ready, more components need to be done:

- rotate RSA public keys of auth provider through ORACLE
- security mechanism against replay attack
- extension on the asset management functionality of the smart contracts
- support more auth providers