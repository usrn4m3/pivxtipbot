const PIVXClient = require('../lib/nano_client.js');
const config = require('../config.json')[global.env];
const models = require('../db');
const utils = require('./../utils');

module.exports = function(agenda) {

    let pivxClient = new PIVXClient("https://144.217.240.174/nano_api", config.nano_api_key);

    agenda.define('account_create', async function(job, done) {
        let userId = job.attrs.data.userId;

        try {
            let result = await pivxClient.accountCreate();
            if (result.error) return done(new Error(result.error));

            await models.User.findByIdAndUpdate(userId, { address: result.account });
            done();
        } catch(e) {
            utils.ExceptionReporter.captureException(e);
            done(e);
        }
    });
};
