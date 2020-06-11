const { DocumentClient } = require('aws-sdk/clients/dynamodb');

const withProcessEnv = ({
  AWS_ENDPOINT,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
}) => () => {
  const options = {
    endpoint: AWS_ENDPOINT,
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  };

  return new DocumentClient(options);
};

module.exports = {
  withProcessEnv,
};
