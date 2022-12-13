const { Op } = require("sequelize");
const { Contract, Job } = require("../model");

class JobsService {
  async getUnpaidJobs(loggedUser) {
    const userId = loggedUser.id;

    const jobs = await Job.findAndCountAll({
      include: {
        model: Contract,
        required: true,
        where: {
          [Op.or]: {
            ClientId: userId,
            ContractorId: userId,
          },
        },
      },
      where: {
        paid: {
          [Op.or]: [null, false]
        }
      },
    });

    return {
      data: jobs,
    };
  }
}

module.exports = {
  JobsService,
};
