const { JobsService } = require('../services/jobs');

const jobsService = new JobsService();

async function getUnpaidJobs(req, res) {
    const result = await jobsService.getUnpaidJobs(req.profile);
    const body = result.error ? { error: result.error } : { data: result.data }
    res.status(result.status ?? 200).send(body);
}

async function payAJob(req, res) {
    const { jobId } = req.params;

    const result = await jobsService.payAJob(req.profile, jobId);
    const body = result.error ? { error: result.error } : { data: result.data }
    res.status(result.status ?? 200).send(body);
}

module.exports = {
    getUnpaidJobs,
    payAJob,
}