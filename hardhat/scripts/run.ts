import { HardhatRuntimeEnvironment } from "hardhat/types"
import { deployments, ethers } from "hardhat"
import { Token } from "../typechain/Token"
import { Token__factory } from "../typechain/factories/Token__factory"
import { Treasury } from "../typechain"
const interactWithContracts = async () => {
    await deployments.fixture(["Treasury"])
    let TokenFactory: Token__factory = await ethers.getContractFactory("Token")
    // Contracts
    let treasury: Treasury = await ethers.getContract("Treasury")
    let token1: Token = await TokenFactory.deploy("Token1", "TK1")
    await token1.deployed()

    console.log(`Token1 deployed to ${token1.address}`)
    let token2: Token = await TokenFactory.deploy("Token2", "TK2")
    await token2.deployed()
    console.log(`Token2 deployed to ${token2.address}`)

    let accounts = await ethers.getSigners()
    console.log(" minting 1000 tokens & approving Treasury")
    ;[token1, token2].forEach(async (token) => {
        ;[0, 1].forEach(async (userCount) => {
            let account = accounts[userCount]
            let userToken = token.connect(account)
            let userTreasury = treasury.connect(account)
            let tx = await userToken.mint(1000)
            await tx.wait(1)
            tx = await userToken.approve(treasury.address, 1000)
            await tx.wait(1)
            console.log(
                `${token.address}, balanceOf ${account.address} is ${await token.balanceOf(
                    account.address
                )}`
            )
            console.log("------------------------------")
            console.log(`${account.address} deplositing ${token.address} Token`)
            console.log("1000 and withdawing 300,600")
            tx = await userTreasury.deposit(token.address, 1000)
            await tx.wait(1)
            tx = await userTreasury.withdraw(token.address, 300)
            await tx.wait(1)
            tx = await userTreasury.withdraw(token.address, 600)
            await tx.wait(1)
        })
    })
}
interactWithContracts().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
