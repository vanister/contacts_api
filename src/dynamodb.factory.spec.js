
const mockDocumentClient = jest.fn();

const mockProcessEnv = {
  AWS_ENDPOINT: 'test-endpoint',
  AWS_REGION: 'us-west-2',
  IS_OFFLINE: 'true',
};

jest.mock('aws-sdk/clients/dynamodb', () => ({ DocumentClient: mockDocumentClient }));

const { withProcessEnv } = require('./dynamodb.factory');

beforeEach(() => {
  jest.resetAllMocks();
});

test('should get an instance of a DocumentClient', () => {
  const documentClientCreator = withProcessEnv(mockProcessEnv);
  const docClient = documentClientCreator();

  expect(docClient).toBeDefined();

  expect(mockDocumentClient).toHaveBeenCalledWith({
    endpoint: 'test-endpoint',
    region: 'us-west-2'
  });
});

test('should create a DocumentClient without configs', () => {
  const notOffline = { IS_OFFLINE: undefined };

  const documentClientCreator = withProcessEnv(notOffline);
  const docClient = documentClientCreator();

  expect(docClient).toBeDefined();

  expect(mockDocumentClient).toHaveBeenCalledWith(undefined);
});
