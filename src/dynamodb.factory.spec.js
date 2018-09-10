describe('Dynamo DB factory', () => {
  const mockDocumentClient = jest.fn();

  jest.mock('aws-sdk/clients/dynamodb', () => ({ DocumentClient: mockDocumentClient }));

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should get an instance of a DocumentClient', () => {
    const { withProcessEnv } = require('./dynamodb.factory');

    const documentClientCreator = withProcessEnv({});
    const docClient = documentClientCreator();

    expect(docClient).toBeDefined();

    expect(mockDocumentClient).toHaveBeenCalled();
  });
});