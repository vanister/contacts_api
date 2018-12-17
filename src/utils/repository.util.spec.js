const CONTACTS_TABLE = 'test-contacts-api-contacts';

const mockProcessEnv = {
  AWS_ENDPOINT: 'test-endpoint',
  AWS_REGION: 'us-west-2',
  IS_OFFLINE: 'true',
  CONTACTS_TABLE
};

const docClient = { name: 'docclient' };

const mockContactRepository = jest.fn();
const mockWithProcessEnv = jest.fn();

jest.mock('../repositories/contact.repository', () => ({ ContactRepository: mockContactRepository }));
jest.mock('../dynamodb.factory', () => ({ withProcessEnv: env => mockWithProcessEnv }));

const { createRepository } = require('./repository.util');

beforeEach(() => {
  jest.resetAllMocks();

  mockWithProcessEnv.mockImplementation(() => docClient);
});

test('create a repository with environment vars', () => {
  const repo = createRepository(mockProcessEnv)();

  expect(repo).toBeDefined();
  expect(mockContactRepository).toHaveBeenCalledWith(docClient, CONTACTS_TABLE);
  expect(mockWithProcessEnv).toHaveBeenCalled();
});

test('create a repository with a given name', () => {
  const tbl = 'not-the-default-test-name';
  const repo = createRepository(mockProcessEnv)(tbl);

  expect(repo).toBeDefined();
  expect(mockContactRepository).toHaveBeenCalledWith(docClient, tbl);
  expect(mockWithProcessEnv).toHaveBeenCalled();
});
