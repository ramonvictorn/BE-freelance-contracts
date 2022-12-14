const { Op } = require("sequelize");
const { propfind } = require("../app");
const { Contract, Profile, sequelize, Job } = require("../model");
const { JobsService } = require('./jobs')

class AdminService {
  constructor() {
    this.jobsService = new JobsService();
  }

  async getProfessionWithMoreEarns(loggedUser, { startDate, endDate }) {  
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
          as: 'Contractor',
        },
      }, 
    });

    const contractor = userAndJobs?.[0]?.Contract?.Contractor?.profession;

    if (!contractor) {
      return {
        status: 404,
        error: 'NOT_FOUND_INFORMATION_IN_THIS_RANGE'
      }
    }

    return {
      data: {
        profession: contractor,
      }
    }
  }
}

module.exports = {
  AdminService,
};
