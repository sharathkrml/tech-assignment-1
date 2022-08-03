import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployContract } from "../helpers/deployContract"
import verify from "../utils/verify"
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {
        deployments: { deploy, log },
        getNamedAccounts,
    } = hre
    const { deployer } = await getNamedAccounts()
    const token = await deploy("Token", {
        from: deployer,
        args: ["token2", "TK2"],
        log: true,
        waitConfirmations: 6,
    })
    console.log("verifying.......")
    await verify(token.address, ["token2", "TK2"])
}
export default func
func.tags = ["all"]
