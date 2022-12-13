const { Op } = require("sequelize");
const { Contract } = require("../model");

class ContractsService {
  async getContractById(loggedUser, contractId) {
    const userId = loggedUser.id;

    const contract = await Contract.findOne({
      where: {
        [Op.or]: {
          ClientId: userId,
          ContractorId: userId,
        },
        id: contractId,
      },
    });

    if (!contract) {
      return {
        status: 404,
        error: "CONTRACT_NOT_FOUND",
      };
    }

    return {
      data: contract,
    };
  }

  async getContracts(loggedUser) {
    const userId = loggedUser.id;

    const contracts = await Contract.findAndCountAll({
      where: {
        [Op.or]: {
          ClientId: userId,
          ContractorId: userId,
        },
        status: {
          [Op.or]: ['new', 'in_progress']
        }
      },
    });

    return {
      data: contracts,
    };
  }
}

module.exports = {
  ContractsService,
};
