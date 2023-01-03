const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.handler = async (event) => {
  switch (event.httpMethod) {
    case 'GET':
      if (event.resource === '/user') {
        return getUser(event);
      } else if (event.resource === '/team') {
        return getTeam(event);
      } else if (event.resource === '/donations') {
        return getDonations(event);
      } else {
        return {
          statusCode: 404,
          body: 'Not Found'
        };
      }
    case 'POST':
      if (event.resource === '/donation') {
        return makeDonation(event);
      } else {
        return {
          statusCode: 404,
          body: 'Not Found'
        };
      }
    default:
      return {
        statusCode: 405,
        body: 'Method Not Allowed'
      };
  }
};

async function getUser(event) {
  const userId = event.queryStringParameters.userId;
  const result = await lambda.invoke({
    FunctionName: 'getUserFromDatabase',
    Payload: JSON.stringify({ userId })
  }).promise();
  return {
    statusCode: 200,
    body: result.Payload
  };
}

async function getTeam(event) {
  const result = await lambda.invoke({
    FunctionName: 'getTeamFromDatabase'
  }).promise();
  return {
    statusCode: 200,
    body: result.Payload
  };
}

async function getDonations(event) {
  const result = await lambda.invoke({
    FunctionName: 'getDonationsFromDatabase'
  }).promise();
  return {
    statusCode: 200,
    body: result.Payload
  };
}

async function makeDonation(event) {
  const body = JSON.parse(event.body);
  await lambda.invoke({
    FunctionName: 'makeDonationInDatabase',
    Payload: JSON.stringify(body)
  }).promise();
  return {
    statusCode: 200,
    body: 'Success'
  };
}