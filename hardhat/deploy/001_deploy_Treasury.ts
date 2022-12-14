import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../utils/verify"
import { network } from "hardhat"
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {
        deployments: { deploy },
        getNamedAccounts,
    } = hre
    const { deployer } = await getNamedAccounts()
    const treasury = await deploy("Treasury", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.chainId == 31337 ? 0 : 6,
    })
    if (network.config.chainId != 31337) {
        console.log("verifying.......")
        await verify(treasury.address, [])
    }
}
export default func
func.tags = ["Treasury", "all"]
