const MyToken = artifacts.require("MyToken");
const MyMarketplace = artifacts.require("MyMarketplace");

module.exports = async function(deployer) {
  await deployer.deploy(MyToken);

  const token = await MyToken.deployed()

  await deployer.deploy(MyMarketplace, token.address)

  const market = await MyMarketplace.deployed()

  await token.setMarketplace(market.address)
};
