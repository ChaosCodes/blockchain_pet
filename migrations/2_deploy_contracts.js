
var pet_contract = artifacts.require("./pet.sol");

module.exports = function(deployer) {
  deployer.deploy(pet_contract);
};
