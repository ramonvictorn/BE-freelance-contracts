const { Op } = require("sequelize");
const { propfind } = require("../app");
const { Contract, Profile, sequelize, Job } = require("../model");
const { JobsService } = require('./jobs');
const { AdminRepository } = require('../repository/admin');

class AdminService {
  constructor() {
    this.jobsService = new JobsService();
    this.adminRepository = new AdminRepository();
  }

  async getProfessionWithMoreEarns(loggedUser, { startDate, endDate }) {  
    const contractors = await this.adminRepository.findTopClientsAndContractorsByMoney('contractor', { startDate, endDate });
    const contractor = contractors?.[0]?.Contract?.Contractor?.profession;

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

  async getClientsWithPaidJobs(loggedUser, { startDate, endDate }) {  
    const clients = await this.adminRepository.findTopClientsAndContractorsByMoney('client', { startDate, endDate });

    if (!clients) {
      return {
        status: 404,
        error: 'NOT_FOUND_INFORMATION_IN_THIS_RANGE'
      }
    }

    const formattedClients = clients.map((client) => {
      return {
        id: client.Contract.Client.id,
        fullName: `${client.Contract.Client.firstName} ${client.Contract.Client.lastName}`,
        paid: client.dataValues.total_price,
      }
    })

    return {
      data: formattedClients,
    }
  }
}

module.exports = {
  AdminService,
};
