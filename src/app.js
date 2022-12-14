const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const { getContractById, getContracts } = require('./controllers/contracts');
const { getUnpaidJobs, payAJob } = require('./controllers/jobs');
const { deposityMoney } = require('./controllers/balances');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)


app.get('/contracts/:contractId', getProfile , getContractById);
app.get('/contracts/', getProfile , getContracts);

app.get('/jobs/unpaid', getProfile , getUnpaidJobs);
app.post('/jobs/:jobId/pay', getProfile , payAJob);

app.post('/balances/deposit/:userId', getProfile , deposityMoney);

module.exports = app;
