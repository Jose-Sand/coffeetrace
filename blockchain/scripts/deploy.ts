import { ethers } from "hardhat";

async function main() {
  const CoffeeTrace = await ethers.getContractFactory("CoffeeTrace");
  const coffeeTrace = await CoffeeTrace.deploy();
  await coffeeTrace.waitForDeployment();

  const address = await coffeeTrace.getAddress();
  console.log(`✅ CoffeeTrace deployed to: ${address}`);
  console.log(`Add to backend .env: CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
