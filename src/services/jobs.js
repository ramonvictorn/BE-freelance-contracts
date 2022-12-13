const { Op } = require("sequelize");
const { Contract, Job, sequelize, Profile } = require("../model");

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

  async payAJob(loggedUser, jobId) {
    const userId = loggedUser.id;

    const job = await Job.findOne({
      include: {
        model: Contract,
        required: true,
        where: {
          id: jobId,
          ClientId: userId,
        },
      },
      where: {
        paid: {
          [Op.or]: [false, null]
        },
      },
    });

    const userIsClient = job?.Contract?.ClientId === userId;
    if (!job || !userIsClient) {
      return {
        status: 404,
        error: 'JOB_NOT_AVAILABLE_TO_PAY'
      }
    }

    if (loggedUser.balance <= job.price) {
      return {
        status: 400,
        error: 'BALANCE_NOT_SUFFICIENT'
      }
    }

    const t = await sequelize.transaction();

    try {
      const newLoggedUserBalance = loggedUser.balance - job.price;

      await Profile.update({
        balance: newLoggedUserBalance,
      }, {
        where: {
          id: userId,
        },
        transaction: t,
      });

      const contractor = await Profile.findOne({
        where: { 
          id: job.Contract.ContractorId
        },
        transaction: t,
      });
      const contractorNewBalance = contractor.balance + job.price;

      await Profile.update({
        balance: contractorNewBalance,
      }, {
        where: {
          id: job.Contract.ContractorId,
        },
        transaction: t,
      });

      await Job.update({
        paid: true,
        paymentDate: new Date(),
      }, {
        where: {
          id: job.id,
        },
        transaction: t,
      });

      await t.commit();
    
    } catch (error) {
      console.log(error)
      await t.rollback();
    }

    return {
      data: await Job.findOne({ where: { id: jobId }})
    }
  }
}

module.exports = {
  JobsService,
};
