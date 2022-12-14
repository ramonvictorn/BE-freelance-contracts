const { AdminService } = require('../services/admin');

const adminService = new AdminService();

async function getProfessionWithMoreEarns(req, res) {
    const { start, end } = req.query;

    const result = await adminService.getProfessionWithMoreEarns(req.profile, { startDate: start, endDate: end });
    const body = result.error ? { error: result.error } : { data: result.data }
    res.status(result.status ?? 200).send(body);
}

async function getClientsWithMostPaidJobs(req, res) {
    const { start, end } = req.query;

    const result = await adminService.getClientsWithPaidJobs(req.profile, { startDate: start, endDate: end });
    const body = result.error ? { error: result.error } : { data: result.data }
    res.status(result.status ?? 200).send(body);
}


module.exports = {
    getProfessionWithMoreEarns,
    getClientsWithMostPaidJobs,
}