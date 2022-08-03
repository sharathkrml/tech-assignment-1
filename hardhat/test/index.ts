import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { ethers, deployments } from "hardhat"
import { Treasury } from "../typechain"
import { Token__factory } from "../typechain/factories/Token__factory"
import { Token } from "../typechain/Token"

describe("Treasury", function () {
    let treasury: Treasury
    let TokenFactory: Token__factory
    let token1: Token, token2: Token
    let accounts: SignerWithAddress[]
    beforeEach(async function () {
        await deployments.fixture(["Treasury"])
        treasury = await ethers.getContract("Treasury")
        TokenFactory = await ethers.getContractFactory("Token")
        token1 = await TokenFactory.deploy("Token1", "TK1")
        token2 = await TokenFactory.deploy("Token2", "TK2")
        accounts = await ethers.getSigners()
    })

    it("Should deploy Treasury", async () => {
        expect(treasury.address).to.be.properAddress
    })
    it("Checks Token name & symbol ", async () => {
        assert.equal(await token1.name(), "Token1")
        assert.equal(await token2.name(), "Token2")
        assert.equal(await token1.symbol(), "TK1")
        assert.equal(await token2.symbol(), "TK2")
    })
    describe("Function deposit", () => {
        let user1: SignerWithAddress
        let user2: SignerWithAddress
        beforeEach(async () => {
            user1 = accounts[0]
            user2 = accounts[1]
            await token1.mint(1000)
            await token1.connect(user2).mint(1000)
            await token1.approve(treasury.address, 1000)
            await token2.approve(treasury.address, 1000)
        })
        it("Revert deposit amount zero", async () => {
            await expect(
                treasury.connect(user1).deposit(token1.address, 0)
            ).to.be.revertedWithCustomError(treasury, "Treasury__amountZero")
        })
        it("deposit amount to treasury", async () => {
            assert.equal(
                (await treasury.userBalances(user1.address, token1.address)).toString(),
                "0"
            )
            let tx = await treasury.connect(user1).deposit(token1.address, 1000)
            await tx.wait(1)
            assert.equal(
                (await treasury.userBalances(user1.address, token1.address)).toString(),
                "1000"
            )
        })
        it("emits Deposit Event", async () => {
            await expect(treasury.connect(user1).deposit(token1.address, 1000))
                .to.emit(treasury, "Deposit")
                .withArgs(user1.address, token1.address, 1000)
        })
        it("check userBalance Updating", async () => {
            assert.equal(
                (await treasury.userBalances(user1.address, token1.address)).toString(),
                "0"
            )
            let tx = await treasury.connect(user1).deposit(token1.address, 500)
            await tx.wait(1)
            assert.equal(
                (await treasury.userBalances(user1.address, token1.address)).toString(),
                "500"
            )
            tx = await treasury.connect(user1).deposit(token1.address, 500)
            await tx.wait(1)
            assert.equal(
                (await treasury.userBalances(user1.address, token1.address)).toString(),
                "1000"
            )
        })
    })
    describe("Function Withdraw ", () => {
        let user1: SignerWithAddress
        beforeEach(async () => {
            user1 = accounts[0]
            await token1.mint(1000)
            await token2.mint(1000)
            await token1.approve(treasury.address, 1000)
            await token2.approve(treasury.address, 1000)
            await treasury.deposit(token1.address, 1000)
            await treasury.deposit(token2.address, 500)
        })
        it("revert while withdrawing zero", async () => {
            await expect(treasury.withdraw(token1.address, 0)).to.revertedWithCustomError(
                treasury,
                "Treasury__amountZero"
            )
        })
        it("reverts when trying to withdraw amount > balance", async () => {
            await expect(treasury.withdraw(token2.address, 600)).to.revertedWithCustomError(
                treasury,
                "Treasury__InsufficientBalance"
            )
        })
        it("check userBalances", async () => {
            assert.equal(
                (await treasury.userBalances(user1.address, token1.address)).toString(),
                "1000"
            )
            let tx = await treasury.withdraw(token1.address, 500)
            await tx.wait(1)
            assert.equal(
                (await treasury.userBalances(user1.address, token1.address)).toString(),
                "500"
            )
            assert.equal((await token1.balanceOf(user1.address)).toString(), "500")
            tx = await treasury.withdraw(token1.address, 500)
            await tx.wait(1)
            assert.equal(
                (await treasury.userBalances(user1.address, token1.address)).toString(),
                "0"
            )
            assert.equal((await token1.balanceOf(user1.address)).toString(), "1000")
        })
        it("check Withdraw event", async () => {
            await expect(treasury.withdraw(token1.address, 500))
                .to.emit(treasury, "Withdraw")
                .withArgs(user1.address, token1.address, 500)
        })
    })
})
