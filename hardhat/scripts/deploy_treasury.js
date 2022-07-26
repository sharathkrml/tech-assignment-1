const { ethers } = require("hardhat");
const hre = require("hardhat");

console.log("hre.network.name ", hre.network.name);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  const verificationEnabled = true;
  const [deployer] = await ethers.getSigners();
  const deployerAddress = deployer.address;
  console.log(`\n\n\n Deployer Address: ${deployerAddress} \n\n\n`);

  const Treasury = await ethers.getContractFactory("Treasury");

  const treasury = await Treasury.deploy();
  console.log("Treasury tx hash : ", treasury.deployTransaction.hash);

  await treasury.deployed();

  console.log("Treasury deployed: ", treasury.address);

  const Token = await ethers.getContractFactory("VotesTokenWithSupply");

  const token = await Token.deploy(
    "MOCK TOKEN",
    "MOCK",
    [],
    [],
    ethers.utils.parseEther("100"),
    deployerAddress
  );
  console.log("token tx hash : ", token.deployTransaction.hash);

  await token.deployed();

  console.log("token deployed: ", token.address);

  console.log("waiting for a minute");

  if (verificationEnabled) {
    await sleep(60000);

    await hre.run("verify:verify", {
      address: treasury.address,
      constructorArguments: [],
    });

    await hre.run("verify:verify", {
      address: token.address,
      constructorArguments: [
        "MOCK TOKEN",
        "MOCK",
        [],
        [],
        ethers.utils.parseEther("100"),
        deployerAddress,
      ],
    });
  }
}

main()
  .then(() => {
    console.log("DONE");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
