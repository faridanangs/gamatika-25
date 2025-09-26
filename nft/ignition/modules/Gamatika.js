// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('Gamatika', (m) => {
  const gmtk = m.contract('GMTKNFT', [
    '0xcaB108CA64Fa6860750a4418A5b7c7B86288d6fe',
  ]);

  return { gmtk };
});
