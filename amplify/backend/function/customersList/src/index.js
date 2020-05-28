// const awsServerlessExpress = require('aws-serverless-express');
// const app = require('./app');

// const server = awsServerlessExpress.createServer(app);

// exports.handler = (event, context) => {
//   console.log(`EVENT: ${JSON.stringify(event)}`);
//   awsServerlessExpress.proxy(server, event, context);
// };

'use strict';
const AWS                  = require('aws-sdk');
const awsServerlessExpress = require('aws-serverless-express');
const secretsmanager       = new AWS.SecretsManager({ region: 'ap-south-1' });
const AWS_SECRET           = 'stripeProdTestKey';
const app = require('./app');
let server;

const createServer = async (options) => {
  // Get AWS secret JSON string
  const secret = await secretsmanager.getSecretValue(options).promise();

  // Update ENV
  Object.assign(process.env, JSON.parse(secret.SecretString));

  // Import express app & create server
  server = awsServerlessExpress.createServer(require('./app'));
  return server;
}

// const server = awsServerlessExpress.createServer(app);

// exports.handler = (event, context) => {
//   console.log(`EVENT: ${JSON.stringify(event)}`);
//   awsServerlessExpress.proxy(server, event, context);
// };

// Export Lambda handler
exports.handler = (event, context) => {
  Promise.resolve(server || createServer({ SecretId: AWS_SECRET })).then((server) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    awsServerlessExpress.proxy(server, event, context)
  });
};
