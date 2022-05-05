const { expect } = require("chai");
const { ethers } = require("hardhat");

/* Using hooks provided by mocha framework*/

describe("Token Contract", function () {
  let Token;
  let myToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    myToken = await Token.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await myToken.owner()).to.equal(owner.address);
    });
    it("Should assign the total supply to the contract owner", async function () {
      const ownerBalance = await myToken.checkBalance(owner.address);
      expect(await myToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // owner -> addr1 | amount = 10MT
      await myToken.transfer(addr1.address, 10);
      const addr1Balance = await myToken.checkBalance(addr1.address);
      expect(addr1Balance).to.equal(10);

      // addr1 -> addr2 | amount = 5MT
      await myToken.connect(addr1).transfer(addr2.address, 5);
      const addr2Balance = await myToken.checkBalance(addr2.address);
      expect(addr2Balance).to.equal(5);
    });

    it("Should fail if sender's balance does not have enough tokens", async function () {
      const initialOwnerBalance = await myToken.checkBalance(owner.address);
      await expect(
        myToken.connect(addr1).transfer(owner.address, 5)
      ).to.be.revertedWith("Not Enough Tokens!");

      expect(await myToken.checkBalance(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await myToken.checkBalance(owner.address);

      await myToken.transfer(addr1.address, 50);
      await myToken.transfer(addr2.address, 100);

      const finalOwnerBalance = await myToken.checkBalance(owner.address);

      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await myToken.checkBalance(addr1.address);
      expect(addr1Balance).to.equal(50);

      const addr2Balance = await myToken.checkBalance(addr2.address);
      expect(addr2Balance).to.equal(100);
    });
  });
});

/* Without hooks*/

// describe("Token Contract", function () {
//   it("Deployment should assign the total supply to the contract owner", async function () {
//     const [owner] = await ethers.getSigners();

//     // console.log("Signers object:", owner);
//     // Creating instance of Token contract
//     const Token = await ethers.getContractFactory("Token");

//     // Deploying the Token contract instance
//     const myToken = await Token.deploy();

//     // Test....
//     const ownerBalance = await myToken.checkBalance(owner.address);
//     // console.log(`Owner address: ${owner.address}\nBalance: ${ownerBalance}`);

//     expect(await myToken.totalSupply()).to.equal(ownerBalance);
//   });
//   it("Should transfer tokens between accounts", async function () {
//     const [owner, address1, address2] = await ethers.getSigners();

//     // Creating instance of Token contract
//     const Token = await ethers.getContractFactory("Token");

//     // Deploying the Token contract instance
//     const myToken = await Token.deploy();

//     // Test....

//     // Transfer 10 tokens from owner to address1
//     await myToken.transfer(address1.address, 10);

//     expect(await myToken.checkBalance(address1.address)).to.equal(10);

//     // Transfer 5 tokens from address1 to address2
//     await myToken.connect(address1).transfer(address2.address, 5);
//     expect(await myToken.checkBalance(address2.address)).to.equal(5);
//   });
// });
