const { ContractsService } = require('../services/contracts');

const contractService = new ContractsService();

async function getContractById(req, res) {
    const { contractId } = req.params;

    const result = await contractService.getContractById(req.profile, contractId);
    const body = result.error ? { error: result.error } : { data: result.data }
    res.status(result.status ?? 200).send(body);
}

async function getContracts(req, res) {
    const result = await contractService.getContracts(req.profile);
    const body = result.error ? { error: result.error } : { data: result.data }
    res.status(result.status ?? 200).send(body);
}

module.exports = {
    getContractById,
    getContracts,
}