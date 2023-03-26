const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");

describe("VerifyJWT", function () {
    const userInfo = "Changze Cui"
    const aud = "audience"
    const sub = "eth transfer"
    const modulus = "0xB0CA0A0EEBA26CDA6C0FA56527056D49C91045CFD6598A050F7CA831173416426F3630264221C94B8189F19CBFA2073682CE16A459C5E59978320FFC9AF811A8E9B1264C4DD3B32339791458EFD65776229FF82CE26389BACFB606FDFD05AD0253045931B7BFD1383CA5D2E5F49796C828A59321F1632CED38FE66FD668D9C2851F47E50CF337A1FE37C189DA93E2CFC5CFCB833C06F749FF405E33C94AEA36D120B622E9C61BEADDF677458EEA985C6567C7A54B3F6D079FBFB6C563548C0349E5D08972D9E6BE932E69001AB0390363A342A9A874C70B231EB0B0CD90D4599D914C7ADF755EE5E5012099AA1DC5A7152B598B8F90C2B16842A26F650FE5E6F";
    const kid = "default"
    async function deploy() {
        const [owner, device] = await ethers.getSigners();
        await ethers.provider.getSigner().sendTransaction({
            from: owner.address,
            to: device.address,
            value: parseEther("1")
        });
        const verifyJWTFactory = await ethers.getContractFactory("VerifyJWT");
        const verifyJWT = await verifyJWTFactory.deploy(userInfo, aud, sub, modulus, kid, {value: parseEther("1")});
        return {owner, device, verifyJWT};
    }

    it("succeed", async function () {
        const { verifyJWT, owner } = await loadFixture(deploy);
        const header = '{"alg":"RS256","typ":"JWT", "kid": "default"}';
        const payload = '{"sub":"eth transfer","userInfo":"Changze Cui","iat":1516239022,"aud":"audience"}';
        // echo -n "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJub25jZSI6ImNKbDVjTVVZRXR3NkFReDlBYlVPRFJmY2VjZyIsImF1ZCI6InRoZWF1ZGllbmNlIn0" | openssl dgst -sha256 -sign private.pem  | xxd -p | tr -d \\n
        const signature = "0x8b97e279cbeb7288886739de7e1f86d32612de5914930a2caaf4ff6b024467d2a81bf98156c58d2606c8e2777bb3cb1994ec44c1c5e920b55dd766c4b3f3427cc8f3d7c964f515260a8456c79b1b4ef04ee491ed88bbeb097c197122441f6081fc5df4980757fccac6cbbd7a191218bf64e825b254591ce4169efe01cb10d71d91c7e30c8234a29a61e427c1889b640a842906889d6d01dc1b0e9fe26b8262f5432feb3362cf27fb2120fceb10c41e0cd42e0a8ab0b502b75742d9092bba376223b3210adebb663c46e340e0043e3abb2ed430a7ac69d247e71fbddf40ce69d4b09084365fdba857fefaec2187628de0e3f0f683d9ad408944e490e43f6e0a3a"
        
        const balanceBefore = await owner.getBalance();
        const tx = await verifyJWT.transferETH(header, payload, signature, parseEther("0.1"), owner.address);
        const receipt = await tx.wait();
        console.log("gas:", receipt.gasUsed);
        const balanceAfter = await ethers.provider.getBalance(owner.address);
        expect(balanceAfter).to.be.greaterThan(balanceBefore);
    })
})