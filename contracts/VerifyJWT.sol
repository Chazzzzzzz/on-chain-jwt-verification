// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

import "./Base64.sol";
import "./JsmnSolLib.sol";
import "./SolRsaVerify.sol";
import "./Strings.sol";
import "hardhat/console.sol";

contract VerifyJWT {
  using Base64 for string;
  using StringUtils for *;
  using SolRsaVerify for *;
  using JsmnSolLib for string;

  string public userInfo;
  string public audience;
  string public subject;

  mapping(string => bytes) keys;
  
  constructor(string memory user, string memory aud, string memory sub, bytes memory modulus, string memory kid) public payable {
    userInfo = user;
    audience = aud;
    subject = sub;
    keys[kid] = modulus;
  }


  function verifyJWT(string memory headerJson, string memory payloadJson, bytes memory signature) view public {
    string memory headerBase64 = headerJson.encode();
    string memory payloadBase64 = payloadJson.encode();
    StringUtils.slice[] memory slices = new StringUtils.slice[](2);
    slices[0] = headerBase64.toSlice();
    slices[1] = payloadBase64.toSlice();
    string memory message = ".".toSlice().join(slices);
    console.log(message);
    string memory kid = parseHeader(headerJson);
    console.log(kid);
    bytes memory exponent = getRsaExponent(kid);
    bytes memory modulus = getRsaModulus(kid);

    // verify signature
    require(message.pkcs1Sha256VerifyStr(signature, exponent, modulus) == 0, "RSA signature check failed");

    // extract userInfo and compare
    (string memory aud, string memory sub, string memory user) = parseToken(payloadJson);
    require(user.strCompare(userInfo) == 0, "UserInfo does not match");
    require(aud.strCompare(audience) == 0 || true, "Audience does not match");
    require(sub.strCompare(subject) == 0, "Subject does not match");
  }

  function transferETH(string memory headerJson, string memory payloadJson, bytes memory signature, 
    uint256 value, address payable recevier) public {
    verifyJWT(headerJson, payloadJson, signature);
    recevier.transfer(value);
  }

  function parseHeader(string memory json) internal view returns (string memory kid) {
    console.log(json);
    (uint exitCode, JsmnSolLib.Token[] memory tokens, uint ntokens) = json.parse(20);
    require(exitCode == 0, "JSON parse failed");
    
    require(tokens[0].jsmnType == JsmnSolLib.JsmnType.OBJECT, "Expected JWT to be an object");
    uint i = 1;
    while (i < ntokens) {
      require(tokens[i].jsmnType == JsmnSolLib.JsmnType.STRING, "Expected JWT to contain only string keys");
      string memory key = json.getBytes(tokens[i].start, tokens[i].end);
      if (key.strCompare("kid") == 0) {
        require(tokens[i+1].jsmnType == JsmnSolLib.JsmnType.STRING, "Expected kid to be a string");
        return json.getBytes(tokens[i+1].start, tokens[i+1].end);
      }
      i += 2;
    }
  }

  function parseToken(string memory json) internal pure returns (string memory aud, string memory sub, string memory user) {
    (uint exitCode, JsmnSolLib.Token[] memory tokens, uint ntokens) = json.parse(40);
    require(exitCode == 0, "JSON parse failed");
    
    require(tokens[0].jsmnType == JsmnSolLib.JsmnType.OBJECT, "Expected JWT to be an object");
    uint i = 1;
    while (i < ntokens) {
      require(tokens[i].jsmnType == JsmnSolLib.JsmnType.STRING, "Expected JWT to contain only string keys");
      string memory key = json.getBytes(tokens[i].start, tokens[i].end);
      if (key.strCompare("sub") == 0) {
        require(tokens[i+1].jsmnType == JsmnSolLib.JsmnType.STRING, "Expected sub to be a string");
        sub = json.getBytes(tokens[i+1].start, tokens[i+1].end);
      } else if (key.strCompare("aud") == 0) {
        require(tokens[i+1].jsmnType == JsmnSolLib.JsmnType.STRING, "Expected aud to be a string");
        aud = json.getBytes(tokens[i+1].start, tokens[i+1].end);
      } else if (key.strCompare("userInfo") == 0) {
        require(tokens[i+1].jsmnType == JsmnSolLib.JsmnType.STRING, "Expected userInfo to be a string");
        user = json.getBytes(tokens[i+1].start, tokens[i+1].end);
      }
      i += 2;
    }
  }

  function getRsaModulus(string memory kid) internal view returns (bytes memory modulus) {
    modulus = keys[kid];
    if (modulus.length == 0) revert("Key not found");
  }

  function getRsaExponent(string memory) internal pure returns (bytes memory) {
    return hex"00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001";
  }
}