const serverless = require('serverless-http');
const app = require('./server');

// Export for AWS Lambda
module.exports.handler = serverless(app);