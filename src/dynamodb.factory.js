const { DocumentClient } = require('aws-sdk/clients/dynamodb');

/**
 * Creates a new instance of the Dynamodb DocumentClient.
 * @param {NodeJS.ProcessEnv} env The process.env object.
 * @returns {() => DocumentClient} An instance of the Dynamodb DocumentClient
 */
const withProcessEnv = ({ AWS_ENDPOINT, AWS_REGION, IS_OFFLINE }) => () => {
  let options;

  // we don't need to set the endpoint or region if we're running
  // from within AWS
  if (!!IS_OFFLINE) {
    options = {
      endpoint: AWS_ENDPOINT,
      region: AWS_REGION,
    };
  }

  return new DocumentClient(options);
};

module.exports = {
  withProcessEnv
};
