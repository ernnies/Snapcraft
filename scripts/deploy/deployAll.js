const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy Token (not upgradeable unless designed for it)
  const Token = await ethers.getContractFactory("C0mradToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("C0mradToken deployed:", await token.getAddress());

  // Deploy Core (UUPS)
  const Core = await ethers.getContractFactory("C0mradCore");
  const core = await upgrades.deployProxy(Core, [], {
    initializer: "initialize",
    kind: "uups",
  });
  await core.waitForDeployment();

  const coreProxy = await core.getAddress();
  const coreImpl = await upgrades.erc1967.getImplementationAddress(coreProxy);

  console.log("C0mradCore Proxy:", coreProxy);
  console.log("C0mradCore Impl:", coreImpl);

  // Deploy RWAFactory
  const RWAFactory = await ethers.getContractFactory("RWAFactory");
  const rwaFactory = await RWAFactory.deploy();
  await rwaFactory.waitForDeployment();

  // Deploy InsurancePool
  const InsurancePool = await ethers.getContractFactory("InsurancePool");
  const insurancePool = await InsurancePool.deploy();
  await insurancePool.waitForDeployment();

  // Deploy YieldOptimizer
  const YieldOptimizer = await ethers.getContractFactory("YieldOptimizer");
  const yieldOptimizer = await YieldOptimizer.deploy();
  await yieldOptimizer.waitForDeployment();

  // Deploy DAO (pass token address)
  const C0mradDAO = await ethers.getContractFactory("C0mradDAO");
  const dao = await C0mradDAO.deploy(await token.getAddress());
  await dao.waitForDeployment();

  console.log("✅ Deployment Complete");

  const addresses = {
    C0mradToken: await token.getAddress(),
    C0mradCore: coreProxy,
    C0mradCore_Implementation: coreImpl,
    RWAFactory: await rwaFactory.getAddress(),
    InsurancePool: await insurancePool.getAddress(),
    YieldOptimizer: await yieldOptimizer.getAddress(),
    C0mradDAO: await dao.getAddress()
  };

  fs.writeFileSync("deployedAddresses.json", JSON.stringify(addresses, null, 2));
  console.log("📁 Addresses saved to deployedAddresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
