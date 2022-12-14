const { Op } = require("sequelize");
const { Contract, Profile, sequelize } = require("../model");
const { JobsService } = require('./jobs')

class BalancesService {
  constructor() {
    this.jobsService = new JobsService();
  }

  async deposityMoney(loggedUser, params) {
    const { value, userId: userIdToDeposit } = params;
    const userToDeposit = await Profile.findByPk(userIdToDeposit);
    const jobsToPay = await this.jobsService.getUnpaidJobs(userToDeposit);

    if (jobsToPay.data.rows.length === 0) {
      return {
        status: 400,
        error: 'YOU_DONT_HAVE_JOBS_TO_PAY',
      }
    }

    const sumToPay = jobsToPay.data.rows.reduce((acc, job) => acc + job.price, 0);
    const limitToDeposit = sumToPay + (sumToPay * 0.25);

    if (value > limitToDeposit) {
      return {
        status: 400,
        error: 'VALUE_HIGHER_THAN_YOUR_LIMIT'
      }
    }

    const t = await sequelize.transaction();

    try {
      const newClientBalance = userToDeposit.balance + value;

      await Profile.update({
        balance: newClientBalance,
      }, {
        where: {
          id: userIdToDeposit,
        },
        transaction: t,
      });

      await t.commit();
    
    } catch (error) {
      console.log(error)
      await t.rollback();
    }
    return {
      data: await Profile.findByPk(userIdToDeposit)
    }
  }
}

module.exports = {
  BalancesService,
};
