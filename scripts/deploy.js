import hre from "hardhat";

async function main() {
  console.log("Deploying PayfricaLedger contract...");

  const PayfricaLedger = await hre.ethers.getContractFactory("PayfricaLedger");
  const ledger = await PayfricaLedger.deploy();

  await ledger.waitForDeployment();

  const address = await ledger.getAddress();
  console.log(`PayfricaLedger deployed successfully to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
