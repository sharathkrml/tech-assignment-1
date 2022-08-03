import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { deployContract } from "../helpers/deployContract";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment)=> {
  const { getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  await deployContract(hre, "Treasury", []);
  const treasury = await hre.deployments.get("Treasury");
};
export default func;
func.tags=["Treasury","all"]