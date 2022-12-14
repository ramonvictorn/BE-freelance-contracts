const { BalancesService } = require('../services/balances');

const balancesService = new BalancesService();

async function deposityMoney(req, res) {
    const { userId } = req.params;
    const { value } = req.body;

    const result = await balancesService.deposityMoney(req.profile, { userId, value });
    const body = result.error ? { error: result.error } : { data: result.data }
    res.status(result.status ?? 200).send(body);
}


module.exports = {
    deposityMoney,
}