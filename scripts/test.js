// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const VerifyJWT = require("../artifacts/contracts/VerifyJWT.sol/VerifyJWT.json");

async function main() {
    const header = '{"alg":"RS256","typ":"JWT", "kid": "default"}';
    const payload = '{"sub":"eth transfer","userInfo":"Changze Cui","iat":1516239022,"aud":"audience"}';
    const signature = "0x8b97e279cbeb7288886739de7e1f86d32612de5914930a2caaf4ff6b024467d2a81bf98156c58d2606c8e2777bb3cb1994ec44c1c5e920b55dd766c4b3f3427cc8f3d7c964f515260a8456c79b1b4ef04ee491ed88bbeb097c197122441f6081fc5df4980757fccac6cbbd7a191218bf64e825b254591ce4169efe01cb10d71d91c7e30c8234a29a61e427c1889b640a842906889d6d01dc1b0e9fe26b8262f5432feb3362cf27fb2120fceb10c41e0cd42e0a8ab0b502b75742d9092bba376223b3210adebb663c46e340e0043e3abb2ed430a7ac69d247e71fbddf40ce69d4b09084365fdba857fefaec2187628de0e3f0f683d9ad408944e490e43f6e0a3a";
    const deployedVerifyJWTAddr = "0x2279E7AD88fA1Dd418F66Ffc0aD5a1ff9bDc57a6"
    const singer = await hre.ethers.getSigner()
    const verifyJWT = new ethers.Contract(deployedVerifyJWTAddr, VerifyJWT.abi, singer);
    const tx = await verifyJWT.transferETH(header, payload, signature, parseEther("0.001"), "0x4eC481FA88fc95B45895543a0Fc86eFB8F0D18f3");
    const receipt = await tx.wait();
    console.log(receipt)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
