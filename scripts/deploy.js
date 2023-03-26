// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { parseEther } = require("ethers/lib/utils");

async function main() {
  const userInfo = "Changze Cui"
  const aud = "audience"
  const sub = "eth transfer"
  const modulus = "0xB0CA0A0EEBA26CDA6C0FA56527056D49C91045CFD6598A050F7CA831173416426F3630264221C94B8189F19CBFA2073682CE16A459C5E59978320FFC9AF811A8E9B1264C4DD3B32339791458EFD65776229FF82CE26389BACFB606FDFD05AD0253045931B7BFD1383CA5D2E5F49796C828A59321F1632CED38FE66FD668D9C2851F47E50CF337A1FE37C189DA93E2CFC5CFCB833C06F749FF405E33C94AEA36D120B622E9C61BEADDF677458EEA985C6567C7A54B3F6D079FBFB6C563548C0349E5D08972D9E6BE932E69001AB0390363A342A9A874C70B231EB0B0CD90D4599D914C7ADF755EE5E5012099AA1DC5A7152B598B8F90C2B16842A26F650FE5E6F";
  const kid = "default"
  const VerifyJWT = await hre.ethers.getContractFactory("VerifyJWT");
  const verifyJWT = await VerifyJWT.deploy(userInfo, aud, sub, modulus, kid, {value: parseEther("0.01")});
  await verifyJWT.deployed();
  console.log(verifyJWT)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
