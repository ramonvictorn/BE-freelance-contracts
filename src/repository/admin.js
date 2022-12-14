const { Op } = require('sequelize');
const { Job, sequelize, Contract, Profile } = require('../model');

class AdminRepository {
  async findTopClientsAndContractorsByMoney(type, { startDate, endDate }) {
    const types = {
      client: {
        groupBy: "Client",
        keyToProfile: 'Client',
      },
      contractor: {
        groupBy: "Contractor",
        keyToProfile: 'Contractor',
      },
    };
    const queriesValues = types[type];

    const userAndJobs = await Job.findAll({
      group: ['ContractId'],
      attributes: [
        [sequelize.fn('sum', sequelize.col('price')), 'total_price'],
        'id',
      ],
      order: [
        ['total_price', 'DESC']
      ],
      where: {
        paid: true,
        createdAt: {
          [Op.and]: [
            sequelize.where(sequelize.fn('date', sequelize.col('Job.createdAt')), '>=', startDate),
            sequelize.where(sequelize.fn('date', sequelize.col('Job.createdAt')), '<=', endDate),
          ],
        },
      }, 
      include: {
        model: Contract,
        required: true,
        include: {
          model: Profile,
          required: true,
          as: queriesValues.groupBy,
        },
      }, 
    });

    return userAndJobs;
  }
}


module.exports = {
  AdminRepository
}